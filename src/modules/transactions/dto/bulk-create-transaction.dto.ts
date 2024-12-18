import { IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkCreateTransactionDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  transactions: CreateTransactionDto[];
}

class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  account: string;
}
