import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogFilterDto } from './dto/logging.dto';
import { PaginatedResponse } from '../datos-form/dto/datos-form.dto';

@Injectable()
export class LoggingPaginationService {
  constructor(private prisma: PrismaService) {}

  async getPaginatedLogs(
    filters: LogFilterDto,
  ): Promise<PaginatedResponse<any>> {
    const whereClause: any = {};

    // Apply filters
    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.entidad) {
      whereClause.entidad = filters.entidad;
    }

    if (filters.accion) {
      whereClause.accion = filters.accion;
    }    // Apply date range filter
    if (filters.startDate || filters.endDate) {
      whereClause.fecha = {};

      if (filters.startDate) {
        whereClause.fecha.gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        whereClause.fecha.lte = new Date(filters.endDate);
      }
    }
    
    // Pagination settings
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Sorting settings
    // Override the default sortBy if it's 'createdAt' since Log model uses 'fecha'
    let sortBy = filters.sortBy || 'fecha';
    if (sortBy === 'createdAt') {
      sortBy = 'fecha';
    }
    const sortOrder = filters.sortOrder || 'desc';
    const orderBy = { [sortBy]: sortOrder };

    try {
      // Get total count for pagination metadata
      const totalCount = await this.prisma.log.count({
        where: whereClause,
      });      // Get paginated logs with relationships
      const logs = await this.prisma.log.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              role: true,
            },
          },
          datosForm:
            filters.entidad === 'DatosForm'
              ? {
                  select: {
                    id: true,
                    numeroNota: true,
                    propietario: true,
                    direccionObra: true,
                  },
                }
              : false,
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
    } catch (error) {
      console.error('Error fetching paginated logs:', error);
      console.error('Query parameters:', { 
        whereClause, 
        orderBy, 
        skip, 
        limit,
        sortBy,
        filters
      });
      throw new Error(`Error al obtener los logs con paginación: ${error.message}`);
    }
  }
}
