import { createWorker } from 'tesseract.js';
import { IOCRWrapper } from './ocr.wrapper';

export class TesseractOCR implements IOCRWrapper {
  async recognize(image: Buffer): Promise<string> {
    const worker = await createWorker('por');
    const {
      data: { text },
    } = await worker.recognize(image);
    await worker.terminate();

    return text;
  }
}
