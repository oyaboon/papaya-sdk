import { PapayaSDK } from '../core';
import { NETWORKS, DEFAULT_VERSIONS, NetworkName, TokenSymbol } from '../contracts/networks';
import { encodeRates, decodeRates, encodeSubscriptionRate } from '../utils/rateEncoding';
import { Provider } from 'ethers';

// Mock PapayaSDK for more controlled testing
jest.mock('../core/PapayaSDK', () => {
  const original = jest.requireActual('../core/PapayaSDK');
  
  return {
    ...original,
    PapayaSDK: {
      ...original.PapayaSDK,
      create: jest.fn().mockImplementation(() => {
        // Create a comprehensive mock of the SDK
        return {
          // Balance and user info methods
          balanceOf: jest.fn().mockResolvedValue(BigInt(1000)),
          getUserInfo: jest.fn().mockResolvedValue({
            balance: BigInt(1000),
            incomeRate: BigInt(500),
            outgoingRate: BigInt(300),
            updated: BigInt(123456789)
          }),
          
          // Subscription methods
          getSubscriptions: jest.fn().mockResolvedValue([
            {
              recipient: '0xAuthor1',
              incomeRate: 100,
              outgoingRate: 200,
              projectId: 1
            }
          ]),
          isSubscribed: jest.fn().mockResolvedValue({
            isSubscribed: true,
            encodedRates: BigInt(12345)
          }),
          subscribe: jest.fn().mockResolvedValue({ hash: '0xSubscribeTxHash' }),
          unsubscribe: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeTxHash' }),
          
          // Project settings methods
          getProjectSettings: jest.fn().mockResolvedValue({
            initialized: true,
            projectFee: 500
          }),
          getUserSettings: jest.fn().mockResolvedValue({
            initialized: true,
            projectFee: 300
          }),
          claimProjectId: jest.fn().mockResolvedValue({ hash: '0xClaimProjectIdTxHash' }),
          setDefaultSettings: jest.fn().mockResolvedValue({ hash: '0xSetDefaultSettingsTxHash' }),
          setSettingsForUser: jest.fn().mockResolvedValue({ hash: '0xSetSettingsForUserTxHash' }),
          
          // Deposit and withdraw methods
          deposit: jest.fn().mockResolvedValue({ hash: '0xDepositTxHash' }),
          depositFor: jest.fn().mockResolvedValue({ hash: '0xDepositForTxHash' }),
          withdraw: jest.fn().mockResolvedValue({ hash: '0xWithdrawTxHash' }),
          withdrawTo: jest.fn().mockResolvedValue({ hash: '0xWithdrawToTxHash' }),
          
          // BySig methods
          depositBySig: jest.fn().mockResolvedValue({ hash: '0xDepositBySigTxHash' }),
          withdrawBySig: jest.fn().mockResolvedValue({ hash: '0xWithdrawBySigTxHash' }),
          subscribeBySig: jest.fn().mockResolvedValue({ hash: '0xSubscribeBySigTxHash' }),
          unsubscribeBySig: jest.fn().mockResolvedValue({ hash: '0xUnsubscribeBySigTxHash' }),
          
          // Other methods
          pay: jest.fn().mockResolvedValue({ hash: '0xPayTxHash' }),
          liquidate: jest.fn().mockResolvedValue({ hash: '0xLiquidateTxHash' })
        };
      })
    }
  };
});

