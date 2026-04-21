import { IOCRHandler } from '@/interfaces/ocr-service.interface';

export class OCRService {
  constructor(private readonly handler: IOCRHandler) {}

  processImage(image: Buffer): Promise<string> {
    return this.handler.handle(image);
  }
}
