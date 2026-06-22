import axios from 'axios';
import * as cheerio from 'cheerio';
import { RawJob } from '../../../types/raw-job';
import { WellfoundStrategy } from './wellfound-strategy.interface';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('WellfoundHTMLStrategy');

export class WellfoundHTMLStrategy implements WellfoundStrategy {
  public readonly name = 'HTMLStrategy';

  public async fetchJobs(): Promise<RawJob[]> {
    logger.debug('[WellfoundHTMLStrategy] Fetching Wellfound jobs HTML...');
    const url = 'https://wellfound.com/jobs';

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const rawJobs: RawJob[] = [];

    // Attempt to parse application/ld+json job posting elements if any exist
    $('script[type="application/ld+json"]').each((_, elem) => {
      try {
        const text = $(elem).html();
        if (text) {
          const data = JSON.parse(text);
          if (data['@type'] === 'JobPosting' || (Array.isArray(data) && data.some(item => item['@type'] === 'JobPosting'))) {
            const postings = Array.isArray(data) ? data : [data];
            for (const item of postings) {
              if (item['@type'] === 'JobPosting') {
                rawJobs.push({
                  source: 'WELLFOUND',
                  sourceJobId: item.identifier?.value || item.url || String(Math.random()),
                  title: item.title,
                  company: item.hiringOrganization?.name || 'Wellfound Company',
                  companyWebsite: item.hiringOrganization?.sameAs || undefined,
                  description: item.description || 'Refer to application link for details.',
                  location: item.jobLocation?.address?.addressLocality || 'Remote',
                  applyUrl: item.url || url,
                  postedDate: item.datePosted ? new Date(item.datePosted) : new Date(),
                  rawPayload: item,
                });
              }
            }
          }
        }
      } catch (e) {
        // ignore malformed JSON-LD
      }
    });

    if (rawJobs.length === 0) {
      throw new Error('HTMLStrategy failed: No jobs could be parsed from the page HTML.');
    }

    return rawJobs;
  }
}
