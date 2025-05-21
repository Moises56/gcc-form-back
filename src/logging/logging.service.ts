import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoggingService {
  constructor(private prisma: PrismaService) {}
  async createLog(data: {
    userId: string;
    accion: 'CREATE' | 'UPDATE' | 'DELETE';
    descripcion?: string;
    entidad: string;
    datosFormId?: string;
  }) {
    return this.prisma.log.create({
      data: {
        userId: data.userId,
        accion: data.accion,
        descripcion: data.descripcion,
        entidad: data.entidad,
        datosFormId: data.datosFormId,
      },
    });
  }
  async getLogs(filters?: {
    userId?: string;
    entidad?: string;
    accion?: 'CREATE' | 'UPDATE' | 'DELETE';
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: any = {};
    
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    
    if (filters?.entidad) {
      where.entidad = filters.entidad;
    }
    
    if (filters?.accion) {
      where.accion = filters.accion;
    }
    
    if (filters?.startDate || filters?.endDate) {
      where.fecha = {};
      
      if (filters?.startDate) {
        where.fecha.gte = filters.startDate;
      }
      
      if (filters?.endDate) {
        where.fecha.lte = filters.endDate;
      }
    }
    
    // Pagination settings
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = filters?.sortBy || 'fecha';
    const sortOrder = filters?.sortOrder || 'desc';
    const orderBy = { [sortBy]: sortOrder };
    
    // Get total count for pagination metadata
    const totalCount = await this.prisma.log.count({ where });
    
    // Get paginated data
    const logs = await this.prisma.log.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
          },
        },
        datosForm: filters?.entidad === 'DatosForm' ? {
          select: {
            id: true,
            numeroNota: true,
            propietario: true,
            direccionObra: true,
          },
        } : false,
      },
      orderBy,
      skip,
      take: limit,
    });
    
    // Return paginated response
    return {
      data: logs,
      meta: {
        itemCount: logs.length,
        totalItems: totalCount,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async getLogById(id: string) {
    return this.prisma.log.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
          },
        },
        datosForm: {
          select: {
            id: true,
            numeroNota: true,
            propietario: true,
            direccionObra: true,
          },
        },
      },
    });
  }
}
