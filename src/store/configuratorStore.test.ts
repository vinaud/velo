import { describe, it, expect } from 'vitest';
import { calculateTotalPrice, calculateInstallment, formatPrice, CarConfiguration, useConfiguratorStore } from './configuratorStore';

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

describe('configuratorStore actions', () => {
  it('should toggle an optional feature correctly', () => {
    // Reset state before test
    useConfiguratorStore.getState().resetConfiguration()

    // Initial state has no optionals
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual([])

    // Toggle a feature (should add it)
    useConfiguratorStore.getState().toggleOptional('precision-park')
    expect(useConfiguratorStore.getState().configuration.optionals).toContain('precision-park')

    // Toggle the same feature (should remove it)
    useConfiguratorStore.getState().toggleOptional('precision-park')
    expect(useConfiguratorStore.getState().configuration.optionals).not.toContain('precision-park')
  })

  it('should handle login logic depending on previous orders', () => {
    useConfiguratorStore.setState({ orders: [] })
    useConfiguratorStore.getState().logout()

    // Login fails if there are no orders for the email
    const loginResult1 = useConfiguratorStore.getState().login('test@example.com')
    expect(loginResult1).toBe(false)
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull()

    // Add a mock order
    useConfiguratorStore.setState({
      orders: [
        {
          id: '1',
          configuration: { exteriorColor: 'glacier-blue', interiorColor: 'carbon-black', wheelType: 'aero', optionals: [] },
          totalPrice: 40000,
          customer: { name: 'Test', surname: 'User', email: 'test@example.com', phone: '', cpf: '', store: '' },
          paymentMethod: 'avista',
          status: 'APROVADO',
          createdAt: new Date().toISOString()
        }
      ]
    })

    // Login succeeds now
    const loginResult2 = useConfiguratorStore.getState().login('test@example.com')
    expect(loginResult2).toBe(true)
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('test@example.com')
  })
})