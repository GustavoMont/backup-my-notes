import { MathController } from '@/controllers/math.controller';
import { MathService } from '@/services/math.service';

describe('MathController Integration', () => {
  let controller: MathController;
  let service: MathService;

  beforeEach(() => {
    service = new MathService();
    controller = new MathController(service);
  });

  it('should return the sum when calculateSum is called', () => {
    const result = controller.calculateSum(5, 5);
    expect(result).toBe(10);
  });
});
