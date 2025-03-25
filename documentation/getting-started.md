# Getting Started with Papaya SDK

This guide will help you get started with the Papaya SDK, walking you through installation, setup, and basic usage examples.

## Prerequisites

Before you begin using the Papaya SDK, you'll need:

- A JavaScript/TypeScript development environment
- Node.js (v14 or higher recommended)
- npm or yarn package manager
- Basic knowledge of Ethereum/EVM blockchain concepts
- Access to blockchain RPC nodes (e.g., from Infura, Alchemy, or your own node)

## Installation

Install the Papaya SDK package using npm or yarn:

```bash
# Using npm
npm install @papaya_fi/sdk

# Using yarn
yarn add @papaya_fi/sdk
```

You'll also need to install ethers.js v6 as a peer dependency:

```bash
npm install ethers@^6.0.0
# or
yarn add ethers@^6.0.0
```

## Basic Setup

### Creating a Provider and Signer

First, you need to set up an Ethereum provider and (optionally) a signer:

```typescript
import { ethers } from 'ethers';

// Read-only provider
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// For transactions, you need a signer
// Option 1: Using a private key (server-side)
const privateKey = 'YOUR_PRIVATE_KEY'; // Never hardcode this in production!
const signer = new ethers.Wallet(privateKey, provider);

// Option 2: Using a browser wallet like MetaMask (client-side)
// This assumes window.ethereum is available
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
```

### Creating a Papaya SDK Instance

Once you have a provider or signer, you can create a Papaya SDK instance:

```typescript
import { PapayaSDK } from '@papaya_fi/sdk';

// With a signer (for transactions)
const papaya = PapayaSDK.create(signer, 'polygon', 'USDT');

// Or with just a provider (for read-only operations)
const readOnlyPapaya = PapayaSDK.create(provider, 'polygon', 'USDT');
```

#### Parameters:

1. `provider` or `signer`: An ethers.js Provider or Signer
2. `network`: The blockchain network to use (default: 'polygon')
   - Available networks: 'polygon', 'bsc', 'avalanche', 'base', 'scroll', 'arbitrum', 'mainnet', 'sei', 'zksync'
3. `tokenSymbol`: The stablecoin to use (default: 'USDT')
   - Available tokens: 'USDT', 'USDC', 'PYUSD' (availability varies by network)
4. `contractVersion`: Optional contract version (defaults to the latest version for the selected network)

## Basic Usage Examples

### Checking Balance

```typescript
async function checkBalance() {
  try {
    // Check your own balance
    const myBalance = await papaya.balanceOf();
    console.log(`My balance: ${myBalance}`);
    
    // Check another account's balance
    const otherAddress = '0x...';
    const otherBalance = await papaya.balanceOf(otherAddress);
    console.log(`Other account balance: ${otherBalance}`);
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}
```

### Depositing Funds

```typescript
async function depositFunds() {
  try {
    // Deposit 100 tokens
    const tx = await papaya.deposit(100);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Deposit confirmed in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error depositing funds:', error);
  }
}
```

### Subscribing to a Creator

```typescript
async function subscribeToCreator() {
  try {
    const creatorAddress = '0x...';
    // Subscribe with 10 tokens per month
    const tx = await papaya.subscribe(creatorAddress, 10);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Subscription confirmed in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error subscribing:', error);
  }
}
```

### Checking Subscriptions

```typescript
async function checkSubscriptions() {
  try {
    // Get all your subscriptions
    const subscriptions = await papaya.getSubscriptions();
    
    console.log('My subscriptions:');
    subscriptions.forEach(sub => {
      console.log(`- To: ${sub.recipient}, Rate: ${sub.outgoingRate}, Project ID: ${sub.projectId}`);
    });
    
    // Check if subscribed to a specific creator
    const creatorAddress = '0x...';
    const subInfo = await papaya.isSubscribed(creatorAddress);
    
    if (subInfo.isSubscribed) {
      console.log(`Subscribed to ${creatorAddress} with rate: ${subInfo.outgoingRate}`);
    } else {
      console.log(`Not subscribed to ${creatorAddress}`);
    }
  } catch (error) {
    console.error('Error checking subscriptions:', error);
  }
}
```

## Error Handling

The Papaya SDK includes comprehensive error handling. It's recommended to always wrap your calls in try/catch blocks:

```typescript
try {
  const tx = await papaya.withdraw(50);
  await tx.wait();
  console.log('Withdrawal successful');
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('You do not have enough funds to withdraw');
  } else {
    console.error('Error during withdrawal:', error);
  }
}
```

## Next Steps

Now that you're familiar with the basics, explore more advanced features:

- [API Reference](./api-reference.md) - Complete list of all SDK methods
- [Network Support](./network-support.md) - Details on supported networks and tokens
- [Examples](./examples.md) - More code examples for specific use cases
- [Advanced Usage](./advanced-usage.md) - BySig methods, gas optimization, and more 