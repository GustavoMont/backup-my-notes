import { ImageAnnotatorClient } from '@google-cloud/vision';
import { IOCRWrapper } from './ocr.wrapper';

export class GoogleVisionOCR implements IOCRWrapper {
  private client?: ImageAnnotatorClient;

  constructor(private readonly jsonCredentials?: string) {}

  private getClient(): ImageAnnotatorClient {
    if (!this.client) {
      const credentials = this.jsonCredentials ? JSON.parse(this.jsonCredentials) : undefined;
      this.client = new ImageAnnotatorClient({ credentials });
    }
    return this.client;
  }

  async recognize(image: Buffer): Promise<string> {
    const client = this.getClient();
    const [result] = await client.textDetection(image);
    const text = result.fullTextAnnotation?.text;

    return text ?? '';
  }
}
