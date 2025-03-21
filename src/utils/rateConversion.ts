/**
 * Utility for handling rate conversions with different time periods
 */

/**
 * Enum for time period units used in subscription rates
 */
export enum RatePeriod {
  SECOND = 'second',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

/**
 * Conversion factors to normalize different rate periods to per-second rates
 * These represent how many seconds are in each period
 */
const PERIOD_TO_SECONDS = {
  [RatePeriod.SECOND]: 1,
  [RatePeriod.HOUR]: 3600, // 60 * 60
  [RatePeriod.DAY]: 86400, // 24 * 60 * 60
  [RatePeriod.WEEK]: 604800, // 7 * 24 * 60 * 60
  [RatePeriod.MONTH]: 2628000, // ~30.42 days in a month (365 / 12 * 24 * 60 * 60)
  [RatePeriod.YEAR]: 31536000 // 365 * 24 * 60 * 60
};

/**
 * Conversion factors to represent rates in different periods from per-second rate
 * These represent what to multiply the per-second rate by to get the period rate
 */
const SECONDS_TO_PERIOD = {
  [RatePeriod.SECOND]: 1,
  [RatePeriod.HOUR]: 3600,
  [RatePeriod.DAY]: 86400,
  [RatePeriod.WEEK]: 604800,
  [RatePeriod.MONTH]: 2628000,
  [RatePeriod.YEAR]: 31536000
};

/**
 * Converts an amount and rate period to a per-second rate
 * 
 * @param amount - The amount in the specified period
 * @param period - The time period (second, hour, day, week, month, year)
 * @returns The equivalent per-second rate
 */
export function convertToSecondRate(amount: number, period: RatePeriod): number {
  const periodFactor = PERIOD_TO_SECONDS[period];
  return amount / periodFactor;
}


export function convertRatePerSecond(amount: string, period: RatePeriod): number {
  const amountNum = parseFloat(amount);
  const periodFactor = PERIOD_TO_SECONDS[period];

  const amountInSmallestUnit = BigInt(Math.floor(amountNum * 1e6)) * BigInt(1e12);
  const ratePerSecond = amountInSmallestUnit / BigInt(periodFactor);

  return Number(ratePerSecond);
}

/**
 * Converts a per-second rate to a rate in the specified period
 * 
 * @param secondRate - The per-second rate
 * @param period - The target time period (second, hour, day, week, month, year)
 * @returns The rate in the specified period
 */
export function convertFromSecondRate(secondRate: number, period: RatePeriod): number {
  const periodFactor = PERIOD_TO_SECONDS[period];
  return secondRate * periodFactor;
}

/**
 * Formats a rate with its period for display
 * 
 * @param amount - The amount
 * @param period - The time period
 * @returns Formatted string (e.g., "10 USDC/month")
 */
export function formatRate(amount: number, period: RatePeriod, currency: string = 'USDC'): string {
  return `${amount} ${currency}/${period}`;
} 