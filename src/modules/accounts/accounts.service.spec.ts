import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { Model } from 'mongoose';
import { Account } from './schemas/account.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockAccount;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken(Account.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    mockAccount = {
      balance: 100,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateBalance', () => {
    it('should return the new balance when increasing the balance', () => {
      const newBalance = service.calculateBalance(mockAccount, 500);
      expect(newBalance).toEqual(600);
    });

    it('should return the new balance when decreasing the balance', () => {
      const newBalance = service.calculateBalance(mockAccount, -50);
      expect(newBalance).toEqual(50);
    });

    it('should return the new balance when not changing the balance', () => {
      const newBalance = service.calculateBalance(mockAccount, 0);
      expect(newBalance).toEqual(100);
    });
  });

  describe('isValidBalance', () => {
    it('should return true if balance is above 0', () => {
      const valid = service.isValidBalance(500);
      expect(valid).toBe(true);
    });

    it('should return true if balance is 0', () => {
      const valid = service.isValidBalance(0);
      expect(valid).toBe(true);
    });

    it('should return false if balance is below 0', () => {
      const valid = service.isValidBalance(-100);
      expect(valid).toBe(false);
    });
  });
});
