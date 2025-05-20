import { IsString, IsOptional, IsDate, IsIn, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../datos-form/dto/datos-form.dto';

export class LogFilterDto extends PaginationDto {
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
