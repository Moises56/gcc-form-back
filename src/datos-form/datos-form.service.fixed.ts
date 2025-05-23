import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDatosFormDto,
  FilterDatosFormDto,
  PaginatedResponse,
  UpdateDatosFormDto,
} from './dto/datos-form.dto';
import { LoggingService } from '../logging/logging.service';
import { DatabaseCleanupService } from '../common/services/database-cleanup.service';

@Injectable()
export class DatosFormService {
  constructor(
    private prisma: PrismaService,
    private loggingService: LoggingService,
    private databaseCleanupService: DatabaseCleanupService,
  ) {}

  // Create new form
  async createForm(dto: CreateDatosFormDto, userId: string) {
    // Ensure the logged in user is the one creating the form
    const data = { ...dto, userId };

    const createdForm = await this.prisma.datosForm.create({
      data,
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'CREATE',
      descripcion: `Creación de formulario de inspección (ID: ${createdForm.id})`,
      entidad: 'DatosForm',
      datosFormId: createdForm.id,
    });

    return createdForm;
  }
  
  // Get all forms
  async getAllForms(filters?: FilterDatosFormDto): Promise<PaginatedResponse<any>> {
    const where: any = {};

    if (filters?.numeroNota) {
      where.numeroNota = { contains: filters.numeroNota };
    }

    if (filters?.propietario) {
      where.propietario = { contains: filters.propietario };
    }

    if (filters?.direccionObra) {
      where.direccionObra = { contains: filters.direccionObra };
    }

    if (filters?.sectorCatastral) {
      where.sectorCatastral = { contains: filters.sectorCatastral };
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.areaPrivada !== undefined) {
      where.areaPrivada = filters.areaPrivada;
    }

    if (filters?.areaUsoPublico !== undefined) {
      where.areaUsoPublico = filters.areaUsoPublico;
    }

    if (filters?.fechaInicioCreacion || filters?.fechaFinCreacion) {
      where.fechaCreacion = {};
      
      if (filters.fechaInicioCreacion) {
        where.fechaCreacion.gte = filters.fechaInicioCreacion;
      }
      
      if (filters.fechaFinCreacion) {
        where.fechaCreacion.lte = filters.fechaFinCreacion;
      }
    }

    if (filters?.fechaInspeccionInicio || filters?.fechaInspeccionFin) {
      where.fechaInspeccion = {};
      
      if (filters.fechaInspeccionInicio) {
        where.fechaInspeccion.gte = filters.fechaInspeccionInicio;
      }
      
      if (filters.fechaInspeccionFin) {
        where.fechaInspeccion.lte = filters.fechaInspeccionFin;
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';
    
    const orderBy = { [sortBy]: sortOrder };

    const totalCount = await this.prisma.datosForm.count({ where });
    
    const forms = await this.prisma.datosForm.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    return {
      data: forms,
      meta: {
        itemCount: forms.length,
        totalItems: totalCount,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }
  
  // Get form by id
  async getFormById(id: string) {
    // Validar que el id sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`El ID del formulario ${id} no es válido`);
    }

    try {
      const form = await this.prisma.datosForm.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
          imagenes: {
            select: {
              id: true,
              url: true,
              descripcion: true,
              createdAt: true
            },
          },
        },
      });

      if (!form) {
        throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
      }

      return form;
    } catch (error) {
      console.error(`Error al buscar formulario con ID ${id}:`, error);
      throw new NotFoundException(`No se pudo encontrar el formulario con ID ${id}`);
    }
  }
  
  // Get forms by userId
  async getFormsByUserId(userId: string) {
    // Validar que el userId sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new NotFoundException(`El ID de usuario proporcionado no es válido`);
    }

    try {
      return await this.prisma.datosForm.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
          imagenes: {
            select: {
              id: true,
              url: true,
              descripcion: true,
              createdAt: true
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error al obtener formularios del usuario:', error);
      throw new NotFoundException(`No se pudieron obtener los formularios para el usuario con ID ${userId}`);
    }
  }
  
  // Update form
  async updateForm(id: string, dto: UpdateDatosFormDto, userId: string) {
    // First verify the form exists
    const existingForm = await this.prisma.datosForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }

    // Update the form
    const updatedForm = await this.prisma.datosForm.update({
      where: { id },
      data: dto,
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'UPDATE',
      descripcion: `Actualización de formulario de inspección (ID: ${id})`,
      entidad: 'DatosForm',
      datosFormId: id,
    });

    return updatedForm;
  }
  
  // Delete form
  async deleteForm(id: string, userId: string) {
    // First verify the form exists
    const existingForm = await this.prisma.datosForm.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }

    // Use database cleanup service to safely remove related logs and data
    await this.databaseCleanupService.cleanupForm(id);

    // Delete the form
    await this.prisma.datosForm.delete({
      where: { id },
    });

    // Log the action
    await this.loggingService.createLog({
      userId,
      accion: 'DELETE',
      descripcion: `Eliminación de formulario de inspección (ID: ${id})`,
      entidad: 'DatosForm',
    });

    return { message: 'Formulario eliminado exitosamente' };
  }
}
