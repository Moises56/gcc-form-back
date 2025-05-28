import { IsString, IsOptional, IsBoolean, IsDate, IsNumber, IsUUID, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDatosFormDto {
  @IsOptional()
  @IsString()
  numeroNota?: string;
  
  @IsOptional()
  @IsString()
  estado?: string;
  
  // userId will be set by the controller from the authenticated user
  @IsOptional()
  @IsUUID()
  userId?: string;

  // Información del propietario y obra
  @IsOptional()
  @IsString()
  propietario?: string;

  @IsOptional()
  @IsString()
  direccionObra?: string;

  @IsOptional()
  @IsString()
  sectorCatastral?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInspeccion?: Date;

  // Ubicación de los trabajos
  @IsOptional()
  @IsBoolean()
  areaPrivada?: boolean;

  @IsOptional()
  @IsBoolean()
  areaUsoPublico?: boolean;

  // Tipos de infracción
  @IsOptional()
  @IsBoolean()
  sinLicenciaConstruccion?: boolean;

  @IsOptional()
  @IsBoolean()
  obraInseguraPeligrosa?: boolean;

  @IsOptional()
  @IsBoolean()
  instalacionRotulosVallas?: boolean;

  @IsOptional()
  @IsBoolean()
  construccionNoAutorizada?: boolean;

  @IsOptional()
  @IsBoolean()
  construccionAreaPublica?: boolean;

  @IsOptional()
  @IsBoolean()
  instalacionAntena?: boolean;

  @IsOptional()
  @IsBoolean()
  cambioUsoNoAutorizado?: boolean;

  @IsOptional()
  @IsBoolean()
  utilizaAreaPublicaMaterial?: boolean;

  @IsOptional()
  @IsBoolean()
  instalacionPostes?: boolean;

  @IsOptional()
  @IsBoolean()
  licenciaVencida?: boolean;

  @IsOptional()
  @IsBoolean()
  roturaViaBordillo?: boolean;

  @IsOptional()
  @IsString()
  otroTipoInfraccion?: string;

  // Información adicional para la cita
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaCita?: Date;

  // Uso de suelo
  @IsOptional()
  @IsBoolean()
  usoSueloHabitacional?: boolean;

  @IsOptional()
  @IsBoolean()
  usoSueloComercial?: boolean;

  @IsOptional()
  @IsBoolean()
  usoSueloEquipamiento?: boolean;

  @IsOptional()
  @IsBoolean()
  usoSueloServicios?: boolean;

  @IsOptional()
  @IsBoolean()
  usoSueloProductivo?: boolean;

  @IsOptional()
  @IsString()
  usoSueloOtro?: string;

  // Tipo de obra
  @IsOptional()
  @IsNumber()
  areaEstimada?: number;

  @IsOptional()
  @IsNumber()
  niveles?: number;

  @IsOptional()
  @IsNumber()
  sotanos?: number;

  @IsOptional()
  @IsString()
  materiales?: string;

  @IsOptional()
  @IsNumber()
  faseObra?: number;  // Porcentaje de avance

  @IsOptional()
  @IsNumber()
  costoAproximado?: number;

  // Descripción
  @IsOptional()
  @IsString()
  tipoRotuloValla?: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsString()
  tipoRotura?: string;

  @IsOptional()
  @IsNumber()
  cantidadPostesAntenas?: number;

  @IsOptional()
  @IsString()
  faseObraDescripcion?: string;

  @IsOptional()
  @IsString()
  descripcionOtro?: string;

  // Control de campo
  @IsOptional()
  @IsString()
  numeroExpediente?: string;

  @IsOptional()
  @IsString()
  numeroLicencia?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaAutorizacion?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaVencimiento?: Date;

  @IsOptional()
  @IsString()
  observaciones?: string;
  // Información de recibo
  @IsOptional()
  @IsString()
  reciboNombreFirma?: string;
  // Información adicional del formulario
  // Coordenadas para marcar puntos en el mapa
  @IsOptional()
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @IsNumber()
  longitud?: number;

  @IsOptional()
  @IsString()
  antecedente1?: string;

  @IsOptional()
  @IsString()
  antecedente2?: string;

  @IsOptional()
  @IsString()
  antecedente3?: string;

  @IsOptional()
  @IsString()
  Articulo1?: string;
  
  // Nuevos campos adicionales
  @IsOptional()
  @IsString()
  materialesConstruccion?: string;

  @IsOptional()
  @IsString()
  subtitulo?: string;
}

export class UpdateDatosFormDto extends PartialType(CreateDatosFormDto) {}

// DTO for creating an image
export class CreateImagenDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}

// DTO for updating image description
export class UpdateImagenDescriptionDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

// Pagination metadata response
export class PaginationMeta {
  @IsNumber()
  itemCount: number;

  @IsNumber()
  totalItems: number;

  @IsNumber()
  itemsPerPage: number;

  @IsNumber()
  totalPages: number;

  @IsNumber()
  currentPage: number;
}

// Pagination response wrapper
export class PaginatedResponse<T> {
  data: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class FilterDatosFormDto extends PaginationDto {
  @IsOptional()
  @IsString()
  numeroNota?: string;

  @IsOptional()
  @IsString()
  propietario?: string;

  @IsOptional()
  @IsString()
  direccionObra?: string;

  @IsOptional()
  @IsString()
  sectorCatastral?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
  
  @IsOptional()
  @IsBoolean()
  areaPrivada?: boolean;
  
  @IsOptional()
  @IsBoolean()
  areaUsoPublico?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInicioCreacion?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFinCreacion?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInspeccionInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInspeccionFin?: Date;
}

export class UpdateFormStatusDto {
  @IsString()
  estado: string;
}
