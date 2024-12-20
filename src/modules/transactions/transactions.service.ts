import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { BulkCreateTransactionDto } from './dto/bulk-create-transaction.dto';
import { Types } from 'mongoose';
import { AccountsService } from '../accounts/accounts.service';
import { STATUS } from '../../constants';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly accountsService: AccountsService,
  ) {}

  async bulkCreate(data: BulkCreateTransactionDto) {
    return this.transactionModel.insertMany(data.transactions);
  }

  async getById(id: Types.ObjectId): Promise<TransactionDocument> {
    return this.transactionModel.findById(id).populate('account').exec();
  }

  async updateStatus(
    id: Types.ObjectId,
    success: boolean,
  ): Promise<TransactionDocument> {
    const status = success ? STATUS.SUCCESS : STATUS.FAILED;
    return this.transactionModel.findByIdAndUpdate(id, { status }).exec();
  }

  async processTransaction(transactionId: Types.ObjectId): Promise<boolean> {
    const transaction = await this.getById(transactionId);
    if (!transaction || transaction.status !== STATUS.PENDING) {
      this.logger.warn(`No valid transaction found for ${transactionId}`);
      return false;
    }

    if (!transaction.account) {
      this.logger.warn(`No account found for ${transaction.account}`);
      await this.updateStatus(transaction.id, false);
      return false;
    }

    const newBalanace = this.accountsService.calculateBalance(
      transaction.account,
      transaction.value,
    );

    if (this.accountsService.isValidBalance(newBalanace)) {
      await this.accountsService.updateBalance(
        transaction.account.id,
        newBalanace,
      );
      await this.updateStatus(transaction.id, true);
    } else {
      this.logger.warn(
        `Transaction failed for ${transaction.id}: insufficient balance`,
      );
    }
  }
}
