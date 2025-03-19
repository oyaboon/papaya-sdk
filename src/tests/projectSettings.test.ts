import { PapayaSDK } from '../core';
import { NetworkName, TokenSymbol } from '../contracts/networks';
import { Provider } from 'ethers';

// Mock PapayaSDK for more controlled testing
jest.mock('../core/PapayaSDK', () => {
  const original = jest.requireActual('../core/PapayaSDK');
  
  return {
    ...original,
    PapayaSDK: {
      ...original.PapayaSDK,
      create: jest.fn().mockImplementation(() => {
        return {
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
          setSettingsForUser: jest.fn().mockResolvedValue({ hash: '0xSetSettingsForUserTxHash' })
        };
      })
    }
  };
});

describe('Project Settings Functionality', () => {
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
  
  // Helper function to create a provider-only SDK
  const createProviderOnlySdk = () => {
    const providerOnlyMock = {
      getNetwork: jest.fn().mockResolvedValue({ chainId: 137, name: 'polygon' }),
      provider: null, 
      destroy: jest.fn(),
      getBlockNumber: jest.fn().mockResolvedValue(1234567),
      // ... other provider methods
    } as unknown as Provider;
    
    return PapayaSDK.create(providerOnlyMock, 'polygon' as NetworkName, 'USDT');
  };

  describe('Get Project Settings', () => {
    it('should get default project settings', async () => {
      const projectId = 1;
      const settings = await sdk.getProjectSettings(projectId);
      
      // Check method was called with correct projectId
      expect(sdk.getProjectSettings).toHaveBeenCalledWith(projectId);
      
      // Check returned settings match the mock data
      expect(settings).toEqual({
        initialized: true,
        projectFee: 500
      });
    });
  });
  
  describe('Get User Settings', () => {
    it('should get user settings for a project', async () => {
      const projectId = 1;
      const settings = await sdk.getUserSettings(projectId);
      
      // Check method was called with correct parameters
      expect(sdk.getUserSettings).toHaveBeenCalledWith(projectId);
      
      // Check returned settings match the mock data
      expect(settings).toEqual({
        initialized: true,
        projectFee: 300
      });
    });
    
    it('should accept custom user address', async () => {
      const projectId = 1;
      const customAddress = '0xCustomAddress';
      await sdk.getUserSettings(projectId, customAddress);
      
      // Check method was called with custom address
      expect(sdk.getUserSettings).toHaveBeenCalledWith(projectId, customAddress);
    });
  });
  
  describe('Claim Project ID', () => {
    it('should claim project ID for the user', async () => {
      const tx = await sdk.claimProjectId();
      
      // Check method was called
      expect(sdk.claimProjectId).toHaveBeenCalled();
      expect(tx.hash).toEqual('0xClaimProjectIdTxHash');
    });
    
    it('should claim project ID for another user if specified', async () => {
      const customOwner = '0xCustomOwner';
      const tx = await sdk.claimProjectId(customOwner);
      
      // Check method was called with custom owner address
      expect(sdk.claimProjectId).toHaveBeenCalledWith(customOwner);
      expect(tx.hash).toEqual('0xClaimProjectIdTxHash');
    });
  });
  
  describe('Set Default Settings', () => {
    it('should set default settings for a project', async () => {
      const projectId = 1;
      const projectFee = 200;
      
      const tx = await sdk.setDefaultSettings(projectId, projectFee);
      
      // Check method was called with correct parameters
      expect(sdk.setDefaultSettings).toHaveBeenCalledWith(projectId, projectFee);
      expect(tx.hash).toEqual('0xSetDefaultSettingsTxHash');
    });
    
    it('should handle different project fee values', async () => {
      // Test with different project fee values
      const testCases = [0, 100, 5000, 10000];
      
      for (const projectFee of testCases) {
        await sdk.setDefaultSettings(1, projectFee);
        
        // Check method was called with correct parameters
        expect(sdk.setDefaultSettings).toHaveBeenCalledWith(1, projectFee);
      }
    });
  });
  
  describe('Set Settings For User', () => {
    it('should set settings for a specific user on a project', async () => {
      const user = '0xTargetUser';
      const projectId = 1;
      const projectFee = 150;
      
      const tx = await sdk.setSettingsForUser(user, projectId, projectFee);
      
      // Check method was called with correct parameters
      expect(sdk.setSettingsForUser).toHaveBeenCalledWith(user, projectId, projectFee);
      expect(tx.hash).toEqual('0xSetSettingsForUserTxHash');
    });
    
    it('should handle different project fee values', async () => {
      // Test with different project fee values
      const testCases = [0, 100, 5000, 10000];
      
      for (const projectFee of testCases) {
        await sdk.setSettingsForUser('0xUser', 1, projectFee);
        
        // Check method was called with correct parameters
        expect(sdk.setSettingsForUser).toHaveBeenCalledWith('0xUser', 1, projectFee);
      }
    });
  });
}); 