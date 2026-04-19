import { InvalidInputError } from '@/infra/errors';
import { join } from 'node:path';
import { FileRepository } from '@/repositories/file.repository';
import { getFileFolderPath, getFileNameFromPath } from '@/utils/path.utils';
import { OCRService } from './ocr.service';

export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private ocrService: OCRService,
  ) {}

  async processFile(imagePath: string, destPath?: string): Promise<void> {
    const isValidImagePath = this.fileRepository.fileExists(imagePath);
    if (!isValidImagePath) {
      throw new InvalidInputError({
        message: 'Imagem não encontrada.',
        action: 'Verifique se o caminho para imagem está correto.',
      });
    }
    const image = await this.fileRepository.readImage(imagePath);
    const defaultFilePath = join(
      getFileFolderPath(imagePath),
      `${getFileNameFromPath(imagePath)}.txt`,
    );
    const finalPath = destPath?.trim() ? destPath : defaultFilePath;

    const content = await this.ocrService.processImage(image);

    await this.fileRepository.writeText(finalPath, content);
  }
}
