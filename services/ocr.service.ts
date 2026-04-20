import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { InvalidInputError } from '@/infra/errors';

export class OCRService {
  private readonly MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100MB

  constructor(private readonly ocrWrapper: IOCRWrapper) {}

  async processImage(image: Buffer): Promise<string> {
    try {
      if (image.length > this.MAX_IMAGE_SIZE) {
        throw new InvalidInputError({
          message: 'Imagem muito grande.',
          action: 'A imagem deve ter no máximo 100MB.',
        });
      }

      return this.ocrWrapper.recognize(image);
    } catch (error) {
      console.log('-'.repeat(50));

      console.log(error);
      console.log('-'.repeat(50));
      throw error;
    }
  }
}
