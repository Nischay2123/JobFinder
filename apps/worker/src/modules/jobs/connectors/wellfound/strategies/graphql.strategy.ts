import axios from 'axios';
import { RawJob } from '../../../types/raw-job';
import { WellfoundStrategy } from './wellfound-strategy.interface';
import { WellfoundParser } from '../wellfound.parser';
import { WellfoundGraphQLResponse } from '../wellfound.types';
import { createLogger } from '@job-finder/logger';

const logger = createLogger('WellfoundGraphQLStrategy');

export class WellfoundGraphQLStrategy implements WellfoundStrategy {
  public readonly name = 'GraphQLStrategy';

  public async fetchJobs(): Promise<RawJob[]> {
    const url = 'https://wellfound.com/graphql';
    const query = `
      query JobSearchResults($input: JobSearchResultsInput) {
        jobSearchResults(input: $input) {
          jobs {
            id
            title
            description
            applyUrl
            location
            company {
              name
              website
            }
            postedAt
          }
        }
      }
    `;

    const variables = {
      input: {
        role: 'Software Engineer',
        location: 'Remote',
      },
    };

    logger.debug('[WellfoundGraphQLStrategy] Requesting Wellfound GraphQL endpoint...');

    const response = await axios.post<WellfoundGraphQLResponse>(
      url,
      {
        operationName: 'JobSearchResults',
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data.errors && response.data.errors.length > 0) {
      const errMsg = response.data.errors.map((e) => e.message).join(', ');
      throw new Error(`GraphQL Errors: ${errMsg}`);
    }

    return WellfoundParser.parseGraphQL(response.data);
  }
}
