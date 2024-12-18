import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from './transactions.service';
import { Types } from 'mongoose';

@Processor('transactions')
export class TransactionProcessor extends WorkerHost {
  @Inject(AccountsService)
  private readonly accountsService: AccountsService;

  @Inject(TransactionsService)
  private readonly transactionService: TransactionsService;

  async process(job: Job) {
    console.log('job started');
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
      }
      await this.transactionService.updateStatus(transaction.id, success);
    }
    console.log('job completed');
  }
}
