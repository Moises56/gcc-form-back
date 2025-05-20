import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { DatosFormDashboardService } from '../services/datos-form-dashboard.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DatosFormDashboardService) {}

  @Roles('ADMIN', 'MODERADOR')
  @Get('stats')
  getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }
}
