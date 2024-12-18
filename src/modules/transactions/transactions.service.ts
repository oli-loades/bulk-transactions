import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { BulkCreateTransactionDto } from './dto/bulk-create-transaction.dto';
import { Types } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
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
}
