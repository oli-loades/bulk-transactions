import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { TRANSACTIONS_QUEUE } from '../../contants';

describe('TransactionsController', () => {
  const transactions = [
    {
      account: '1',
      value: 100,
    },
  ];

  const mockQueue = {
    add: jest.fn(),
  };

  const mockTransactionService = {
    bulkCreate: jest.fn().mockResolvedValueOnce(transactions),
  };

  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        { provide: getQueueToken(TRANSACTIONS_QUEUE), useValue: Queue },
      ],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionService)
      .overrideProvider(getQueueToken(TRANSACTIONS_QUEUE))
      .useValue(mockQueue)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of created transactions and add each to the queue', async () => {
    const response = await controller.create({ transactions });
    expect(mockQueue.add).toHaveBeenCalledTimes(transactions.length);
    expect(response).toHaveLength(transactions.length);
  });
});
