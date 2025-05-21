import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseCleanupService {
  constructor(private prisma: PrismaService) {}

  /**
   * Safely delete logs related to a specific entity
   * @param entityType The type of entity ('datosForm' or 'user')
   * @param entityId The ID of the entity
   */
  async deleteRelatedLogs(entityType: 'datosForm' | 'user', entityId: string): Promise<number> {
    if (!entityId) {
      return 0;
    }

    const where = entityType === 'datosForm' 
      ? { datosFormId: entityId }
      : { userId: entityId };

    const result = await this.prisma.log.deleteMany({
      where,
    });

    return result.count;
  }

  /**
   * Safely delete all data related to a form before deleting the form itself
   * @param formId The ID of the form to clean up
   */
  async cleanupForm(formId: string): Promise<void> {
    if (!formId) return;

    // Transaction to ensure all operations succeed or fail together
    await this.prisma.$transaction(async (tx) => {
      // 1. Delete related logs
      await tx.log.deleteMany({
        where: { datosFormId: formId },
      });

      // 2. Images are already set to cascade delete in the schema
      // No need to manually delete them
    });
  }

  /**
   * Safely delete all data related to a user before deleting the user
   * @param userId The ID of the user to clean up
   */
  async cleanupUser(userId: string): Promise<void> {
    if (!userId) return;

    // Transaction to ensure all operations succeed or fail together
    await this.prisma.$transaction(async (tx) => {
      // 1. Delete related logs
      await tx.log.deleteMany({
        where: { userId },
      });

      // 2. Check if there are forms created by this user that should be reassigned or deleted
      const userForms = await tx.datosForm.findMany({
        where: { userId },
        select: { id: true },
      });

      // 3. Delete logs for each form first
      for (const form of userForms) {
        await tx.log.deleteMany({
          where: { datosFormId: form.id },
        });
      }

      // 4. Now delete the forms (images will cascade delete)
      if (userForms.length > 0) {
        await tx.datosForm.deleteMany({
          where: { userId },
        });
      }
    });
  }
}
