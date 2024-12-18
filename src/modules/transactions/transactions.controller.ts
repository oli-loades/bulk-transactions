import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { BulkCreateTransactionDto } from './dto/bulk-create-transaction.dto';

@Controller('bulk-transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  async create(@Body() data: BulkCreateTransactionDto) {
    return this.transactionService.bulkCreate(data);
  }
}
