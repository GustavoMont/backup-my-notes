import { FileService } from '@/services/file.service';
import { FileRepository } from '@/repositories/file.repository';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { InvalidInputError } from '@/infra/errors';
import { OCRService } from '@/services/ocr.service';

describe('FileController Integration', () => {
  let tempDir: string;
  let fileService: FileService;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(os.tmpdir(), 'backup-my-notes-'));
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true });
  });

  beforeEach(() => {
    const fileRepository = new FileRepository();
    const ocrService = new OCRService();
    fileService = new FileService(fileRepository, ocrService);
  });

  it('With output path provided', async () => {
    const imagePath = join(tempDir, 'input.jpg');
    const destPath = join(tempDir, 'folder', 'output.txt');

    await writeFile(imagePath, 'fake-image-data');

    await fileService.processFile(imagePath, destPath);

    expect(existsSync(destPath)).toBe(true);
    const content = await readFile(destPath, 'utf-8');
    expect(content).toContain('File content placeholder');
  });

  it('With no output path provided.', async () => {
    const imagePath = join(tempDir, 'input.jpg');
    await writeFile(imagePath, 'fake-image-data');

    await fileService.processFile(imagePath);

    const defaultPath = join(tempDir, 'input.txt');
    expect(existsSync(defaultPath)).toBe(true);
  });

  it('With nonexisting image', async () => {
    const imagePath = join(tempDir, 'void', 'non-existing.jpg');

    await expect(fileService.processFile(imagePath)).rejects.toThrow(
      new InvalidInputError({
        action: 'Verifique se o caminho para imagem está correto.',
        message: 'Imagem não encontrada.',
      }),
    );
  });
  it('With no provided image path', async () => {
    await expect(fileService.processFile('')).rejects.toThrow(
      new InvalidInputError({
        action: 'Verifique se o caminho para imagem está correto.',
        message: 'Imagem não encontrada.',
      }),
    );
  });
});
