# Papaya SDK API Reference

This document provides a comprehensive reference for all methods available in the Papaya SDK.

## Table of Contents

- [Factory Methods](#factory-methods)
- [Account Methods](#account-methods)
- [Deposit Methods](#deposit-methods)
- [Withdrawal Methods](#withdrawal-methods)
- [Subscription Methods](#subscription-methods)
- [Payment Methods](#payment-methods)
- [Utility Methods](#utility-methods)

## Factory Methods

### `PapayaSDK.create()`

Creates a new instance of the Papaya SDK.

```typescript
static create(
  provider: ethers.Provider | ethers.Signer,
  network: NetworkName = 'polygon',
  tokenSymbol: TokenSymbol = 'USDT',
  contractVersion?: string
): PapayaSDK
```

**Parameters:**
- `provider`: An ethers.js Provider or Signer instance
- `network`: (Optional) The blockchain network to use (default: 'polygon')
- `tokenSymbol`: (Optional) The stablecoin to use (default: 'USDT')
- `contractVersion`: (Optional) Specific contract version to use (defaults to the latest version for the selected network)

**Returns:** A new `PapayaSDK` instance.

**Example:**
```typescript
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
const papaya = PapayaSDK.create(provider, 'polygon', 'USDT');
```

### `PapayaSDK.getAvailableNetworks()`

Returns a list of all networks supported by the SDK.

```typescript
static getAvailableNetworks(): NetworkName[]
```

**Returns:** Array of network names.

**Example:**
```typescript
const networks = PapayaSDK.getAvailableNetworks();
console.log(networks); // ['polygon', 'bsc', 'avalanche', ...]
```

### `PapayaSDK.getAvailableTokens()`

Returns a list of tokens available for a specific network.

```typescript
static getAvailableTokens(network: NetworkName): TokenSymbol[]
```

**Parameters:**
- `network`: The network to check for available tokens

**Returns:** Array of token symbols available on the specified network.

**Example:**
```typescript
const tokens = PapayaSDK.getAvailableTokens('polygon');
console.log(tokens); // ['USDT', 'USDC']
```

## Account Methods

### `balanceOf()`

Retrieves the token balance of an account in the Papaya protocol.

```typescript
async balanceOf(account?: string): Promise<number>
```

**Parameters:**
- `account`: (Optional) The address to check the balance of. If not provided, uses the connected signer's address.

**Returns:** The account balance as a number.

**Example:**
```typescript
const balance = await papaya.balanceOf();
console.log(`My balance: ${balance}`);
```

### `getUserInfo()`

Gets detailed information about a user's account.

```typescript
async getUserInfo(account?: string): Promise<UserInfo>
```

**Parameters:**
- `account`: (Optional) The address to get info for. If not provided, uses the connected signer's address.

**Returns:** A `UserInfo` object with the following properties:
- `balance`: The account balance
- `incomeRate`: The rate at which the account is receiving subscriptions
- `outgoingRate`: The rate at which the account is paying subscriptions
- `updated`: The timestamp when the account was last updated

**Example:**
```typescript
const userInfo = await papaya.getUserInfo();
console.log(`Balance: ${userInfo.balance}`);
console.log(`Income rate: ${userInfo.incomeRate} per second`);
```

## Deposit Methods

### `deposit()`

Deposits tokens into the Papaya protocol.

```typescript
async deposit(amount: bigint | number, isPermit2: boolean = false): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `amount`: The amount of tokens to deposit
- `isPermit2`: (Optional) Whether to use Permit2 for the deposit (default: false)

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const tx = await papaya.deposit(100);
await tx.wait();
console.log('Deposit successful');
```

### `depositBySig()`

Creates a deposit transaction that can be signed off-chain and executed by anyone.

```typescript
async depositBySig(amount: bigint | number, deadline: number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `amount`: The amount of tokens to deposit
- `deadline`: Timestamp after which the transaction can't be executed

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const tx = await papaya.depositBySig(100, deadline);
await tx.wait();
```

### `depositFor()`

Deposits tokens into another account.

```typescript
async depositFor(amount: bigint | number, to: string, isPermit2: boolean = false): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `amount`: The amount of tokens to deposit
- `to`: The recipient address
- `isPermit2`: (Optional) Whether to use Permit2 for the deposit (default: false)

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const recipientAddress = '0x...';
const tx = await papaya.depositFor(50, recipientAddress);
await tx.wait();
```

## Withdrawal Methods

### `withdraw()`

Withdraws tokens from the Papaya protocol.

```typescript
async withdraw(amount: bigint | number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `amount`: The amount of tokens to withdraw

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const tx = await papaya.withdraw(50);
await tx.wait();
console.log('Withdrawal successful');
```

### `withdrawBySig()`

Creates a withdrawal transaction that can be signed off-chain and executed by anyone.

```typescript
async withdrawBySig(amount: bigint | number, deadline: number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `amount`: The amount of tokens to withdraw
- `deadline`: Timestamp after which the transaction can't be executed

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const tx = await papaya.withdrawBySig(50, deadline);
await tx.wait();
```

### `withdrawTo()`

Withdraws tokens directly to another address.

```typescript
async withdrawTo(to: string, amount: bigint | number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `to`: The recipient address
- `amount`: The amount of tokens to withdraw

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const recipientAddress = '0x...';
const tx = await papaya.withdrawTo(recipientAddress, 25);
await tx.wait();
```

## Subscription Methods

### `subscribe()`

Creates a new subscription to a creator.

```typescript
async subscribe(
  author: string, 
  amount: number | bigint,
  period: RatePeriod = RatePeriod.MONTH,
  projectId: number
): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `author`: The address of the creator to subscribe to
- `amount`: The amount of tokens for the subscription period
- `period`: (Optional) The subscription period (default: RatePeriod.MONTH)
- `projectId`: The project ID associated with the subscription

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const creatorAddress = '0x...';
const tx = await papaya.subscribe(creatorAddress, 10, RatePeriod.MONTH, 0);
await tx.wait();
```

### `subscribeBySig()`

Creates a subscription transaction that can be signed off-chain and executed by anyone.

```typescript
async subscribeBySig(
  author: string, 
  amount: number | bigint,
  period: RatePeriod = RatePeriod.MONTH,
  projectId: number,
  deadline: number
): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `author`: The address of the creator to subscribe to
- `amount`: The amount of tokens for the subscription period
- `period`: (Optional) The subscription period (default: RatePeriod.MONTH)
- `projectId`: The project ID associated with the subscription
- `deadline`: Timestamp after which the transaction can't be executed

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const creatorAddress = '0x...';
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const tx = await papaya.subscribeBySig(creatorAddress, 10, RatePeriod.MONTH, 0, deadline);
await tx.wait();
```

### `unsubscribe()`

Cancels a subscription to a creator.

```typescript
async unsubscribe(author: string): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `author`: The address of the creator to unsubscribe from

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const creatorAddress = '0x...';
const tx = await papaya.unsubscribe(creatorAddress);
await tx.wait();
```

### `unsubscribeBySig()`

Creates an unsubscribe transaction that can be signed off-chain and executed by anyone.

```typescript
async unsubscribeBySig(author: string, deadline: number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `author`: The address of the creator to unsubscribe from
- `deadline`: Timestamp after which the transaction can't be executed

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const creatorAddress = '0x...';
const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
const tx = await papaya.unsubscribeBySig(creatorAddress, deadline);
await tx.wait();
```

### `getSubscriptions()`

Gets all subscriptions for an account.

```typescript
async getSubscriptions(account?: string): Promise<Subscription[]>
```

**Parameters:**
- `account`: (Optional) The address to get subscriptions for. If not provided, uses the connected signer's address.

**Returns:** Array of `Subscription` objects, each containing:
- `recipient`: The address receiving the subscription
- `incomeRate`: The rate at which the recipient is receiving tokens
- `outgoingRate`: The rate at which the subscriber is paying tokens
- `projectId`: The project ID associated with the subscription

**Example:**
```typescript
const subscriptions = await papaya.getSubscriptions();
subscriptions.forEach(sub => {
  console.log(`Subscribed to ${sub.recipient} with rate ${sub.outgoingRate}`);
});
```

### `isSubscribed()`

Checks if an account is subscribed to a specific creator.

```typescript
async isSubscribed(to: string, from?: string): Promise<{ isSubscribed: boolean; incomeRate: number; outgoingRate: number; projectId: number }>
```

**Parameters:**
- `to`: The creator's address
- `from`: (Optional) The subscriber's address. If not provided, uses the connected signer's address.

**Returns:** Object containing:
- `isSubscribed`: Boolean indicating if the subscription exists
- `incomeRate`: The rate at which the creator is receiving tokens
- `outgoingRate`: The rate at which the subscriber is paying tokens
- `projectId`: The project ID associated with the subscription

**Example:**
```typescript
const creatorAddress = '0x...';
const subInfo = await papaya.isSubscribed(creatorAddress);

if (subInfo.isSubscribed) {
  console.log(`Subscribed with rate: ${subInfo.outgoingRate}`);
} else {
  console.log('Not subscribed');
}
```

## Payment Methods

### `pay()`

Makes a one-time payment to a recipient.

```typescript
async pay(receiver: string, amount: bigint | number): Promise<ethers.TransactionResponse>
```

**Parameters:**
- `receiver`: The recipient's address
- `amount`: The amount of tokens to pay

**Returns:** An ethers.js `TransactionResponse` object.

**Example:**
```typescript
const recipientAddress = '0x...';
const tx = await papaya.pay(recipientAddress, 20);
await tx.wait();
```

## Utility Methods

### `getTokenSymbol()`

Gets the current token symbol used by the SDK instance.

```typescript
getTokenSymbol(): TokenSymbol
```

**Returns:** The current token symbol.

**Example:**
```typescript
const token = papaya.getTokenSymbol();
console.log(`Using token: ${token}`); // 'USDT'
``` 