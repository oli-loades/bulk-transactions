import { Inject, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from './transactions.service';
import { Types } from 'mongoose';

@Processor('transactions')
export class TransactionProcessor extends WorkerHost {
  private readonly logger = new Logger(TransactionProcessor.name);

  @Inject(AccountsService)
  private readonly accountsService: AccountsService;

  @Inject(TransactionsService)
  private readonly transactionService: TransactionsService;

  async process(job: Job) {
    const transaction = await this.transactionService.getById(job.data.id);
    if (transaction) {
      let success = false;
      // issue - transaction.account has the type of Types.ObjectId but when passed to accountsService.getById acts as string
      const accountId = new Types.ObjectId(transaction.account);
      const account = await this.accountsService.getById(accountId);
      if (account) {
        const newBalanace = this.accountsService.calculateBalance(
          account,
          transaction.value,
        );
        await this.accountsService.updateBalance(account, newBalanace);
        success = true;
      } else {
        this.logger.warn(
          `No account found for ${transaction.account} in job ${job.id}`,
        );
      }
      await this.transactionService.updateStatus(transaction.id, success);
    } else {
      this.logger.warn(
        `No Transaction found for ${job.data.id} in job ${job.id}`,
      );
    }
  }
}
