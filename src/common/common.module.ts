import { Module } from '@nestjs/common';
import { DatabaseCleanupService } from './services/database-cleanup.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DatabaseCleanupService],
  exports: [DatabaseCleanupService],
})
export class CommonModule {}
