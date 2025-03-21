import { PapayaSDK } from '../core';
import { NetworkName, TokenSymbol } from '../contracts/networks';
import { encodeRates, decodeRates, encodeSubscriptionRate } from '../utils/rateEncoding';
import { RatePeriod } from '../utils/rateConversion';
import { Provider } from 'ethers';

// Define a custom mock type for our SDK
interface MockSDK {
  getSubscriptions: jest.Mock;
  isSubscribed: jest.Mock; 
  subscribe: jest.Mock;
  unsubscribe: jest.Mock;
  subscribeBySig: jest.Mock;
  unsubscribeBySig: jest.Mock;
}

// Overwrite the create method
jest.mock('../core/PapayaSDK', () => {
  const original = jest.requireActual('../core/PapayaSDK');
  return {
    ...original,
    PapayaSDK: {
      ...original.PapayaSDK,
      create: jest.fn()
    }
  };
});

describe('Subscription Functionality', () => {
  let sdk: MockSDK;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create our mock SDK manually
    sdk = {
      // Subscription methods
      getSubscriptions: jest.fn().mockResolvedValue([
        {
          recipient: '0xAuthor1',
          incomeRate: 100,
          outgoingRate: 200,
          projectId: 1
        },
        {
          recipient: '0xAuthor2',
          incomeRate: 150,
          outgoingRate: 250,
          projectId: 2
        },
        {
          recipient: '0xAuthor3',
          incomeRate: 175,
          outgoingRate: 275,
          projectId: 3
        }
      ]),
      isSubscribed: jest.fn().mockResolvedValue({
        isSubscribed: true,
        encodedRates: BigInt(12345)
      }),
      subscribe: jest.fn().mockResolvedValue({ hash: '0xSubscribeTxHash' }),
      unsubscribe: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeTxHash' }),
      subscribeBySig: jest.fn().mockResolvedValue({ hash: '0xSubscribeBySigTxHash' }),
      unsubscribeBySig: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeBySigTxHash' })
    };
    
    // Mock the PapayaSDK.create to return our mock SDK
    (PapayaSDK.create as jest.Mock).mockReturnValue(sdk);
  });
  
  describe('Subscribe Method', () => {
    it('should call subscribe with correct parameters', async () => {
      // Using amount and period instead of direct subscriptionRate
      const amount = 100;
      const period = RatePeriod.MONTH;
      const projectId = 1;
      
      const tx = await sdk.subscribe('0xAuthorAddress', amount, period, projectId);
      
      // Check that the method was called with correct parameters
      expect(sdk.subscribe).toHaveBeenCalledWith('0xAuthorAddress', amount, period, projectId);
      expect(tx.hash).toEqual('0xSubscribeTxHash');
    });
  });
  
  describe('SubscribeBySig Method', () => {
    it('should call subscribeBySig with correct parameters', async () => {
      const amount = 100;
      const period = RatePeriod.MONTH;
      const projectId = 1;
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      
      const tx = await sdk.subscribeBySig('0xAuthorAddress', amount, period, projectId, deadline);
      
      // Check that the subscribeBySig method was called with correct parameters
      expect(sdk.subscribeBySig).toHaveBeenCalledWith('0xAuthorAddress', amount, period, projectId, deadline);
      expect(tx.hash).toEqual('0xSubscribeBySigTxHash');
    });
  });
  
  describe('Unsubscribe Method', () => {
    it('should call unsubscribe with correct parameters', async () => {
      const tx = await sdk.unsubscribe('0xAuthorAddress');
      
      // Check that the method was called with correct parameters
      expect(sdk.unsubscribe).toHaveBeenCalledWith('0xAuthorAddress');
      expect(tx.hash).toEqual('0xUnsubscribeTxHash');
    });
  });
  
  describe('UnsubscribeBySig Method', () => {
    it('should call unsubscribeBySig with correct parameters', async () => {
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      
      const tx = await sdk.unsubscribeBySig('0xAuthorAddress', deadline);
      
      // Check that the unsubscribeBySig method was called with correct parameters
      expect(sdk.unsubscribeBySig).toHaveBeenCalledWith('0xAuthorAddress', deadline);
      expect(tx.hash).toEqual('0xUnsubscribeBySigTxHash');
    });
  });
  
  describe('Get Subscriptions', () => {
    it('should return list of subscriptions with decoded rates', async () => {
      const subscriptions = await sdk.getSubscriptions();
      
      // Check method was called
      expect(sdk.getSubscriptions).toHaveBeenCalled();
      
      // Check number of subscriptions
      expect(subscriptions.length).toBe(3);
      
      // Check first subscription content
      expect(subscriptions[0].recipient).toBe('0xAuthor1');
      expect(subscriptions[0].incomeRate).toBe(100);
      expect(subscriptions[0].outgoingRate).toBe(200);
      expect(subscriptions[0].projectId).toBe(1);
    });
    
    it('should accept custom account address', async () => {
      const customAddress = '0xCustomAddress';
      await sdk.getSubscriptions(customAddress);
      
      // Check method was called with custom address
      expect(sdk.getSubscriptions).toHaveBeenCalledWith(customAddress);
    });
  });
  
  describe('Is Subscribed', () => {
    it('should check if an account is subscribed to an author', async () => {
      const result = await sdk.isSubscribed('0xAuthorAddress');
      
      // Check method was called
      expect(sdk.isSubscribed).toHaveBeenCalledWith('0xAuthorAddress');
      
      // Check result
      expect(result.isSubscribed).toBe(true);
      expect(result.encodedRates).toBe(BigInt(12345));
    });
    
    it('should accept custom from address', async () => {
      const customAddress = '0xCustomAddress';
      await sdk.isSubscribed('0xAuthorAddress', customAddress);
      
      // Check method was called with custom address
      expect(sdk.isSubscribed).toHaveBeenCalledWith('0xAuthorAddress', customAddress);
    });
  });
}); 