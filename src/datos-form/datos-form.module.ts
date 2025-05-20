import { Module, forwardRef } from '@nestjs/common';
import { DatosFormController } from './datos-form.controller';
import { DatosFormService } from './datos-form.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggingModule } from '../logging/logging.module';
import { UploadsModule } from '../uploads/uploads.module';
import { DatosFormImagenesController } from './controllers/datos-form-imagenes.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { DatosFormImagenesService } from './services/datos-form-imagenes.service';
import { DatosFormDashboardService } from './services/datos-form-dashboard.service';
import { DatosFormPaginationService } from './services/datos-form-pagination.service';
import { DatosFormExtendedService } from './datos-form-extended.service';

@Module({
  imports: [PrismaModule, LoggingModule, UploadsModule],
  controllers: [
    DatosFormController,
    DatosFormImagenesController,
    DashboardController
  ],
  providers: [
    DatosFormService,
    DatosFormImagenesService,
    DatosFormDashboardService,
    DatosFormPaginationService,
    DatosFormExtendedService
  ],
  exports: [
    DatosFormService,
    DatosFormImagenesService,
    DatosFormDashboardService,
    DatosFormExtendedService
  ],
})
export class DatosFormModule {}
