import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggingService } from '../../logging/logging.service';
import { CreateImagenDto } from '../dto/datos-form.dto';
import { UploadsService } from '../../uploads/uploads.service';

@Injectable()
export class DatosFormImagenesService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private uploadsService: UploadsService,
  ) {}
  // Add image to form
  async addImageToForm(formId: number, imageData: CreateImagenDto, userId: string) {
    // Check if form exists
    const form = await this.prisma.datosForm.findUnique({
      where: { id: formId }
    });

    if (!form) {
      throw new NotFoundException(`Formulario con ID ${formId} no encontrado`);
    }

    // Check if form already has 6 images - get count from database
    const imageCount = await this.prisma.imagenForm.count({
      where: { datosFormId: formId }
    });

    if (imageCount >= 6) {
      throw new NotFoundException('El formulario ya tiene el máximo de 6 imágenes permitidas');
    }

    // Add image to form
    const newImage = await this.prisma.imagenForm.create({
      data: {
        url: imageData.url,
        descripcion: imageData.descripcion || '',
        datosForm: {
          connect: { id: formId },
        },
      },
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'UPDATE',
      descripcion: `Imagen agregada al formulario de inspección (ID: ${formId})`,
      entidad: 'DatosForm',
      datosFormId: formId,
    });

    return newImage;
  }

  // Delete image from form
  async deleteImage(imageId: number, userId: string) {
    // Check if image exists
    const image = await this.prisma.imagenForm.findUnique({
      where: { id: imageId },
      include: { datosForm: true },
    });

    if (!image) {
      throw new NotFoundException(`Imagen con ID ${imageId} no encontrada`);
    }

    // Get filename from URL
    const filename = image.url.split('/').pop();
    
    // Delete the image file if it exists
    if (filename) {
      this.uploadsService.deleteFile(filename);
    }

    // Delete the image record
    await this.prisma.imagenForm.delete({
      where: { id: imageId },
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'DELETE',
      descripcion: `Imagen eliminada del formulario de inspección (ID: ${image.datosForm.id})`,
      entidad: 'DatosForm',
      datosFormId: image.datosForm.id,
    });

    return { message: 'Imagen eliminada exitosamente' };
  }
  // Get all images for a form
  async getFormImages(formId: number) {
    // Check if form exists
    const form = await this.prisma.datosForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      throw new NotFoundException(`Formulario con ID ${formId} no encontrado`);
    }

    // Get all images directly
    const images = await this.prisma.imagenForm.findMany({
      where: { datosFormId: formId },
    });

    return images;
  }

  // Update image description
  async updateImageDescription(imageId: number, description: string, userId: string) {
    // Check if image exists
    const image = await this.prisma.imagenForm.findUnique({
      where: { id: imageId },
      include: { datosForm: true },
    });

    if (!image) {
      throw new NotFoundException(`Imagen con ID ${imageId} no encontrada`);
    }

    // Update the image description
    const updatedImage = await this.prisma.imagenForm.update({
      where: { id: imageId },
      data: { descripcion: description },
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'UPDATE',
      descripcion: `Descripción de imagen actualizada (ID: ${imageId})`,
      entidad: 'DatosForm',
      datosFormId: image.datosForm.id,
    });

    return updatedImage;
  }
}
