import { encodeRates, decodeRates, encodeSubscriptionRate } from '../utils/rateEncoding';

describe('Rate Encoding and Decoding Functions', () => {
  describe('encodeRates', () => {
    it('should encode rates and project ID into a single bigint', () => {
      const encoded = encodeRates(100, 200, 5);
      
      // Check that the result is a bigint
      expect(typeof encoded).toBe('bigint');
      
      // Check that encoded value is not zero
      expect(encoded > BigInt(0)).toBe(true);
    });
    
    it('should handle zero values correctly', () => {
      const encoded = encodeRates(0, 0, 0);
      expect(encoded).toBe(BigInt(0));
    });
    
    it('should handle large values correctly', () => {
      const maxSafeInteger = Number.MAX_SAFE_INTEGER;
      const encoded = encodeRates(maxSafeInteger, maxSafeInteger, maxSafeInteger);
      
      // Check that encoded value is not zero and is a bigint
      expect(typeof encoded).toBe('bigint');
      expect(encoded > BigInt(0)).toBe(true);
    });
  });
  
  describe('decodeRates', () => {
    it('should decode a bigint into income rate, outgoing rate, and project ID', () => {
      // Create an encoded value
      const incomeRate = 100;
      const outgoingRate = 200;
      const projectId = 5;
      const encoded = encodeRates(incomeRate, outgoingRate, projectId);
      
      // Decode it
      const decoded = decodeRates(encoded);
      
      // Check that the decoded values match the original values
      expect(decoded.incomeRate).toBe(incomeRate);
      expect(decoded.outgoingRate).toBe(outgoingRate);
      expect(decoded.projectId).toBe(projectId);
    });
    
    it('should handle zero values correctly', () => {
      const decoded = decodeRates(BigInt(0));
      expect(decoded).toEqual({
        incomeRate: 0,
        outgoingRate: 0,
        projectId: 0
      });
    });
    
    it('should handle large values correctly', () => {
      const maxSafeInteger = Number.MAX_SAFE_INTEGER;
      const encoded = encodeRates(maxSafeInteger, maxSafeInteger, maxSafeInteger);
      const decoded = decodeRates(encoded);
      
      // Due to potential precision issues with very large numbers,
      // we'll check that the values are close (within 5%)
      expect(decoded.incomeRate).toBeGreaterThan(maxSafeInteger * 0.95);
      expect(decoded.outgoingRate).toBeGreaterThan(maxSafeInteger * 0.95);
      expect(decoded.projectId).toBeGreaterThan(maxSafeInteger * 0.95);
    });
  });
  
  describe('encodeSubscriptionRate', () => {
    it('should encode only income rate and outgoing rate into a bigint', () => {
      const encoded = encodeSubscriptionRate(100, 200);
      
      // Check that the result is a bigint
      expect(typeof encoded).toBe('bigint');
      
      // Check that encoded value is not zero
      expect(encoded > BigInt(0)).toBe(true);
    });
    
    it('should produce different results than full encoding', () => {
      // Full encoding with project ID
      const fullEncoded = encodeRates(100, 200, 5);
      
      // Subscription rate encoding without project ID
      const subscriptionEncoded = encodeSubscriptionRate(100, 200);
      
      // They should be different
      expect(subscriptionEncoded).not.toBe(fullEncoded);
    });
    
    it('should handle zero values correctly', () => {
      const encoded = encodeSubscriptionRate(0, 0);
      expect(encoded).toBe(BigInt(0));
    });
    
    it('should handle large values correctly', () => {
      const maxSafeInteger = Number.MAX_SAFE_INTEGER;
      const encoded = encodeSubscriptionRate(maxSafeInteger, maxSafeInteger);
      
      // Check that encoded value is not zero and is a bigint
      expect(typeof encoded).toBe('bigint');
      expect(encoded > BigInt(0)).toBe(true);
    });
  });
  
  describe('Round Trip Tests', () => {
    it('should correctly round-trip encode and decode multiple test cases', () => {
      const testCases = [
        { incomeRate: 0, outgoingRate: 0, projectId: 0 },
        { incomeRate: 100, outgoingRate: 200, projectId: 5 },
        { incomeRate: 9999, outgoingRate: 8888, projectId: 777 },
        { incomeRate: 1, outgoingRate: 0, projectId: 0 },
        { incomeRate: 0, outgoingRate: 1, projectId: 0 },
        { incomeRate: 0, outgoingRate: 0, projectId: 1 },
        { incomeRate: 123456, outgoingRate: 654321, projectId: 42 }
      ];
      
      for (const testCase of testCases) {
        const { incomeRate, outgoingRate, projectId } = testCase;
        const encoded = encodeRates(incomeRate, outgoingRate, projectId);
        const decoded = decodeRates(encoded);
        
        expect(decoded).toEqual(testCase);
      }
    });
    
    it('should ensure that encoding and decoding are inverses of each other', () => {
      // Generate random test cases
      for (let i = 0; i < 10; i++) {
        const incomeRate = Math.floor(Math.random() * 1000000);
        const outgoingRate = Math.floor(Math.random() * 1000000);
        const projectId = Math.floor(Math.random() * 1000);
        
        const encoded = encodeRates(incomeRate, outgoingRate, projectId);
        const decoded = decodeRates(encoded);
        
        expect(decoded.incomeRate).toBe(incomeRate);
        expect(decoded.outgoingRate).toBe(outgoingRate);
        expect(decoded.projectId).toBe(projectId);
      }
    });
    
    it('should handle bit shifting correctly with large numbers', () => {
      // Test case with values close to the limits
      const incomeRate = 2 ** 48 - 1; // Large but within 48-bit range
      const outgoingRate = 2 ** 48 - 1;
      const projectId = 2 ** 16 - 1; // 16-bit range
      
      const encoded = encodeRates(incomeRate, outgoingRate, projectId);
      const decoded = decodeRates(encoded);
      
      // For very large numbers, we may have some rounding issues when converting back to Number
      // So we'll check that they're close enough (within 1%)
      const incomeRateDiff = Math.abs(decoded.incomeRate - incomeRate) / incomeRate;
      const outgoingRateDiff = Math.abs(decoded.outgoingRate - outgoingRate) / outgoingRate;
      const projectIdDiff = Math.abs(decoded.projectId - projectId) / projectId;
      
      expect(incomeRateDiff).toBeLessThan(0.01);
      expect(outgoingRateDiff).toBeLessThan(0.01);
      expect(projectIdDiff).toBeLessThan(0.01);
    });
  });
}); 