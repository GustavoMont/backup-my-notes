import { ImagePreprocessor } from '@/lib/image-preprocessor.lib';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

describe('ImagePreProcessor', () => {
  let validImageBuffer: Buffer;
  beforeEach(jest.clearAllMocks);
  beforeAll(async () => {
    validImageBuffer = await readFile(join('tests', 'mocks', 'valid-image.png'));
  });
  it('With default options', async () => {
    const imageProcessor = new ImagePreprocessor();
    const grayscaleSpy = jest.spyOn(sharp.prototype, 'grayscale');
    const normaliseSpy = jest.spyOn(sharp.prototype, 'normalise');
    const thresholdSpy = jest.spyOn(sharp.prototype, 'threshold');
    imageProcessor.process(validImageBuffer);
    expect(grayscaleSpy).toHaveBeenCalled();
    expect(normaliseSpy).toHaveBeenCalled();
    expect(thresholdSpy).toHaveBeenCalled();
  });
  it('With only grayscale', async () => {
    const imageProcessor = new ImagePreprocessor({
      grayscale: true,
      binarize: false,
      contrastEnhancement: false,
    });
    const grayscaleSpy = jest.spyOn(sharp.prototype, 'grayscale');
    const normaliseSpy = jest.spyOn(sharp.prototype, 'normalise');
    const thresholdSpy = jest.spyOn(sharp.prototype, 'threshold');
    imageProcessor.process(validImageBuffer);
    expect(grayscaleSpy).toHaveBeenCalled();
    expect(normaliseSpy).not.toHaveBeenCalled();
    expect(thresholdSpy).not.toHaveBeenCalled();
  });
  it('With only contrastEnhancement', async () => {
    const imageProcessor = new ImagePreprocessor({
      grayscale: false,
      binarize: false,
      contrastEnhancement: true,
    });
    const grayscaleSpy = jest.spyOn(sharp.prototype, 'grayscale');
    const normaliseSpy = jest.spyOn(sharp.prototype, 'normalise');
    const thresholdSpy = jest.spyOn(sharp.prototype, 'threshold');
    imageProcessor.process(validImageBuffer);
    expect(grayscaleSpy).not.toHaveBeenCalled();
    expect(normaliseSpy).toHaveBeenCalled();
    expect(thresholdSpy).not.toHaveBeenCalled();
  });
  it('With only binarize', async () => {
    const imageProcessor = new ImagePreprocessor({
      grayscale: false,
      binarize: true,
      contrastEnhancement: false,
    });
    const grayscaleSpy = jest.spyOn(sharp.prototype, 'grayscale');
    const normaliseSpy = jest.spyOn(sharp.prototype, 'normalise');
    const thresholdSpy = jest.spyOn(sharp.prototype, 'threshold');
    imageProcessor.process(validImageBuffer);
    expect(grayscaleSpy).not.toHaveBeenCalled();
    expect(normaliseSpy).not.toHaveBeenCalled();
    expect(thresholdSpy).toHaveBeenCalled();
  });
});
