import { MathService } from 'services/math.service';

export class MathController {
  constructor(private mathService: MathService) {}

  calculateSum(a: number, b: number): number {
    return this.mathService.sum(a, b);
  }
}
