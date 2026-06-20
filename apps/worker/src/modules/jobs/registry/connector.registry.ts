import { JobSource } from '@prisma/client';
import { JobConnector } from '../types/raw-job';
import { YCConnector } from '../connectors/yc/yc.connector';

type ConnectorFactory = () => JobConnector;

export class ConnectorRegistry {
  private static registry = new Map<JobSource, ConnectorFactory>();

  static {
    // Register YC Connector lazily
    this.registry.set(
      JobSource.YC,
      () => new YCConnector()
    );

    // Future placeholders:
    // this.registry.set(JobSource.WELLFOUND, () => new WellfoundConnector());
    // this.registry.set(JobSource.NAUKRI, () => new NaukriConnector());
    // this.registry.set(JobSource.LINKEDIN, () => new LinkedInConnector());
  }

  /**
   * Resolves a JobConnector factory lazily by its JobSource.
   */
  public static get(source: JobSource): JobConnector {
    const factory = this.registry.get(source);

    if (!factory) {
      throw new Error(`No connector registered for source: ${source}`);
    }

    return factory();
  }
}
