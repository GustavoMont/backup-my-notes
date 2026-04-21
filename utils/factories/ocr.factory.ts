import { envManager } from '@/infra/env-manager.infra';
import { GoogleVisionOCR } from '@/lib/ocr/google-vision.ocr';
import { TesseractOCR } from '@/lib/ocr/tesseract.ocr';
import { OCRHandler } from '@/lib/ocr/handlers/ocr.handler';
import { OCRService } from '@/services/ocr.service';
import { DEFAULT_DUMMY_SECRET_VALUE } from '../constants';
import { ImageValidatorHandler } from '@/lib/ocr/handlers/image-validator.handler';
import { ImagePreprocessingHandler } from '@/lib/ocr/handlers/image-processing.handler';
import { ImagePreprocessor } from '@/lib/image-preprocessor.lib';

export class OCRFactory {
  static create(): OCRService {
    const key = envManager.getVariable('GOOGLE_VISION_JSON_API_KEY') as string;
    const isKeyValid = key && key !== '' && key !== DEFAULT_DUMMY_SECRET_VALUE;

    const imageValidator = new ImageValidatorHandler();
    const preprocessHandler = new ImagePreprocessingHandler(new ImagePreprocessor());
    const ocrHandler = isKeyValid
      ? new OCRHandler(new GoogleVisionOCR(key), new TesseractOCR())
      : new OCRHandler(new TesseractOCR());

    imageValidator.setNext(preprocessHandler).setNext(ocrHandler);

    return new OCRService(imageValidator);
  }
}
