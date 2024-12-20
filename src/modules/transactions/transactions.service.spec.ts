import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AccountsService } from '../accounts/accounts.service';
import { STATUS } from '../../constants';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<TransactionDocument>;
  let mockPendingTransaction;
  const mockAccountService = {
    getById: jest.fn(),
    calculateBalance: jest.fn(),
    isValidBalance: jest.fn(),
    updateBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        AccountsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: Model,
        },
      ],
    })
      .overrideProvider(AccountsService)
      .useValue(mockAccountService)
      .compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionModel = module.get<Model<TransactionDocument>>(
      getModelToken(Transaction.name),
    );

    transactionModel.findByIdAndUpdate = jest
      .fn()
      .mockImplementationOnce((id, data) => ({
        exec: jest
          .fn()
          .mockResolvedValueOnce({ id, ...mockPendingTransaction, ...data }),
      }));

    mockPendingTransaction = {
      id: new Types.ObjectId(),
      status: STATUS.PENDING,
      value: 100,
      account: '6762d84f4ab222af440dcef1',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStatus', () => {
    it('should return the transaction with the status of SUCCES when flag is set to true', async () => {
      const transaction = await service.updateStatus(
        mockPendingTransaction.id,
        true,
      );
      expect(transaction.status).toEqual(STATUS.SUCCESS);
    });

    it('should return the transaction with the status of FAILED when flag is set to true', async () => {
      const transaction = await service.updateStatus(
        mockPendingTransaction.id,
        false,
      );
      expect(transaction.status).toEqual(STATUS.FAILED);
    });
  });

  describe('processTransaction', () => {
    it('should return true if the the transaction was processed succesfully', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockPendingTransaction);
      mockAccountService.getById.mockResolvedValueOnce({ balance: 1000 });
      mockAccountService.isValidBalance.mockReturnValueOnce(true);
      const success = await service.processTransaction(
        mockPendingTransaction.id,
      );
      expect(success).toBe(true);
    });

    it('should return false if the the transaction was not found', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(null);
      const success = await service.processTransaction(
        mockPendingTransaction.id,
      );
      expect(success).toBe(false);
    });

    it('should return false if the account associated with the transaction was not found', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockPendingTransaction);
      mockAccountService.getById.mockResolvedValueOnce(null);
      const success = await service.processTransaction(
        mockPendingTransaction.id,
      );
      expect(success).toBe(false);
    });

    it('should return false if the accounts balance is not valid', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockPendingTransaction);
      mockAccountService.getById.mockResolvedValueOnce({ balance: 1000 });
      mockAccountService.isValidBalance.mockReturnValueOnce(false);
      const success = await service.processTransaction(
        mockPendingTransaction.id,
      );
      expect(success).toBe(false);
    });
  });
});
