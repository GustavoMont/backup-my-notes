import { OCRFactory } from '@/utils/factories/ocr.factory';
import { envManager } from '@/infra/env-manager.infra';
import { GoogleVisionOCR } from '@/lib/ocr/google-vision.ocr';
import { TesseractOCR } from '@/lib/ocr/tesseract.ocr';
import { OCRService } from '@/services/ocr.service';
import { OCRHandler } from '@/lib/ocr/handlers/ocr.handler';
import { ImageValidatorHandler } from '@/lib/ocr/handlers/image-validator.handler';

jest.mock('@/lib/ocr/google-vision.ocr');
jest.mock('@/lib/ocr/tesseract.ocr');
jest.mock('@/lib/ocr/handlers/ocr.handler');
jest.mock('@/services/ocr.service');

describe('OCRFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(console, 'warn').mockReturnValue();
  });

  it('With a valid Google Vision API key, it creates OCRHandler with GoogleVision as primary and Tesseract as fallback', () => {
    jest.spyOn(envManager, 'getEnv').mockReturnValue({
      GOOGLE_VISION_JSON_API_KEY: 'valid-key',
    });

    OCRFactory.create();

    expect(GoogleVisionOCR).toHaveBeenCalledWith('valid-key');
    expect(TesseractOCR).toHaveBeenCalled();
    expect(OCRHandler).toHaveBeenCalledWith(expect.any(GoogleVisionOCR), expect.any(TesseractOCR));
    expect(OCRService).toHaveBeenCalledWith(expect.any(ImageValidatorHandler));
  });

  it('With an empty API key, it creates OCRHandler with Tesseract as primary and no fallback', () => {
    jest.spyOn(envManager, 'getEnv').mockReturnValue({
      GOOGLE_VISION_JSON_API_KEY: '',
    });

    OCRFactory.create();

    expect(GoogleVisionOCR).not.toHaveBeenCalled();
    expect(TesseractOCR).toHaveBeenCalled();
    expect(OCRHandler).toHaveBeenCalledWith(expect.any(TesseractOCR));
    expect(OCRService).toHaveBeenCalledWith(expect.any(ImageValidatorHandler));
  });

  it('With "dummy-secret" API key, it creates OCRHandler with Tesseract as primary and no fallback', () => {
    jest.spyOn(envManager, 'getEnv').mockReturnValue({
      GOOGLE_VISION_JSON_API_KEY: 'dummy-secret',
    });

    OCRFactory.create();

    expect(GoogleVisionOCR).not.toHaveBeenCalled();
    expect(TesseractOCR).toHaveBeenCalled();
    expect(OCRHandler).toHaveBeenCalledWith(expect.any(TesseractOCR));
    expect(OCRService).toHaveBeenCalledWith(expect.any(ImageValidatorHandler));
  });

  it('With undefined API key, it creates OCRHandler with Tesseract as primary and no fallback', () => {
    jest.spyOn(envManager, 'getEnv').mockReturnValue({});

    OCRFactory.create();

    expect(GoogleVisionOCR).not.toHaveBeenCalled();
    expect(TesseractOCR).toHaveBeenCalled();
    expect(OCRHandler).toHaveBeenCalledWith(expect.any(TesseractOCR));
    expect(OCRService).toHaveBeenCalledWith(expect.any(ImageValidatorHandler));
  });
});
