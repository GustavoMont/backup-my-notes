import { ImplementationError } from '@/infra/errors';
import { IOCRHandler } from '@/interfaces/ocr-service.interface';

export abstract class BaseOCRHandler implements IOCRHandler {
  private next?: IOCRHandler;

  setNext(handler: IOCRHandler): IOCRHandler {
    this.next = handler;
    return handler;
  }

  abstract handle(image: Buffer): Promise<string>;

  protected handleNext(image: Buffer): Promise<string> {
    if (!this.next)
      throw new ImplementationError({
        message: 'Nenhum handler configurado para continuar a cadeia.',
        action: 'Analise o ultimo handler da cadeia e assegure que ele não chame o `handleNext`',
      });

    return this.next.handle(image);
  }
}
