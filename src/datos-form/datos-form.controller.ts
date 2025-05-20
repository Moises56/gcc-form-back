import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  }  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get()
  getAllForms(@Query() filters: FilterDatosFormDto) {
    // Validation for date ranges
    if (filters.fechaInicioCreacion && filters.fechaFinCreacion) {
      if (new Date(filters.fechaInicioCreacion) > new Date(filters.fechaFinCreacion)) {
        throw new BadRequestException('La fecha inicial no puede ser posterior a la fecha final');
      }
    }
    
    if (filters.fechaInspeccionInicio && filters.fechaInspeccionFin) {
      if (new Date(filters.fechaInspeccionInicio) > new Date(filters.fechaInspeccionFin)) {
        throw new BadRequestException('La fecha inicial de inspección no puede ser posterior a la fecha final');
      }
    }
    
    return this.extendedService.getPaginatedForms(filters);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get(':id')
  getFormById(@Param('id', ParseIntPipe) id: number) {
    return this.datosFormService.getFormById(id);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Put(':id')
  updateForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDatosFormDto,
    @GetUser('id') userId: string,
  ) {
    return this.datosFormService.updateForm(id, dto, userId);
  }

  @Roles('ADMIN', 'MODERADOR')
  @Delete(':id')
  deleteForm(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: string,
  ) {
    return this.datosFormService.deleteForm(id, userId);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get('user/:userId')
  getFormsByUser(@Param('userId') userId: string) {
    return this.datosFormService.getFormsByUserId(userId);
  }

  @Roles('ADMIN', 'MODERADOR', 'OPERADOR')
  @Get('my-forms')
  getMyForms(@GetUser('id') userId: string) {
    return this.datosFormService.getFormsByUserId(userId);
  }
}
