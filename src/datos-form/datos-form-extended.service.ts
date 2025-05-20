import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDatosFormDto } from './dto/datos-form.dto';
import { DatosFormPaginationService } from './services/datos-form-pagination.service';

@Injectable()
export class DatosFormExtendedService {
  private paginationService: DatosFormPaginationService;
  
  constructor(private prisma: PrismaService) {
    this.paginationService = new DatosFormPaginationService(this.prisma);
  }

  // Method to get paginated forms
  async getPaginatedForms(filters: FilterDatosFormDto) {
    return this.paginationService.getPaginatedForms(filters);
  }
}
