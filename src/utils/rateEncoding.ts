/**
 * Encodes income rate, outgoing rate, and project ID into a single bigint value
 * 
 * @param incomeRate - The income rate value
 * @param outgoingRate - The outgoing rate value
 * @param projectId - The project ID
 * @returns A bigint containing all three values encoded
 */
export function encodeRates(incomeRate: number, outgoingRate: number, projectId: number): bigint {
  return (
    BigInt(incomeRate) |
    (BigInt(outgoingRate) << BigInt(96)) |
    (BigInt(projectId) << BigInt(192))
  );
}

/**
 * Encodes just the subscription rate (income rate and outgoing rate) for the subscribe function
 * 
 * @param incomeRate - The income rate value
 * @param outgoingRate - The outgoing rate value
 * @returns A bigint containing income and outgoing rates encoded
 */
export function encodeSubscriptionRate(incomeRate: number, outgoingRate: number): bigint {
  return (
    BigInt(incomeRate) |
    (BigInt(outgoingRate) << BigInt(96))
  );
}

/**
 * Decodes a bigint value into income rate, outgoing rate, and project ID
 * 
 * @param encodedRates - The encoded rates as a bigint
 * @returns An object containing the decoded incomeRate, outgoingRate, and projectId
 */
export function decodeRates(encodedRates: bigint): { incomeRate: number; outgoingRate: number; projectId: number } {
  return {
    incomeRate: Number(encodedRates & BigInt("0xffffffffffffffff")),
    outgoingRate: Number((encodedRates >> BigInt(96)) & BigInt("0xffffffffffffffff")),
    projectId: Number(encodedRates >> BigInt(192)),
  };
} 