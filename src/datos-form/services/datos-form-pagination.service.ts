import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterDatosFormDto, PaginatedResponse } from '../dto/datos-form.dto';

@Injectable()
export class DatosFormPaginationService {
  constructor(private prisma: PrismaService) {}

  async getPaginatedForms(filters: FilterDatosFormDto): Promise<PaginatedResponse<any>> {
    const whereClause: any = {};

    // Apply text filters with contains
    if (filters.numeroNota) {
      whereClause.numeroNota = { contains: filters.numeroNota };
    }

    if (filters.propietario) {
      whereClause.propietario = { contains: filters.propietario };
    }

    if (filters.direccionObra) {
      whereClause.direccionObra = { contains: filters.direccionObra };
    }

    if (filters.sectorCatastral) {
      whereClause.sectorCatastral = { contains: filters.sectorCatastral };
    }

    // Apply exact match filters
    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.areaPrivada !== undefined) {
      whereClause.areaPrivada = filters.areaPrivada;
    }

    if (filters.areaUsoPublico !== undefined) {
      whereClause.areaUsoPublico = filters.areaUsoPublico;
    }

    // Apply date range filters
    if (filters.fechaInicioCreacion || filters.fechaFinCreacion) {
      whereClause.fechaCreacion = {};
      
      if (filters.fechaInicioCreacion) {
        whereClause.fechaCreacion.gte = new Date(filters.fechaInicioCreacion);
      }
      
      if (filters.fechaFinCreacion) {
        whereClause.fechaCreacion.lte = new Date(filters.fechaFinCreacion);
      }
    }

    if (filters.fechaInspeccionInicio || filters.fechaInspeccionFin) {
      whereClause.fechaInspeccion = {};
      
      if (filters.fechaInspeccionInicio) {
        whereClause.fechaInspeccion.gte = new Date(filters.fechaInspeccionInicio);
      }
      
      if (filters.fechaInspeccionFin) {
        whereClause.fechaInspeccion.lte = new Date(filters.fechaInspeccionFin);
      }
    }

    // Pagination settings
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Sorting settings (with default fallback)
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    const orderBy = { [sortBy]: sortOrder };

    try {
      // Get total count for pagination metadata
      const totalCount = await this.prisma.datosForm.count({ 
        where: whereClause 
      });
      
      // Get paginated data with relationships
      const forms = await this.prisma.datosForm.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
          imagenes: true,
        },
        orderBy,
        skip,
        take: limit,
      });
      
      // Return paginated response
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
    } catch (error) {
      console.error('Error fetching paginated forms:', error);
      throw new Error('Error al obtener los formularios con paginación');
    }
  }
}
