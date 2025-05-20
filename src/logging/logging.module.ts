import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggingPaginationService } from './logging-pagination.service';

@Module({
  imports: [PrismaModule],
  providers: [LoggingService, LoggingPaginationService],
  controllers: [LoggingController],
  exports: [LoggingService, LoggingPaginationService]
})
export class LoggingModule {}
