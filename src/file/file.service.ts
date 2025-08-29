import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  uploadPhoto(user: unknown, photo: Express.Multer.File) {
    const result = writeFile(
      join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.png`),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      photo.buffer,
      () => console.log('File uploaded'),
    );

    return result;
  }
}
