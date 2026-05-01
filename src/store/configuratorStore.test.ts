import { describe, it, expect } from 'vitest';
import { calculateTotalPrice, calculateInstallment, formatPrice, CarConfiguration } from './configuratorStore';

describe('configuratorStore pure functions', () => {
  describe('calculateTotalPrice', () => {
    it('should calculate base price with default aero wheels and no optionals', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: []
      };
      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it('should calculate price with sport wheels', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: []
      };
      expect(calculateTotalPrice(config)).toBe(42000); // 40000 + 2000
    });

    it('should calculate price with optionals', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park', 'flux-capacitor']
      };
      expect(calculateTotalPrice(config)).toBe(50500); // 40000 + 5500 + 5000
    });
    
    it('should calculate price with sport wheels and optionals', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: ['flux-capacitor']
      };
      expect(calculateTotalPrice(config)).toBe(47000); // 40000 + 2000 + 5000
    });
  });

  describe('calculateInstallment', () => {
    it('should calculate the correct installment value with 2% monthly compound interest over 12 months', () => {
      // For 40000, monthlyRate = 0.02, months = 12
      // installment = (40000 * 0.02 * (1.02^12)) / ((1.02^12) - 1)
      // ≈ 3782.38
      expect(calculateInstallment(40000)).toBe(3782.38);
    });
  });

  describe('formatPrice', () => {
    it('should format numbers to BRL currency', () => {
      const formatted = formatPrice(40000);
      expect(formatted).toContain('40.000,00');
      expect(formatted).toContain('R$');
    });
  });
});
