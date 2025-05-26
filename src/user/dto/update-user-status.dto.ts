import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['ACTIVO', 'INACTIVO'])
  status: string;
}
