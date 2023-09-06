import { join } from 'path';
import { existsSync } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticFile(filename: string) {
    const path = join(__dirname, '../../static/products', filename);

    if (!existsSync(path))
      throw new NotFoundException(`File: ${filename} not found`);

    return path;
  }
}
