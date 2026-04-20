import { OCRService } from '@/services/ocr.service';
import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { expectedText } from '../../mocks/expected-text';
import { InvalidInputError } from '@/infra/errors';

describe('OCRService', () => {
  let ocrService: OCRService;
  let primaryMock: jest.Mocked<IOCRWrapper>;
  let fallbackMock: jest.Mocked<IOCRWrapper>;

  beforeEach(() => {
    primaryMock = {
      recognize: jest.fn(),
    };
    fallbackMock = {
      recognize: jest.fn(),
    };
    ocrService = new OCRService(primaryMock, fallbackMock);
  });

  describe('Using generic OCR Wrapper', () => {
    it('With a valid image, returns the extracted text from primary', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockResolvedValue(expectedText);

      const result = await ocrService.processImage(imageBuffer);

      expect(result).toBe(expectedText);
      expect(primaryMock.recognize).toHaveBeenCalledWith(imageBuffer);
      expect(fallbackMock.recognize).not.toHaveBeenCalled();
    });

    it('When primary fails and fallback is available, returns text from fallback', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));
      fallbackMock.recognize.mockResolvedValue('Fallback text');

      const result = await ocrService.processImage(imageBuffer);

      expect(result).toBe('Fallback text');
      expect(primaryMock.recognize).toHaveBeenCalled();
      expect(fallbackMock.recognize).toHaveBeenCalledWith(imageBuffer);
    });

    it('When both primary and fallback fail, throws an error', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));
      fallbackMock.recognize.mockRejectedValue(new Error('Fallback failed'));

      await expect(ocrService.processImage(imageBuffer)).rejects.toThrow('Fallback failed');
    });

    it('When primary fails and NO fallback is available, throws an error', async () => {
      ocrService = new OCRService(primaryMock);
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));

      await expect(ocrService.processImage(imageBuffer)).rejects.toThrow('Primary failed');
    });

    it('With an image larger than 100MB, throws InvalidInputError', async () => {
      const bigBuffer = Buffer.alloc(100 * 1024 * 1024 + 1);

      await expect(ocrService.processImage(bigBuffer)).rejects.toThrow(
        new InvalidInputError({
          message: 'Imagem muito grande.',
          action: 'A imagem deve ter no máximo 100MB.',
        }),
      );
    });
  });
});
