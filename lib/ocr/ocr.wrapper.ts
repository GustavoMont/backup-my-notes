export interface IOCRWrapper {
  recognize(image: Buffer): Promise<string>;
}
