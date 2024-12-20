import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TransactionsService } from './transactions.service';
import { TRANSACTIONS_QUEUE } from '../../contants';

@Processor(TRANSACTIONS_QUEUE)
export class TransactionProcessor extends WorkerHost {
  @Inject(TransactionsService)
  private readonly transactionsService: TransactionsService;

  async process(job: Job) {
    await this.transactionsService.processTransaction(job.data.id);
  }
}
