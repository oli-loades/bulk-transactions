import { Body, Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { TransactionsService } from './transactions.service';
import { BulkCreateTransactionDto } from './dto/bulk-create-transaction.dto';
import { Queue } from 'bullmq';

@Controller('bulk-transactions')
export class TransactionsController {
  constructor(
    @InjectQueue('transactions') private transactionQueue: Queue,
    readonly transactionService: TransactionsService,
  ) {}

  @Post()
  async create(@Body() data: BulkCreateTransactionDto) {
    const transactions = await this.transactionService.bulkCreate(data);
    for (const transaction of transactions) {
      await this.transactionQueue.add('transaction', {
        id: transaction.id,
      });
    }
    return transactions;
  }
}
