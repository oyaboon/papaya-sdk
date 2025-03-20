import { ethers } from 'ethers';
import { Papaya } from '../contracts/abi';
import { NETWORKS, DEFAULT_VERSIONS, NetworkName, TokenSymbol } from '../contracts/networks';
import { PapayaSDKOptions, Subscription, UserInfo, ProjectSettings } from '../types';
import { encodeRates, decodeRates, encodeSubscriptionRate } from '../utils/rateEncoding';

// Define a TokenConfig type to match the structure in networks.ts
type TokenConfig = {
  version: string;
  contractAddress: string;
  tokenAddress: string;
  tokenPriceFeed: string;
  coinPriceFeed: string;
};

/**
 * Main SDK class for interacting with the Papaya Protocol
 */
export class PapayaSDK {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null;
  private contract: ethers.Contract;
  private tokenContract: ethers.Contract | null = null;
  private tokenAddress: string;
  private network: NetworkName;
  private tokenSymbol: TokenSymbol;
  private contractVersion: string;

  /**
   * Creates a new PapayaSDK instance
   * 
   * @param options - Configuration options for the SDK
   */
  private constructor(options: PapayaSDKOptions) {
    // Set provider and signer
    if ('getAddress' in options.provider && typeof options.provider.getAddress === 'function') {
      // It's a signer
      this.signer = options.provider as ethers.Signer;
      this.provider = this.signer.provider as ethers.Provider;
    } else {
      // It's a provider
      this.provider = options.provider as ethers.Provider;
      this.signer = null;
    }

    // Set network and token symbol
    this.network = options.network || 'polygon';
    this.tokenSymbol = options.tokenSymbol || 'USDT';
    this.contractVersion = options.contractVersion || DEFAULT_VERSIONS[this.network];

    // Validate token for the selected network
    if (!NETWORKS[this.network][this.tokenSymbol as keyof typeof NETWORKS[typeof this.network]]) {
      console.error(`Token ${this.tokenSymbol} not supported on ${this.network}. Falling back to USDT.`);
      this.tokenSymbol = 'USDT';
      
      // If USDT is also not supported, try USDC
      if (!NETWORKS[this.network][this.tokenSymbol as keyof typeof NETWORKS[typeof this.network]]) {
        console.error(`USDT not supported on ${this.network}. Falling back to USDC.`);
        this.tokenSymbol = 'USDC';
        
        // If neither USDT nor USDC is supported, use the first available token
        if (!NETWORKS[this.network][this.tokenSymbol as keyof typeof NETWORKS[typeof this.network]]) {
          const availableTokens = Object.keys(NETWORKS[this.network]) as TokenSymbol[];
          if (availableTokens.length > 0) {
            this.tokenSymbol = availableTokens[0];
            console.error(`USDC not supported on ${this.network}. Falling back to ${this.tokenSymbol}.`);
          } else {
            throw new Error(`No tokens supported on ${this.network}`);
          }
        }
      }
    }

    // Validate version
    const tokenConfigs = NETWORKS[this.network][this.tokenSymbol as keyof typeof NETWORKS[typeof this.network]] as TokenConfig[];
    const versionConfig = tokenConfigs.find((config: TokenConfig) => config.version === this.contractVersion);
    
    if (!versionConfig) {
      console.error(`Version ${this.contractVersion} not supported for ${this.tokenSymbol} on ${this.network}. Using the latest available version.`);
      // Use the latest version available
      const latestConfig = tokenConfigs[tokenConfigs.length - 1];
      this.contractVersion = latestConfig.version;
    }

    // Set contract address and token address
    const contractAddress = options.contractAddress || 
      this.getContractAddress(this.network, this.tokenSymbol, this.contractVersion);
    
    this.tokenAddress = options.tokenAddress || 
      this.getTokenAddress(this.network, this.tokenSymbol, this.contractVersion);

    // Initialize contract
    this.contract = new ethers.Contract(
      contractAddress,
      Papaya,
      this.signer || this.provider
    );
  }

  /**
   * Factory method to create a new PapayaSDK instance
   * 
   * @param provider - Ethers provider or signer
   * @param network - Network name (default: 'polygon')
   * @param tokenSymbol - Token symbol (default: 'USDT')
   * @param contractVersion - Contract version (default: network's default version)
   * @returns A new PapayaSDK instance
   */
  public static create(
    provider: ethers.Provider | ethers.Signer,
    network: NetworkName = 'polygon',
    tokenSymbol: TokenSymbol = 'USDT',
    contractVersion?: string
  ): PapayaSDK {
    // Validate network
    if (!NETWORKS[network]) {
      console.error(`Network ${network} not supported. Falling back to Polygon.`);
      network = 'polygon';
    }

    // Create SDK instance - token validation is now handled in the constructor
    return new PapayaSDK({
      provider,
      network,
      tokenSymbol,
      contractVersion
    });
  }

