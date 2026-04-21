import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { BaseOCRHandler } from '@/utils/chains/ocr.chain';

export class OCRHandler extends BaseOCRHandler {
  constructor(
    private readonly primaryOCR: IOCRWrapper,
    private readonly fallbackOCR?: IOCRWrapper,
  ) {
    super();
  }

  async handle(image: Buffer): Promise<string> {
    return this.runWithFallback(image, this.primaryOCR, this.fallbackOCR);
  }

  private async runWithFallback(
    image: Buffer,
    primary: IOCRWrapper,
    fallback?: IOCRWrapper,
  ): Promise<string> {
    if (!fallback) return primary.recognize(image);

    try {
      return await primary.recognize(image);
    } catch {
      return this.runWithFallback(image, fallback);
    }
  }
}
