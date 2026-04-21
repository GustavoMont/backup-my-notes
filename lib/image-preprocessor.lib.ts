import sharp from 'sharp';

export type ImagePreprocessorOptions = {
  grayscale?: boolean;
  contrastEnhancement?: boolean;
  binarize?: boolean;
  binarizeThreshold?: number; // 0–255, padrão 128
};

const DEFAULT_OPTIONS: Required<ImagePreprocessorOptions> = {
  grayscale: true,
  contrastEnhancement: true,
  binarize: true,
  binarizeThreshold: 128,
};

export class ImagePreprocessor {
  private readonly options: Required<ImagePreprocessorOptions>;

  constructor(options: ImagePreprocessorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async process(image: Buffer): Promise<Buffer> {
    let pipeline = sharp(image);
    if (this.options.grayscale) {
      pipeline = pipeline.grayscale();
    }

    if (this.options.contrastEnhancement) {
      pipeline = pipeline.normalise();
    }

    if (this.options.binarize) {
      pipeline = pipeline.threshold(this.options.binarizeThreshold);
    }

    return await pipeline.toBuffer();
  }
}
