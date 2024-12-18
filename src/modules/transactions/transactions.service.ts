import { Model } from 'mongoose';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { BulkCreateTransactionDto } from './dto/bulk-create-transaction.dto';
import { Types } from 'mongoose';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @Inject(AccountsService) private readonly accountsService: AccountsService,
  ) {}

  async bulkCreate(
    data: BulkCreateTransactionDto,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel.insertMany(data.transactions);
  }

  async getById(id: Types.ObjectId): Promise<TransactionDocument> {
    return this.transactionModel.findById(id).exec();
  }

  async updateStatus(
    id: Types.ObjectId,
    success: boolean,
  ): Promise<TransactionDocument> {
    const status = success ? 'SUCCESS' : 'FAILED';
    return this.transactionModel.findByIdAndUpdate(id, { status }).exec();
  }

  async processTransaction(transactionId: Types.ObjectId): Promise<boolean> {
    let success = false;
    const transaction = await this.getById(transactionId);
    if (transaction && transaction.status === 'PENDING') {
      // issue - transaction.account has the type of Types.ObjectId but when passed to accountsService.getById acts as string
      const accountId = new Types.ObjectId(transaction.account);
      const account = await this.accountsService.getById(accountId);
      if (account) {
        const newBalanace = this.accountsService.calculateBalance(
          account,
          transaction.value,
        );
        if (this.accountsService.isValidBalance(newBalanace)) {
          await this.accountsService.updateBalance(account, newBalanace);
          success = true;
        } else {
          this.logger.warn(
            `Transaction failed for ${transaction.id}: insufficient balance`,
          );
        }
      } else {
        this.logger.warn(`No account found for ${transaction.account}`);
      }
      await this.updateStatus(transaction.id, success);
    } else {
      this.logger.warn(`No valid transaction found for ${transactionId}`);
    }
    return success;
  }
}
