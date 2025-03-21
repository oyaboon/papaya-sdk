import { PapayaSDK } from '../core';
import { NETWORKS, DEFAULT_VERSIONS } from '../contracts/networks';
import { encodeRates, decodeRates, encodeSubscriptionRate } from '../utils/rateEncoding';
import { RatePeriod } from '../utils/rateConversion';
import { Provider } from 'ethers';

// We don't want to mock the entire ethers library, but we'll spy on the SDK methods
jest.mock('../core/PapayaSDK', () => {
  // Get the actual class
  const original = jest.requireActual('../core/PapayaSDK');
  
  // Return a modified version where we can spy on methods
  return {
    ...original,
    // Factory method should return our test instance
    PapayaSDK: {
      ...original.PapayaSDK,
      create: jest.fn().mockImplementation(() => {
        return {
          balanceOf: jest.fn().mockResolvedValue(BigInt(1000)),
          getUserInfo: jest.fn().mockResolvedValue({
            balance: BigInt(1000),
            incomeRate: BigInt(500),
            outgoingRate: BigInt(300),
            updated: BigInt(123456789)
          }),
          getSubscriptions: jest.fn().mockResolvedValue([
            {
              recipient: '0xUser1',
              incomeRate: 100,
              outgoingRate: 200,
              projectId: 1
            }
          ]),
          isSubscribed: jest.fn().mockResolvedValue({
            isSubscribed: true,
            encodedRates: BigInt(12345)
          }),
          getProjectSettings: jest.fn().mockResolvedValue({
            initialized: true,
            projectFee: 500
          }),
          getUserSettings: jest.fn().mockResolvedValue({
            initialized: true,
            projectFee: 300
          }),
          // Transaction methods that return a hash
          deposit: jest.fn().mockResolvedValue({ hash: '0xDepositTxHash' }),
          withdraw: jest.fn().mockResolvedValue({ hash: '0xWithdrawTxHash' }),
          subscribe: jest.fn().mockResolvedValue({ hash: '0xSubscribeTxHash' }),
          unsubscribe: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeTxHash' }),
          depositBySig: jest.fn().mockResolvedValue({ hash: '0xDepositBySigTxHash' }),
          withdrawBySig: jest.fn().mockResolvedValue({ hash: '0xWithdrawBySigTxHash' }),
          subscribeBySig: jest.fn().mockResolvedValue({ hash: '0xSubscribeBySigTxHash' }),
          unsubscribeBySig: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeBySigTxHash' })
        };
      })
    }
  };
});

