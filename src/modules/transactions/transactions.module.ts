import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionProcessor } from './transactions.processor';
import { TransactionsEventsListener } from './transactions.eventlistener';
import { TRANSACTIONS_QUEUE } from '../../constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    BullModule.registerQueue({
      name: TRANSACTIONS_QUEUE,
    }),
    AccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionProcessor,
    TransactionsEventsListener,
  ],
})
export class TransactionsModule {}
