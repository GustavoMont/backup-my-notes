import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { InvalidInputError } from '@/infra/errors';

export class OCRService {
  private readonly MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100MB

  constructor(
    private readonly primaryOCR: IOCRWrapper,
    private readonly fallbackOCR?: IOCRWrapper,
  ) {}

  async processImage(image: Buffer): Promise<string> {
    if (image.length > this.MAX_IMAGE_SIZE) {
      throw new InvalidInputError({
        message: 'Imagem muito grande.',
        action: 'A imagem deve ter no máximo 100MB.',
      });
    }
    return this.runOCRWithFallback(image, this.primaryOCR, this.fallbackOCR);
  }

  private async runOCRWithFallback(
    image: Buffer,
    primaryOCR: IOCRWrapper,
    fallbackOCR?: IOCRWrapper,
  ): Promise<string> {
    if (!fallbackOCR) return await primaryOCR.recognize(image);

    try {
      return await primaryOCR.recognize(image);
    } catch {
      return await this.runOCRWithFallback(image, fallbackOCR);
    }
  }
}
