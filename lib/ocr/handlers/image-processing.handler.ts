import { ImagePreprocessor } from '@/lib/image-preprocessor.lib';
import { BaseOCRHandler } from '@/utils/chains/ocr.chain';

export class ImagePreprocessingHandler extends BaseOCRHandler {
  constructor(private readonly preprocessor: ImagePreprocessor) {
    super();
  }

  async handle(image: Buffer): Promise<string> {
    const processed = await this.preprocessor.process(image);
    return this.handleNext(processed);
  }
}
