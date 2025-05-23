import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DatosFormService } from './datos-form.service';
import { DatosFormExtendedService } from './datos-form-extended.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  CreateDatosFormDto,
  FilterDatosFormDto,
  UpdateDatosFormDto,
} from './dto/datos-form.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('datos-form')
export class DatosFormController {
  constructor(
    private datosFormService: DatosFormService,
    private extendedService: DatosFormExtendedService,
  ) {}

  @Post()
  createForm(@Body() dto: CreateDatosFormDto, @GetUser('id') userId: string) {
    return this.datosFormService.createForm(dto, userId);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get()
  getAllForms(@Query() filters: FilterDatosFormDto) {
    // Validation for date ranges
    if (filters.fechaInicioCreacion && filters.fechaFinCreacion) {
      if (
        new Date(filters.fechaInicioCreacion) >
        new Date(filters.fechaFinCreacion)
      ) {
        throw new BadRequestException(
          'La fecha inicial no puede ser posterior a la fecha final'
        );
      }
    }
    
    if (filters.fechaInspeccionInicio && filters.fechaInspeccionFin) {
      if (
        new Date(filters.fechaInspeccionInicio) >
        new Date(filters.fechaInspeccionFin)
      ) {
        throw new BadRequestException(
          'La fecha inicial de inspección no puede ser posterior a la fecha final'
        );
      }
    }
    
    return this.extendedService.getPaginatedForms(filters);
  }
  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get('my-forms')
  async getMyForms(@GetUser('id') userId: string) {
    try {
      // Validar que el userId sea un UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        throw new BadRequestException('El ID de usuario no es un UUID válido');
      }
      
      const forms = await this.datosFormService.getFormsByUserId(userId);
      
      // Verificar que se obtuvieron datos
      if (!forms || forms.length === 0) {
        // No es un error, simplemente no hay formularios
        return { 
          message: 'No se encontraron formularios para este usuario',
          data: [] 
        };
      }
      
      // Devolver los formularios con sus imágenes
      return {
        message: 'Formularios obtenidos correctamente',
        count: forms.length,
        data: forms
      };
    } catch (error) {
      console.error('Error al obtener formularios del usuario actual:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Si es un error de servidor, devolver un error 500
      if (!(error instanceof BadRequestException)) {
        throw new InternalServerErrorException(`Error interno al procesar la solicitud: ${error.message}`);
      }
      
      throw new BadRequestException(`Error al obtener los formularios: ${error.message}`);
    }
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get('user/:userId')
  getFormsByUser(@Param('userId') userId: string) {
    return this.datosFormService.getFormsByUserId(userId);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get(':id')
  getFormById(@Param('id') id: string) {
    return this.datosFormService.getFormById(id);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Put(':id')
  updateForm(
    @Param('id') id: string,
    @Body() dto: UpdateDatosFormDto,
    @GetUser('id') userId: string,
  ) {
    return this.datosFormService.updateForm(id, dto, userId);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Put(':id/estado/:estado')
  updateFormStatus(
    @Param('id') id: string,
    @Param('estado') estado: string,
    @GetUser('id') userId: string,
  ) {
    if (estado !== 'ACTIVO' && estado !== 'INACTIVO') {
      throw new BadRequestException(
        'Estado no válido. Los valores permitidos son ACTIVO o INACTIVO'
      );
    }
    return this.datosFormService.updateFormStatus(id, estado, userId);
  }

  @Roles('ADMIN', 'MODERADOR')
  @Delete(':id')
  deleteForm(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.datosFormService.deleteForm(id, userId);
  }
}
