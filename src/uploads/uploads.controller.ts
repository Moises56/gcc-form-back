import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Param,
  Delete,
  BadRequestException,
  Req,
  Put,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UploadsService } from './uploads.service';
import { DatosFormImagenesService } from '../datos-form/services/datos-form-imagenes.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateImagenDescriptionDto } from '../datos-form/dto/datos-form.dto';

// Define the ImagenForm interface to match the Prisma model
export interface ImagenForm {
  id: string;
  url: string;
  descripcion: string | null;
  datosFormId: string;
  createdAt: Date;
}

@UseGuards(JwtGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {
  constructor(
    private uploadsService: UploadsService,
    private datosFormImagenesService: DatosFormImagenesService,
  ) {}

  @Post('single/:formId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('formId') formId: string,
    @Req() req: any,
    @GetUser('id') userId: string,
  ): Promise<ImagenForm> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    // Safely extract descripcion from form-data
    const descripcion: string = req.body?.descripcion || '';
    const url = this.uploadsService.getFileUrl(file.filename);

    return this.datosFormImagenesService.addImageToForm(
      formId,
      {
        url,
        descripcion,
      },
      userId,
    ) as Promise<ImagenForm>;
  }
  @Post('multiple/:formId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('formId') formId: string,
    @Req() req: any,
    @GetUser('id') userId: string,
  ): Promise<ImagenForm[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const currentImages = (await this.datosFormImagenesService.getFormImages(
      formId,
    )) as ImagenForm[];

    if (currentImages.length + files.length > 10) {
      throw new BadRequestException(
        'El formulario no puede tener más de 10 imágenes en total',
      );
    }

    const results: ImagenForm[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = this.uploadsService.getFileUrl(file.filename);

      // Safely extract descripcion from form-data
      let descripcion = '';

      // First, try to get individual descriptions (array)
      if (
        req.body?.descripciones &&
        Array.isArray(req.body.descripciones) &&
        req.body.descripciones[i]
      ) {
        descripcion = String(req.body.descripciones[i]);
      }
      // If no individual descriptions, use general description
      else if (req.body?.descripcion) {
        descripcion = String(req.body.descripcion);
      }

      const image = await this.datosFormImagenesService.addImageToForm(
        formId,
        {
          url,
          descripcion,
        },
        userId,
      );
      results.push(image as ImagenForm);
    }

    return results;
  }

  @Delete('image/:imageId')
  @Roles('ADMIN', 'MODERADOR')
  async deleteImage(
    @Param('imageId') imageId: string,
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return this.datosFormImagenesService.deleteImage(imageId, userId);
  }

  @Put('description/:imageId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  async updateImageDescription(
    @Param('imageId') imageId: string,
    @Body() updateData: UpdateImagenDescriptionDto,
    @GetUser('id') userId: string,
  ): Promise<ImagenForm> {
    return this.datosFormImagenesService.updateImageDescription(
      imageId,
      updateData.descripcion,
      userId,
    ) as Promise<ImagenForm>;
  }
}
