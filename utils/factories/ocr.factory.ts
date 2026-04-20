import { envManager } from '@/infra/env-manager.infra';
import { GoogleVisionOCR } from '@/lib/ocr/google-vision.ocr';
import { TesseractOCR } from '@/lib/ocr/tesseract.ocr';
import { OCRService } from '@/services/ocr.service';
import { DEFAULT_DUMMY_SECRET_VALUE } from '../constants';

export class OCRFactory {
  static create(): OCRService {
    const key = envManager.getVariable('GOOGLE_VISION_JSON_API_KEY') as string;
    const isKeyValid = key && key !== '' && key !== DEFAULT_DUMMY_SECRET_VALUE;

    if (isKeyValid) {
      const primary = new GoogleVisionOCR(key);
      const fallback = new TesseractOCR();
      return new OCRService(primary, fallback);
    }

    const primary = new TesseractOCR();
    return new OCRService(primary);
  }
}