  /**
   * Gets the contract address for a specific network, token, and version
   * 
   * @param network - Network name
   * @param tokenSymbol - Token symbol
   * @param version - Contract version
   * @returns Contract address
   */
  private getContractAddress(network: NetworkName, tokenSymbol: TokenSymbol, version: string): string {
    const tokenConfigs = NETWORKS[network][tokenSymbol as keyof typeof NETWORKS[typeof network]] as TokenConfig[];
    if (!tokenConfigs) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    const versionConfig = tokenConfigs.find((config: TokenConfig) => config.version === version);
    if (!versionConfig) {
      throw new Error(`Version ${version} not supported for token ${tokenSymbol} on network ${network}`);
    }

    return versionConfig.contractAddress;
  }

  /**
   * Gets the token address for a specific network, token symbol, and version
   * 
   * @param network - Network name
   * @param tokenSymbol - Token symbol
   * @param version - Contract version
   * @returns Token address
   */
  private getTokenAddress(network: NetworkName, tokenSymbol: TokenSymbol, version: string): string {
    const tokenConfigs = NETWORKS[network][tokenSymbol as keyof typeof NETWORKS[typeof network]] as TokenConfig[];
    if (!tokenConfigs) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    const versionConfig = tokenConfigs.find((config: TokenConfig) => config.version === version);
    if (!versionConfig) {
      throw new Error(`Version ${version} not supported for token ${tokenSymbol} on network ${network}`);
    }

    return versionConfig.tokenAddress;
  }

  /**
   * Gets the price feed addresses for a specific network, token, and version
   * 
   * @param network - Network name
   * @param tokenSymbol - Token symbol
   * @param version - Contract version
   * @returns Object containing token and coin price feed addresses
   */
  private getPriceFeeds(network: NetworkName, tokenSymbol: TokenSymbol, version: string): { tokenPriceFeed: string, coinPriceFeed: string } {
    const tokenConfigs = NETWORKS[network][tokenSymbol as keyof typeof NETWORKS[typeof network]] as TokenConfig[];
    if (!tokenConfigs) {
      throw new Error(`Token ${tokenSymbol} not supported on network ${network}`);
    }

    const versionConfig = tokenConfigs.find((config: TokenConfig) => config.version === version);
    if (!versionConfig) {
      throw new Error(`Version ${version} not supported for token ${tokenSymbol} on network ${network}`);
    }

    return {
      tokenPriceFeed: versionConfig.tokenPriceFeed,
      coinPriceFeed: versionConfig.coinPriceFeed
    };
  }

  /**
   * Universal method for calling BySig methods
   * 
   * @param method - Method name
   * @param params - Method parameters
   * @param deadline - Deadline timestamp
   * @returns Transaction response
   */
  private async callBySig(method: string, params: any[], deadline: number) {
    if (!this.signer) {
      throw new Error("Signer is required for BySig methods");
    }

    const signerAddress = await this.signer.getAddress();
    const nonce = await this.contract.bySigAccountNonces(signerAddress);
    
    const sigData = {
      traits: 0,
      data: ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256"], 
        [...params, deadline]
      ),
    };
    
