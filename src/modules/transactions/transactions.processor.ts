import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TransactionsService } from './transactions.service';

@Processor('transactions')
export class TransactionProcessor extends WorkerHost {
  @Inject(TransactionsService)
  private readonly transactionsService: TransactionsService;

  async process(job: Job) {
    await this.transactionsService.processTransaction(job.data.id);
  }
}
