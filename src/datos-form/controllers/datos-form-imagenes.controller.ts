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
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { DatosFormImagenesService } from '../services/datos-form-imagenes.service';
import { UploadsService } from '../../uploads/uploads.service';
import { CreateImagenDto, UpdateImagenDescriptionDto } from '../dto/datos-form.dto';

// Define the ImagenForm interface to match the Prisma model
export interface ImagenForm {
  id: string;
  url: string;
  descripcion: string | null;
  datosFormId: string;
  createdAt: Date;
}

@UseGuards(JwtGuard, RolesGuard)
@Controller('datos-form/imagenes')
export class DatosFormImagenesController {
  constructor(
    private datosFormImagenesService: DatosFormImagenesService,
    private uploadsService: UploadsService,
  ) {}

  @Post(':formId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('formId') formId: string,
    @GetUser('id') userId: string,
  ): Promise<ImagenForm> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const url = this.uploadsService.getFileUrl(file.filename);
    const imageData: CreateImagenDto = {
      url,
      descripcion: '',
    };

    return this.datosFormImagenesService.addImageToForm(
      formId,
      imageData,
      userId,
    ) as Promise<ImagenForm>;
  }

  @Post('multiple/:formId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('formId') formId: string,
    @GetUser('id') userId: string,
  ): Promise<ImagenForm[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }    const currentImages = (await this.datosFormImagenesService.getFormImages(
      formId,
    )) as ImagenForm[];
    
    if (currentImages.length + files.length > 10) {
      throw new BadRequestException(
        'El formulario no puede tener más de 10 imágenes en total',
      );
    }

    const results: ImagenForm[] = [];
    for (const file of files) {
      const url = this.uploadsService.getFileUrl(file.filename);
      const imageData: CreateImagenDto = {
        url,
        descripcion: '',
      };

      const image = await this.datosFormImagenesService.addImageToForm(
        formId,
        imageData,
        userId,
      );
      results.push(image as ImagenForm);
    }

    return results;
  }

  @Get(':formId')
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  async getFormImages(@Param('formId') formId: string): Promise<
    ImagenForm[]
  > {
    return this.datosFormImagenesService.getFormImages(formId) as Promise<
      ImagenForm[]
    >;
  }

  @Delete(':imageId')
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