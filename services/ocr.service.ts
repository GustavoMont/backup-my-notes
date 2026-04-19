export class OCRService {
  async processImage(image: Buffer<ArrayBufferLike>): Promise<string> {
    return `File content placeholder: ${image.toString('base64').substring(0, 20)}...`;
  }
}
