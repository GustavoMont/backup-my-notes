import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { expectedText } from '@/tests/mocks/expected-text';
import { OCRHandler } from '@/lib/ocr/handlers/ocr.handler';
import { IOCRHandler } from '@/interfaces/ocr-service.interface';

describe('OCRHandler', () => {
  let ocrService: IOCRHandler;
  let primaryMock: jest.Mocked<IOCRWrapper>;
  let fallbackMock: jest.Mocked<IOCRWrapper>;

  beforeEach(() => {
    primaryMock = {
      recognize: jest.fn(),
    };
    fallbackMock = {
      recognize: jest.fn(),
    };
    ocrService = new OCRHandler(primaryMock, fallbackMock);
  });

  describe('Using generic OCR Wrapper', () => {
    it('With a valid image, returns the extracted text from primary', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockResolvedValue(expectedText);

      const result = await ocrService.handle(imageBuffer);

      expect(result).toBe(expectedText);
      expect(primaryMock.recognize).toHaveBeenCalledWith(imageBuffer);
      expect(fallbackMock.recognize).not.toHaveBeenCalled();
    });

    it('When primary fails and fallback is available, returns text from fallback', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));
      fallbackMock.recognize.mockResolvedValue('Fallback text');

      const result = await ocrService.handle(imageBuffer);

      expect(result).toBe('Fallback text');
      expect(primaryMock.recognize).toHaveBeenCalled();
      expect(fallbackMock.recognize).toHaveBeenCalledWith(imageBuffer);
    });

    it('When both primary and fallback fail, throws an error', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));
      fallbackMock.recognize.mockRejectedValue(new Error('Fallback failed'));

      await expect(ocrService.handle(imageBuffer)).rejects.toThrow('Fallback failed');
    });

    it('When primary fails and NO fallback is available, throws an error', async () => {
      ocrService = new OCRHandler(primaryMock);
      const imageBuffer = Buffer.from('dummy-image');
      primaryMock.recognize.mockRejectedValue(new Error('Primary failed'));

      await expect(ocrService.handle(imageBuffer)).rejects.toThrow('Primary failed');
    });
  });
});
