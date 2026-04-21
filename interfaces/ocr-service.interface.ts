export interface IOCRService {
  processImage(image: Buffer): Promise<string>;
}

export interface IOCRHandler {
  handle(image: Buffer): Promise<string>;
  setNext(handler: IOCRHandler): IOCRHandler;
}
