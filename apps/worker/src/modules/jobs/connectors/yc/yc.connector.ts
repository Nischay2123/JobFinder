import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawJob, JobConnector } from '../../types/raw-job';
import { YCParser } from './yc.parser';
import { HnItemPayload } from './yc.types';

export class YCConnector implements JobConnector {
  /**
   * Fetch jobs using tiered strategy:
   * 1. Official HN Firebase JSON API
   * 2. Cheerio Scraping of HN jobs HTML
   * 3. Playwright (Optional placeholder)
   */
  async fetchJobs(): Promise<RawJob[]> {
    console.log('[YCConnector] Starting job fetch...');

    // Tier 1: Try Hacker News Firebase JSON API
    try {
      const jobs = await this.fetchViaJsonApi();
      if (jobs && jobs.length > 0) {
        console.log(`[YCConnector] Tier 1 (JSON API) succeeded: Found ${jobs.length} jobs.`);
        return jobs;
      }
    } catch (error: any) {
      console.warn('[YCConnector] Tier 1 (JSON API) failed, trying Tier 2. Error:', error.message);
    }

    // Tier 2: Try Cheerio scraping of https://news.ycombinator.com/jobs
    try {
      const jobs = await this.fetchViaCheerio();
      if (jobs && jobs.length > 0) {
        console.log(`[YCConnector] Tier 2 (Cheerio) succeeded: Found ${jobs.length} jobs.`);
        return jobs;
      }
    } catch (error: any) {
      console.warn('[YCConnector] Tier 2 (Cheerio) failed, trying Tier 3. Error:', error.message);
    }

    // Tier 3: Playwright (Placeholder / last resort)
    try {
      const jobs = await this.fetchViaPlaywright();
      if (jobs && jobs.length > 0) {
        console.log(`[YCConnector] Tier 3 (Playwright) succeeded: Found ${jobs.length} jobs.`);
        return jobs;
      }
    } catch (error: any) {
      console.error('[YCConnector] Tier 3 (Playwright) failed. Error:', error.message);
    }

    throw new Error('YCConnector failed to retrieve jobs from all sources.');
  }

  /**
   * Tier 1: HN Firebase API
   */
  private async fetchViaJsonApi(): Promise<RawJob[]> {
    console.log('[YCConnector] Attempting Tier 1 (Hacker News Firebase API)...');
    
    // Fetch latest jobstory IDs (capped at 50 to avoid rate limits)
    const { data: jobIds } = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/jobstories.json',
      { timeout: 8000 }
    );

    if (!jobIds || !Array.isArray(jobIds)) {
      throw new Error('Invalid jobstories format received from HN API');
    }

    const targetIds = jobIds.slice(0, 40); // Fetch top 40 jobs
    const rawJobs: RawJob[] = [];

    // Fetch details for each job concurrently
    const promises = targetIds.map(async (id) => {
      try {
        const { data: item } = await axios.get<HnItemPayload>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { timeout: 5000 }
        );

        if (item && item.type === 'job') {
          const title = item.title || '';
          const applyUrl = item.url || `https://news.ycombinator.com/item?id=${id}`;
          const description = item.text || 'Refer to application link for details.';
          const postedDate = item.time ? new Date(item.time * 1000) : new Date();

          const { company, jobTitle } = YCParser.parseHnTitle(title);

          rawJobs.push({
            source: 'YC',
            sourceJobId: String(id),
            title: jobTitle,
            company,
            description,
            applyUrl,
            postedDate,
            rawPayload: item,
          });
        }
      } catch (err: any) {
        console.warn(`[YCConnector] Failed to fetch HN item details for ID ${id}:`, err.message);
      }
    });

    await Promise.all(promises);
    return rawJobs;
  }

  /**
   * Tier 2: Cheerio Scraping of https://news.ycombinator.com/jobs
   */
  private async fetchViaCheerio(): Promise<RawJob[]> {
    console.log('[YCConnector] Attempting Tier 2 (Cheerio Scraping)...');
    
    const { data: html } = await axios.get(
      'https://news.ycombinator.com/jobs',
      { timeout: 8000 }
    );

    const $ = cheerio.load(html);
    const rawJobs: RawJob[] = [];

    $('.athing').each((_i, el) => {
      const id = $(el).attr('id') || '';
      const titleLink = $(el).find('.titleline > a');
      const titleText = titleLink.text() || '';
      const applyUrl = titleLink.attr('href') || `https://news.ycombinator.com/item?id=${id}`;

      // Posted Date extraction from the next row
      const subtextRow = $(el).next();
      const ageLink = subtextRow.find('.age');
      const ageTitle = ageLink.attr('title') || ''; // e.g. "2026-06-20T12:00:00"
      const postedDate = ageTitle ? new Date(ageTitle) : new Date();

      const { company, jobTitle } = YCParser.parseHnTitle(titleText);

      if (id && titleText) {
        rawJobs.push({
          source: 'YC',
          sourceJobId: id,
          title: jobTitle,
          company,
          description: 'Refer to application link for details.',
          applyUrl,
          postedDate,
          rawPayload: {
            id,
            titleText,
            applyUrl,
            ageTitle,
          },
        });
      }
    });

    return rawJobs;
  }

  /**
   * Tier 3: Playwright Scraping
   */
  private async fetchViaPlaywright(): Promise<RawJob[]> {
    console.log('[YCConnector] Attempting Tier 3 (Playwright Scraper)...');
    
    try {
      // @ts-ignore
      const { chromium } = await import('playwright');
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.goto('https://news.ycombinator.com/jobs', { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const jobElements = await page.$$('.athing');
      const rawJobs: RawJob[] = [];

      for (const el of jobElements) {
        const id = (await el.getAttribute('id')) || '';
        const titleLink = await el.$('.titleline > a');
        
        if (titleLink) {
          const titleText = (await titleLink.textContent()) || '';
          const applyUrl = (await titleLink.getAttribute('href')) || `https://news.ycombinator.com/item?id=${id}`;
          
          const { company, jobTitle } = YCParser.parseHnTitle(titleText);

          rawJobs.push({
            source: 'YC',
            sourceJobId: id,
            title: jobTitle,
            company,
            description: 'Refer to application link for details.',
            applyUrl,
            postedDate: new Date(),
            rawPayload: { id, titleText, applyUrl, source: 'playwright' },
          });
        }
      }

      await browser.close();
      return rawJobs;
    } catch (err: any) {
      throw new Error(`Playwright execution failed: ${err.message}`);
    }
  }
}
