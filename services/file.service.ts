import { InvalidInputError } from '@/infra/errors';
import { join, extname } from 'node:path';
import { FileRepository } from '@/repositories/file.repository';
import { getFileFolderPath, getFileNameFromPath } from '@/utils/path.utils';
import { OCRService } from './ocr.service';

export class FileService {
  private readonly ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.bmp', '.webp'];

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

    const extension = extname(imagePath).toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new InvalidInputError({
        message: 'Formato de arquivo não suportado.',
        action: `Envie uma imagem nos formatos: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
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
