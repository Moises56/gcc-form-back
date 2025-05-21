import { IsString, IsOptional, IsDate, IsIn, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../datos-form/dto/datos-form.dto';

// Override the PaginationDto for Logs to use 'fecha' as default sortBy
export class LogPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  sortBy?: string = 'fecha'; // Override default 'createdAt' to use 'fecha'
}

export class LogFilterDto extends LogPaginationDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  entidad?: string;

  @IsOptional()
  @IsIn(['CREATE', 'UPDATE', 'DELETE'])
  accion?: 'CREATE' | 'UPDATE' | 'DELETE';

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
