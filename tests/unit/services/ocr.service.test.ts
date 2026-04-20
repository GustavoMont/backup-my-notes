import { OCRService } from '@/services/ocr.service';
import { IOCRWrapper } from '@/lib/ocr/ocr.wrapper';
import { expectedText } from '../../mocks/expected-text';
import { InvalidInputError } from '@/infra/errors';

describe('OCRService', () => {
  let ocrService: OCRService;
  let ocrWrapperMock: jest.Mocked<IOCRWrapper>;

  beforeEach(() => {
    ocrWrapperMock = {
      recognize: jest.fn(),
    };
    ocrService = new OCRService(ocrWrapperMock);
  });

  describe('Using generic OCR Wrapper', () => {
    it('With a valid image, returns the extracted text', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      ocrWrapperMock.recognize.mockResolvedValue(expectedText);

      const result = await ocrService.processImage(imageBuffer);

      expect(result).toBe(expectedText);
      expect(ocrWrapperMock.recognize).toHaveBeenCalledWith(imageBuffer);
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

    it('When OCR fails, throws an error', async () => {
      const imageBuffer = Buffer.from('dummy-image');
      ocrWrapperMock.recognize.mockRejectedValue(new Error('Tesseract failed'));

      await expect(ocrService.processImage(imageBuffer)).rejects.toThrow('Tesseract failed');
    });
  });
});