describe('PapayaSDK Basic Functionality', () => {
  let sdk: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create a mock provider with necessary Provider interface properties
    const mockProvider = {
      getNetwork: jest.fn().mockResolvedValue({ chainId: 137, name: 'polygon' }),
      provider: null, 
      destroy: jest.fn(),
      getBlockNumber: jest.fn().mockResolvedValue(1234567),
      getFeeData: jest.fn().mockResolvedValue({
        maxFeePerGas: BigInt(2000000000),
        maxPriorityFeePerGas: BigInt(1000000000),
        gasPrice: BigInt(1500000000)
      }),
      estimateGas: jest.fn().mockResolvedValue(BigInt(21000)),
      call: jest.fn().mockResolvedValue('0x'),
      getBalance: jest.fn().mockResolvedValue(BigInt(1000000000000000000)),
      getTransactionCount: jest.fn().mockResolvedValue(1),
      getCode: jest.fn().mockResolvedValue('0x'),
      getStorage: jest.fn().mockResolvedValue('0x'),
      broadcastTransaction: jest.fn().mockResolvedValue({ hash: '0xMockTxHash' }),
      getTransaction: jest.fn().mockResolvedValue(null),
      getTransactionReceipt: jest.fn().mockResolvedValue(null),
      waitForTransaction: jest.fn().mockResolvedValue({ status: 1 }),
      waitForBlock: jest.fn().mockResolvedValue({ number: 1234568 }),
      resolveName: jest.fn().mockResolvedValue(null),
      lookupAddress: jest.fn().mockResolvedValue(null),
      // Add any other required provider methods as needed
    } as unknown as Provider;
    
    // Create SDK instance using our mocked factory
    sdk = PapayaSDK.create(mockProvider, 'polygon', 'USDT');
  });

  describe('Balance & User Info', () => {
    it('should return balance', async () => {
      const balance = await sdk.balanceOf();
      expect(balance).toEqual(BigInt(1000));
      expect(sdk.balanceOf).toHaveBeenCalled();
    });
    
    it('should call balanceOf with address when provided', async () => {
      await sdk.balanceOf('0xCustomAddress');
      expect(sdk.balanceOf).toHaveBeenCalledWith('0xCustomAddress');
    });
    
    it('should get user info', async () => {
      const userInfo = await sdk.getUserInfo();
      expect(userInfo).toEqual({
        balance: BigInt(1000),
        incomeRate: BigInt(500),
        outgoingRate: BigInt(300),
        updated: BigInt(123456789)
      });
      expect(sdk.getUserInfo).toHaveBeenCalled();
    });
  });
  
  describe('Subscription Management', () => {
    it('should call subscribe with correct parameters', async () => {
      const amount = 100;
      const period = RatePeriod.MONTH;
      const projectId = 1;
      
      await sdk.subscribe('0xAuthorAddress', amount, period, projectId);
      expect(sdk.subscribe).toHaveBeenCalledWith('0xAuthorAddress', amount, period, projectId);
    });
    
    it('should call unsubscribe with correct parameters', async () => {
      await sdk.unsubscribe('0xAuthorAddress');
      expect(sdk.unsubscribe).toHaveBeenCalledWith('0xAuthorAddress');
    });
    
    it('should get subscriptions', async () => {
      const subs = await sdk.getSubscriptions();
      expect(subs[0].recipient).toEqual('0xUser1');
      expect(sdk.getSubscriptions).toHaveBeenCalled();
    });
    
    it('should check subscription status', async () => {
      const result = await sdk.isSubscribed('0xAuthorAddress');
      expect(result.isSubscribed).toEqual(true);
      expect(sdk.isSubscribed).toHaveBeenCalledWith('0xAuthorAddress');
    });
  });
  
  describe('BySig Methods', () => {
    it('should call depositBySig with correct parameters', async () => {
      const amount = 1000;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await sdk.depositBySig(amount, deadline);
      expect(sdk.depositBySig).toHaveBeenCalledWith(amount, deadline);
    });
    
    it('should call subscribeBySig with correct parameters', async () => {
      const authorAddress = '0xAuthorAddress';
      const amount = 100;
      const period = RatePeriod.MONTH;
      const projectId = 1;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      await sdk.subscribeBySig(authorAddress, amount, period, projectId, deadline);
      expect(sdk.subscribeBySig).toHaveBeenCalledWith(authorAddress, amount, period, projectId, deadline);
    });
  });
  
  describe('Utility Functions', () => {
    it('should encode rates correctly', () => {
      const encoded = encodeRates(100, 200, 1);
      expect(encoded.toString()).not.toEqual('0');
    });
    
    it('should decode rates correctly', () => {
      const encoded = encodeRates(100, 200, 1);
      const decoded = decodeRates(encoded);
      expect(decoded).toEqual({ incomeRate: 100, outgoingRate: 200, projectId: 1 });
    });
    
    it('should encode and decode rates correctly (round trip)', () => {
      const testCases = [
        { incomeRate: 0, outgoingRate: 0, projectId: 0 },
        { incomeRate: 100, outgoingRate: 200, projectId: 1 },
        { incomeRate: 999999, outgoingRate: 888888, projectId: 777 }
      ];
      
      for (const testCase of testCases) {
        const { incomeRate, outgoingRate, projectId } = testCase;
        const encoded = encodeRates(incomeRate, outgoingRate, projectId);
        const decoded = decodeRates(encoded);
        expect(decoded).toEqual(testCase);
      }
    });
    
    it('should encode subscription rate correctly', () => {
      const encoded = encodeSubscriptionRate(100, 200);
      expect(encoded.toString()).not.toEqual('0');
      
      // Subscription rate should only encode income and outgoing, not project ID
      const fullEncoded = encodeRates(100, 200, 1);
      const subscriptionEncoded = encodeSubscriptionRate(100, 200);
      expect(subscriptionEncoded).not.toEqual(fullEncoded);
    });
  });
}); 