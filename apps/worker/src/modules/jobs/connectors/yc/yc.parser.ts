export class YCParser {
  /**
   * Parse Hacker News titles: "Company (YC Batch) is hiring Job Title" or "Company is hiring Job Title"
   */
  public static parseHnTitle(title: string): { company: string; jobTitle: string } {
    let company = '';
    let jobTitle = '';

    // Remove any trailing "hiring" indicators or trailing whitespace
    title = title.replace(/\s*is\s+hiring\s*$/i, '');

    // 1. Matches "Company (YC Batch) is hiring Job Title" or "Company (Details) hiring Job Title"
    const matchParenthesis = title.match(/^([^(]+)\(([^)]+)\)\s*(?:is\s+)?hiring\s+(.+)$/i);
    if (matchParenthesis) {
      company = matchParenthesis[1].trim();
      jobTitle = matchParenthesis[3].trim();
    } else {
      // 2. Matches "Company is hiring Job Title" or "Company hiring Job Title"
      const matchHiring = title.match(/^(.+?)\s+(?:is\s+)?hiring\s+(.+)$/i);
      if (matchHiring) {
        company = matchHiring[1].trim();
        jobTitle = matchHiring[2].trim();
      } else {
        // 3. Fallback: split by colon
        const splitColon = title.split(':');
        if (splitColon.length > 1) {
          company = splitColon[0].trim();
          jobTitle = splitColon.slice(1).join(':').trim();
        } else {
          // 4. Fallback: split by dash
          const splitDash = title.split('–');
          if (splitDash.length > 1) {
            company = splitDash[0].trim();
            jobTitle = splitDash.slice(1).join('–').trim();
          } else {
            company = 'YC Startup';
            jobTitle = title.trim();
          }
        }
      }
    }

    // Clean company name
    company = company.replace(/^[^\w]+|[^\w]+$/g, '').trim(); 
    if (!company) {
      company = 'YC Startup';
    }

    return { company, jobTitle };
  }
}