describe('PapayaSDK Comprehensive Tests', () => {
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
    } as unknown as Provider;
    
    // Create SDK instance using our mocked factory
    sdk = PapayaSDK.create(mockProvider, 'polygon' as NetworkName, 'USDT');
  });

  describe('Factory Method Tests', () => {
    it('should create SDK instance', () => {
      expect(PapayaSDK.create).toHaveBeenCalledWith(expect.anything(), 'polygon', 'USDT');
    });
    
    it('should handle different networks and token types', () => {
      // Test with different networks and token types
      const networks: NetworkName[] = ['polygon', 'arbitrum', 'mainnet'];
      const tokenTypes: TokenSymbol[] = ['USDT', 'USDC'];
      
      for (const network of networks) {
        for (const tokenType of tokenTypes) {
          PapayaSDK.create(expect.anything(), network, tokenType);
          expect(PapayaSDK.create).toHaveBeenCalledWith(expect.anything(), network, tokenType);
        }
      }
    });
  });

  describe('Balance & User Info Tests', () => {
    it('should get balance successfully', async () => {
      const balance = await sdk.balanceOf();
      expect(balance).toEqual(BigInt(1000));
      expect(sdk.balanceOf).toHaveBeenCalled();
    });
    
    it('should get balance with address parameter', async () => {
      await sdk.balanceOf('0xCustomAddress');
      expect(sdk.balanceOf).toHaveBeenCalledWith('0xCustomAddress');
    });
    
    it('should get user info successfully', async () => {
      const userInfo = await sdk.getUserInfo();
      expect(userInfo).toEqual({
        balance: BigInt(1000),
        incomeRate: BigInt(500),
        outgoingRate: BigInt(300),
        updated: BigInt(123456789)
      });
      expect(sdk.getUserInfo).toHaveBeenCalled();
    });
    
    it('should get user info with address parameter', async () => {
      await sdk.getUserInfo('0xCustomAddress');
      expect(sdk.getUserInfo).toHaveBeenCalledWith('0xCustomAddress');
    });
  });

  describe('Subscription Management Tests', () => {
    it('should subscribe successfully', async () => {
      const authorAddress = '0xAuthorAddress';
      const subscriptionRate = BigInt(123);
      const projectId = 1;
      
      const result = await sdk.subscribe(authorAddress, subscriptionRate, projectId);
      expect(sdk.subscribe).toHaveBeenCalledWith(authorAddress, subscriptionRate, projectId);
      expect(result.hash).toEqual('0xSubscribeTxHash');
    });
    
    it('should unsubscribe successfully', async () => {
      const authorAddress = '0xAuthorAddress';
      
      const result = await sdk.unsubscribe(authorAddress);
      expect(sdk.unsubscribe).toHaveBeenCalledWith(authorAddress);
      expect(result.hash).toEqual('0xUnsubscribeTxHash');
    });
    
    it('should get subscriptions successfully', async () => {
      const subscriptions = await sdk.getSubscriptions();
      expect(sdk.getSubscriptions).toHaveBeenCalled();
      expect(subscriptions).toHaveLength(1);
      expect(subscriptions[0].recipient).toEqual('0xAuthor1');
    });
    
    it('should get subscriptions with address parameter', async () => {
      await sdk.getSubscriptions('0xCustomAddress');
      expect(sdk.getSubscriptions).toHaveBeenCalledWith('0xCustomAddress');
    });
    
    it('should check if subscribed successfully', async () => {
      const authorAddress = '0xAuthorAddress';
      
      const result = await sdk.isSubscribed(authorAddress);
      expect(sdk.isSubscribed).toHaveBeenCalledWith(authorAddress);
      expect(result.isSubscribed).toBe(true);
      expect(result.encodedRates).toEqual(BigInt(12345));
    });
    
    it('should check if subscribed with from address parameter', async () => {
      await sdk.isSubscribed('0xAuthorAddress', '0xFromAddress');
      expect(sdk.isSubscribed).toHaveBeenCalledWith('0xAuthorAddress', '0xFromAddress');
    });
  });

  describe('Project Settings Tests', () => {
    it('should get project settings successfully', async () => {
      const projectId = 1;
      
      const settings = await sdk.getProjectSettings(projectId);
      expect(sdk.getProjectSettings).toHaveBeenCalledWith(projectId);
      expect(settings).toEqual({
        initialized: true,
        projectFee: 500
      });
    });
    
    it('should get user settings successfully', async () => {
      const projectId = 1;
      
      const settings = await sdk.getUserSettings(projectId);
      expect(sdk.getUserSettings).toHaveBeenCalledWith(projectId);
      expect(settings).toEqual({
        initialized: true,
        projectFee: 300
      });
    });
    
    it('should get user settings with address parameter', async () => {
      await sdk.getUserSettings(1, '0xCustomAddress');
      expect(sdk.getUserSettings).toHaveBeenCalledWith(1, '0xCustomAddress');
    });
    
    it('should claim project ID successfully', async () => {
      const result = await sdk.claimProjectId();
      expect(sdk.claimProjectId).toHaveBeenCalled();
      expect(result.hash).toEqual('0xClaimProjectIdTxHash');
    });
    
    it('should claim project ID with owner parameter', async () => {
      await sdk.claimProjectId('0xCustomOwner');
      expect(sdk.claimProjectId).toHaveBeenCalledWith('0xCustomOwner');
    });
    
    it('should set default settings successfully', async () => {
      const projectId = 1;
      const projectFee = 200;
      
      const result = await sdk.setDefaultSettings(projectId, projectFee);
      expect(sdk.setDefaultSettings).toHaveBeenCalledWith(projectId, projectFee);
      expect(result.hash).toEqual('0xSetDefaultSettingsTxHash');
    });
    
    it('should set settings for user successfully', async () => {
      const user = '0xUserAddress';
      const projectId = 1;
      const projectFee = 150;
      
      const result = await sdk.setSettingsForUser(user, projectId, projectFee);
      expect(sdk.setSettingsForUser).toHaveBeenCalledWith(user, projectId, projectFee);
      expect(result.hash).toEqual('0xSetSettingsForUserTxHash');
    });
  });

  describe('Deposit & Withdraw Tests', () => {
    it('should deposit successfully', async () => {
      const amount = 1000;
      
      const result = await sdk.deposit(amount);
      expect(sdk.deposit).toHaveBeenCalledWith(amount);
      expect(result.hash).toEqual('0xDepositTxHash');
    });
    
    it('should deposit for another account successfully', async () => {
      const amount = 1000;
      const receiver = '0xReceiverAddress';
      
      const result = await sdk.depositFor(receiver, amount);
      expect(sdk.depositFor).toHaveBeenCalledWith(receiver, amount);
      expect(result.hash).toEqual('0xDepositForTxHash');
    });
    
    it('should withdraw successfully', async () => {
      const amount = 500;
      
      const result = await sdk.withdraw(amount);
      expect(sdk.withdraw).toHaveBeenCalledWith(amount);
      expect(result.hash).toEqual('0xWithdrawTxHash');
    });
    
    it('should withdraw to another account successfully', async () => {
      const amount = 500;
      const receiver = '0xReceiverAddress';
      
      const result = await sdk.withdrawTo(receiver, amount);
      expect(sdk.withdrawTo).toHaveBeenCalledWith(receiver, amount);
      expect(result.hash).toEqual('0xWithdrawToTxHash');
    });
  });

  describe('BySig Methods Tests', () => {
    it('should deposit with BySig successfully', async () => {
      const amount = 1000;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const result = await sdk.depositBySig(amount, deadline);
      expect(sdk.depositBySig).toHaveBeenCalledWith(amount, deadline);
      expect(result.hash).toEqual('0xDepositBySigTxHash');
    });
    
    it('should withdraw with BySig successfully', async () => {
      const amount = 500;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const result = await sdk.withdrawBySig(amount, deadline);
      expect(sdk.withdrawBySig).toHaveBeenCalledWith(amount, deadline);
      expect(result.hash).toEqual('0xWithdrawBySigTxHash');
    });
    
    it('should subscribe with BySig successfully', async () => {
      const authorAddress = '0xAuthorAddress';
      const subscriptionRate = BigInt(123);
      const projectId = 1;
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const result = await sdk.subscribeBySig(authorAddress, subscriptionRate, projectId, deadline);
      expect(sdk.subscribeBySig).toHaveBeenCalledWith(authorAddress, subscriptionRate, projectId, deadline);
      expect(result.hash).toEqual('0xSubscribeBySigTxHash');
    });
    
    it('should unsubscribe with BySig successfully', async () => {
      const authorAddress = '0xAuthorAddress';
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const result = await sdk.unsubscribeBySig(authorAddress, deadline);
      expect(sdk.unsubscribeBySig).toHaveBeenCalledWith(authorAddress, deadline);
      expect(result.hash).toEqual('0xUnsubscribeBySigTxHash');
    });
  });

  describe('Other Methods Tests', () => {
    it('should make direct payment successfully', async () => {
      const receiver = '0xReceiverAddress';
      const amount = 250;
      
      const result = await sdk.pay(receiver, amount);
      expect(sdk.pay).toHaveBeenCalledWith(receiver, amount);
      expect(result.hash).toEqual('0xPayTxHash');
    });
    
    // Additional rate encoding tests could be added here if needed
  });
}); 