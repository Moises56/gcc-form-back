import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    // Ensure the uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Configure multer storage
  getMulterStorage() {
    return multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const fileExtension = file.originalname.split('.').pop();
        const newFilename = `${uniqueSuffix}.${fileExtension}`;
        cb(null, newFilename);
      },
    });
  }
  // Configure multer file filter for images
  getFileFilter() {
    return (_req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Solo se permiten archivos de imagen!'), false);
      }
      cb(null, true);
    };
  }

  // Get the URL for a file
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
  // Delete a file
  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`File deleted successfully: ${filename}`);
        return true;
      } else {
        console.warn(`File not found: ${filename}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      return false;
    }
  }
}
