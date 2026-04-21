import { BaseError, InvalidInputError } from '@/infra/errors';
import { BaseOCRHandler } from '@/utils/chains/ocr.chain';
import sharp from 'sharp';

export class ImageValidatorHandler extends BaseOCRHandler {
  private readonly MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100MB

  async handle(image: Buffer): Promise<string> {
    if (image.length > this.MAX_IMAGE_SIZE) {
      throw new InvalidInputError({
        message: 'Imagem muito grande.',
        action: 'A imagem deve ter no máximo 100MB.',
      });
    }
    try {
      await sharp(image).metadata();
      return this.handleNext(image);
    } catch (error) {
      if (error instanceof BaseError) throw error;
      throw new InvalidInputError({
        message: 'Imagem inválida.',
        action: 'Envie um arquivo de imagem válido.',
      });
    }
  }
}
