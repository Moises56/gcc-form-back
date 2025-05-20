import { Module, forwardRef } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { DatosFormModule } from '../datos-form/datos-form.module';

const uploadDir = join(process.cwd(), 'uploads');
// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const fileExtension = file.originalname.split('.').pop();
          const newFilename = `${uniqueSuffix}.${fileExtension}`;
          cb(null, newFilename);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Solo se permiten archivos de imagen!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },    }),
    forwardRef(() => DatosFormModule),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService, MulterModule],
})
export class UploadsModule {}
