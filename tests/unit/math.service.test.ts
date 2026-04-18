import { MathService } from 'services/math.service';

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    service = new MathService();
  });

  it('should sum two numbers correctly', () => {
    expect(service.sum(1, 2)).toBe(3);
  });
});
