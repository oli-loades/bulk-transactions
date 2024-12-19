import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async getById(id: Types.ObjectId): Promise<AccountDocument> {
    return this.accountModel.findById(id).exec();
  }

  async updateBalance(
    accout: AccountDocument,
    newBalance: number,
  ): Promise<AccountDocument> {
    return accout.updateOne({ balance: newBalance });
  }

  calculateBalance(account: AccountDocument, balanceChange: number): number {
    return account.balance + balanceChange;
  }

  isValidBalance(balance: number): boolean {
    return balance >= 0;
  }
}
