import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingPaginationService } from './logging-pagination.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParseUUIDPipe } from '@nestjs/common';
import { LogFilterDto } from './dto/logging.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('logs')
export class LoggingController {
  constructor(
    private loggingService: LoggingService,
    private paginationService: LoggingPaginationService,
  ) {}  @Roles('ADMIN', 'MODERADOR')
  @Get()
  async getLogs(@Query() filters: LogFilterDto) {
    try {
      return await this.paginationService.getPaginatedLogs(filters);
    } catch (error) {
      console.error('Error in getLogs controller:', error);
      throw error;
    }
  }

  @Roles('ADMIN', 'MODERADOR')
  @Get(':id')
  getLogById(@Param('id', ParseUUIDPipe) id: string) {
    return this.loggingService.getLogById(id);
  }
}