    const messageHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["tuple(uint256, bytes)"], 
        [sigData]
      )
    );
    
    const signature = await this.signer.signMessage(ethers.getBytes(messageHash));
    
    return this.contract.bySig(signerAddress, sigData, signature);
  }

  /**
   * Gets the balance of an account
   * 
   * @param account - Account address (default: signer's address)
   * @returns Account balance
   */
  async balanceOf(account?: string): Promise<bigint> {
    const address = account || (this.signer ? await this.signer.getAddress() : null);
    
    if (!address) {
      throw new Error("Account address is required");
    }
    
    return this.contract.balanceOf(address);
  }

  /**
   * Gets detailed user information
   * 
   * @param account - Account address (default: signer's address)
   * @returns User information
   */
  async getUserInfo(account?: string): Promise<UserInfo> {
    const address = account || (this.signer ? await this.signer.getAddress() : null);
    
    if (!address) {
      throw new Error("Account address is required");
    }
    
    const [balance, incomeRate, outgoingRate, updated] = await this.contract.users(address);
    
    return {
      balance,
      incomeRate,
      outgoingRate,
      updated
    };
  }

  /**
   * Deposits tokens into the protocol
   * 
   * @param amount - Amount to deposit
   * @param isPermit2 - Whether to use Permit2 (default: false)
   * @returns Transaction response
   */
  async deposit(amount: bigint | number, isPermit2: boolean = false): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for deposit");
    }
    
    return this.contract.deposit(amount, isPermit2);
  }

  /**
   * Deposits tokens into the protocol using BySig
   * 
   * @param amount - Amount to deposit
   * @param deadline - Deadline timestamp
   * @returns Transaction response
   */
  async depositBySig(amount: bigint | number, deadline: number): Promise<ethers.TransactionResponse> {
    return this.callBySig("deposit", [amount], deadline);
  }

  /**
   * Deposits tokens for another account
   * 
   * @param amount - Amount to deposit
   * @param to - Recipient address
   * @param isPermit2 - Whether to use Permit2 (default: false)
   * @returns Transaction response
   */
  async depositFor(amount: bigint | number, to: string, isPermit2: boolean = false): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for depositFor");
    }
    
    return this.contract.depositFor(amount, to, isPermit2);
  }

  /**
   * Withdraws tokens from the protocol
   * 
   * @param amount - Amount to withdraw
   * @returns Transaction response
   */
  async withdraw(amount: bigint | number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for withdraw");
    }
    
    return this.contract.withdraw(amount);
  }

  /**
   * Withdraws tokens from the protocol using BySig
   * 
   * @param amount - Amount to withdraw
   * @param deadline - Deadline timestamp
   * @returns Transaction response
   */
  async withdrawBySig(amount: bigint | number, deadline: number): Promise<ethers.TransactionResponse> {
    return this.callBySig("withdraw", [amount], deadline);
  }

  /**
   * Withdraws tokens to another account
   * 
   * @param to - Recipient address
   * @param amount - Amount to withdraw
   * @returns Transaction response
   */
  async withdrawTo(to: string, amount: bigint | number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for withdrawTo");
    }
    
    return this.contract.withdrawTo(to, amount);
  }

  /**
   * Subscribes to an author
   * 
   * @param author - Author address
   * @param subscriptionRate - Subscription rate (uint96)
   * @param projectId - Project ID
   * @returns Transaction response
   */
  async subscribe(
    author: string, 
    subscriptionRate: bigint, 
    projectId: number
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for subscribe");
    }
    
    return this.contract.subscribe(author, subscriptionRate, projectId);
  }

  /**
   * Subscribes to an author using BySig
   * 
   * @param author - Author address
   * @param subscriptionRate - Subscription rate (uint96)
   * @param projectId - Project ID
   * @param deadline - Deadline timestamp
   * @returns Transaction response
   */
  async subscribeBySig(
    author: string, 
    subscriptionRate: bigint, 
    projectId: number, 
    deadline: number
  ): Promise<ethers.TransactionResponse> {
    return this.callBySig("subscribe", [author, subscriptionRate, projectId], deadline);
  }

  /**
   * Unsubscribes from an author
   * 
   * @param author - Author address
   * @returns Transaction response
   */
  async unsubscribe(author: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for unsubscribe");
    }
    
    return this.contract.unsubscribe(author);
  }

  /**
   * Unsubscribes from an author using BySig
   * 
   * @param author - Author address
   * @param deadline - Deadline timestamp
   * @returns Transaction response
   */
  async unsubscribeBySig(author: string, deadline: number): Promise<ethers.TransactionResponse> {
    return this.callBySig("unsubscribe", [author], deadline);
  }

  /**
   * Gets all subscriptions for an account
   * 
   * @param account - Account address (default: signer's address)
   * @returns Array of subscriptions
   */
  async getSubscriptions(account?: string): Promise<Subscription[]> {
    const address = account || (this.signer ? await this.signer.getAddress() : null);
    
    if (!address) {
      throw new Error("Account address is required");
    }
    
    const [recipients, encodedRates] = await this.contract.allSubscriptions(address);
    
    return recipients.map((recipient: string, index: number) => ({
      recipient,
      ...decodeRates(encodedRates[index])
    }));
  }

  /**
   * Checks if an account is subscribed to an author
   * 
   * @param from - Subscriber address (default: signer's address)
   * @param to - Author address
   * @returns Subscription status and encoded rates
   */
  async isSubscribed(to: string, from?: string): Promise<{ isSubscribed: boolean; encodedRates: bigint }> {
    const fromAddress = from || (this.signer ? await this.signer.getAddress() : null);
    
    if (!fromAddress) {
      throw new Error("From address is required");
    }
    
    const [isSubscribed, encodedRates] = await this.contract.subscriptions(fromAddress, to);
    
    return {
      isSubscribed,
      encodedRates
    };
  }

  /**
   * Makes a direct payment to a receiver
   * 
   * @param receiver - Recipient address
   * @param amount - Amount to pay
   * @returns Transaction response
   */
  async pay(receiver: string, amount: bigint | number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error("Signer is required for pay");
    }
    
    return this.contract.pay(receiver, amount);
  }

  /**
   * Gets the token symbol currently being used by the SDK instance
   * 
   * @returns The token symbol (USDT, USDC, or PYUSD)
   */
  getTokenSymbol(): TokenSymbol {
    return this.tokenSymbol;
  }

  /**
   * Gets the available tokens for a given network
   * 
   * @param network - The network name
   * @returns Array of available token symbols for the specified network
   */
  static getAvailableTokens(network: NetworkName): TokenSymbol[] {
    if (!NETWORKS[network]) {
      return [];
    }
    
    return Object.keys(NETWORKS[network]) as TokenSymbol[];
  }

  /**
   * Gets all available network names supported by the SDK
   * 
   * @returns Array of supported network names
   */
  static getAvailableNetworks(): NetworkName[] {
    return Object.keys(NETWORKS) as NetworkName[];
  }
} 