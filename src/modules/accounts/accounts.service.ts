import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private transactionModel: Model<Account>,
  ) {}

  async getById(id: Types.ObjectId): Promise<AccountDocument> {
    return this.transactionModel.findById(id).exec();
  }

  async updateBalance(
    id: Types.ObjectId,
    newBalance: number,
  ): Promise<AccountDocument> {
    return this.transactionModel
      .findByIdAndUpdate(id, { balance: newBalance })
      .exec();
  }
}
