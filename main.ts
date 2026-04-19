import { FileService } from './services/file.service';
import { FileRepository } from './repositories/file.repository';
import * as readline from 'readline';
import { OCRService } from '@/services/ocr.service';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileRepository = new FileRepository();
const ocrService = new OCRService();
const fileService = new FileService(fileRepository, ocrService);

console.log('--- Backup My Notes ---');

rl.question('Digite o caminho da imagem: ', (imagePath) => {
  rl.question('Digite o caminho de destino (ex: output.txt): ', async (destPath) => {
    try {
      await fileService.processFile(imagePath.trim(), destPath.trim());
      console.log('Arquivo criado com sucesso!');
    } catch (error) {
      if (!(error instanceof Error)) return;
      if ('code' in error && error?.code === 'EISDIR') {
        console.error(
          'Erro: O destino fornecido é um diretório, por favor forneça um caminho completo de arquivo (ex: output.txt).',
        );
      } else {
        console.error('Erro ao processar arquivo:', error.message);
      }
    } finally {
      rl.close();
    }
  });
});
