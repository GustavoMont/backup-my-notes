import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { getFileFolderPath } from '@/utils/path.utils';

export class FileRepository {
  fileExists(path: string) {
    return existsSync(path);
  }
  async readImage(path: string): Promise<Buffer> {
    return await readFile(path);
  }

  async writeText(path: string, content: string): Promise<void> {
    const folderPath = getFileFolderPath(path);

    await mkdir(folderPath, { recursive: true });
    await writeFile(path, content);
  }
}
