import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener('transactions')
export class TransactionsEventsListener extends QueueEventsHost {
  private readonly logger = new Logger(TransactionsEventsListener.name);

  @OnQueueEvent('active')
  onActive(job: { jobId: string }) {
    this.logger.debug(`Started job ${job.jobId}`);
  }
  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string }) {
    this.logger.debug(`Finished job ${job.jobId}`);
  }
}
