import { IOCRHandler } from '@/interfaces/ocr-service.interface';
import { ImageValidatorHandler } from '@/lib/ocr/handlers/image-validator.handler';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import os from 'node:os';
import { ImplementationError, InternalError, InvalidInputError } from '@/infra/errors';

describe('ImageValidatorHandler', () => {
  const nextHandler: IOCRHandler = {
    handle: jest.fn(),
    setNext: jest.fn(),
  };
  let tempDir: string;
  let imageValidatorHandler: ImageValidatorHandler;
  let validImageBuffer: Buffer;

  beforeEach(() => {
    jest.restoreAllMocks();
    imageValidatorHandler = new ImageValidatorHandler();
    imageValidatorHandler.setNext(nextHandler);
  });
  beforeAll(async () => {
    tempDir = await mkdtemp(join(os.tmpdir(), 'backup-my-notes-'));
    validImageBuffer = await readFile(join('tests', 'mocks', 'valid-image.png'));
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true });
  });

  it('With valid image buffer', async () => {
    imageValidatorHandler = new ImageValidatorHandler();

    imageValidatorHandler.setNext(nextHandler);

    await imageValidatorHandler.handle(validImageBuffer);
    expect(nextHandler.handle).toHaveBeenCalledWith(validImageBuffer);
  });
  it('With image bigger than 100MB limit', async () => {
    const bigBuffer = Buffer.alloc(100 * 1024 * 1024 + 1);

    await expect(imageValidatorHandler.handle(bigBuffer)).rejects.toThrow(
      new InvalidInputError({
        message: 'Imagem muito grande.',
        action: 'A imagem deve ter no máximo 100MB.',
      }),
    );
  });
  it('With invalid image buffer', async () => {
    const invalidBuffer = Buffer.alloc(10 * 1024 * 1024 + 1);

    await expect(imageValidatorHandler.handle(invalidBuffer)).rejects.toThrow(
      new InvalidInputError({
        message: 'Imagem inválida.',
        action: 'Envie um arquivo de imagem válido.',
      }),
    );
  });
  it('With handleNext throwing error', async () => {
    const error = new InternalError({
      action: 'Acão',
      message: 'Mesnagem',
    });
    jest.spyOn(nextHandler, 'handle').mockRejectedValueOnce(error);
    await expect(imageValidatorHandler.handle(validImageBuffer)).rejects.toThrow(error);
  });
  it('Without next handler', async () => {
    const imageValidatorHandler = new ImageValidatorHandler();
    await expect(imageValidatorHandler.handle(validImageBuffer)).rejects.toThrow(
      new ImplementationError({
        message: 'Nenhum handler configurado para continuar a cadeia.',
        action: 'Analise o ultimo handler da cadeia e assegure que ele não chame o `handleNext`',
      }),
    );
  });
});
