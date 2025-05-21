# Gestión de Relaciones en la Base de Datos

## Implementación actual

Este proyecto ha implementado un sistema robusto para gestionar las relaciones entre entidades en la base de datos, especialmente al eliminar registros que tienen relaciones con otras tablas.

### Servicio de limpieza de base de datos

Se ha creado un servicio especializado `DatabaseCleanupService` que implementa métodos para limpiar correctamente las relaciones antes de eliminar entidades:

```typescript
// src/common/services/database-cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatabaseCleanupService {
  constructor(private prisma: PrismaService) {}

  // Elimina de forma segura los logs relacionados con una entidad específica
  async deleteRelatedLogs(entityType: 'datosForm' | 'user', entityId: string): Promise<number> {
    // ...
  }

  // Limpia de forma segura todos los datos relacionados con un formulario antes de eliminarlo
  async cleanupForm(formId: string): Promise<void> {
    // ...
  }

  // Limpia de forma segura todos los datos relacionados con un usuario antes de eliminarlo
  async cleanupUser(userId: string): Promise<void> {
    // ...
  }
}
```

## Uso del servicio

Este servicio se utiliza en los controladores de `User` y `DatosForm` para asegurar que todas las relaciones se eliminan correctamente antes de eliminar la entidad principal:

```typescript
// Ejemplo de uso en DatosFormService
async deleteForm(id: string, userId: string) {
  // Verificar que el formulario existe
  const existingForm = await this.prisma.datosForm.findUnique({
    where: { id },
  });

  if (!existingForm) {
    throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
  }

  // Usar el servicio de limpieza para eliminar relaciones
  await this.databaseCleanupService.cleanupForm(id);

  // Eliminar el formulario
  await this.prisma.datosForm.delete({
    where: { id },
  });

  // Registrar la acción
  await this.loggingService.createLog({
    userId,
    accion: 'DELETE',
    descripcion: `Eliminación de formulario de inspección (ID: ${id})`,
    entidad: 'DatosForm',
  });

  return { message: 'Formulario eliminado exitosamente' };
}
```

## Mejores prácticas

Al trabajar con relaciones en la base de datos, sigue estas mejores prácticas:

1. **Usa transacciones cuando sea posible**: Esto asegura que todas las operaciones relacionadas se completen con éxito o fallen juntas.

2. **Considera la cascada a nivel de base de datos**: Para algunas relaciones, puede ser más eficiente configurar `onDelete: Cascade` en el esquema Prisma.

3. **Mantén un registro de auditoría**: El sistema actual mantiene logs de todas las operaciones, lo que es esencial para la trazabilidad.

4. **Verifica la existencia de registros antes de eliminarlos**: Esto evita errores innecesarios.

5. **Usa servicios especializados para operaciones complejas**: Como el `DatabaseCleanupService`, que centraliza la lógica de limpieza.

## Próximos pasos recomendados

1. **Implementar soft deletes**: En lugar de eliminar físicamente los registros, considera marcarlos como eliminados con un campo `isDeleted` o `deletedAt`.

2. **Añadir más transacciones**: Para asegurar la integridad de los datos en operaciones complejas.

3. **Mejorar la gestión de errores**: Añadir más validaciones y manejo de excepciones para casos específicos.

4. **Documentar el modelo de datos**: Mantener actualizada la documentación del esquema y las relaciones.

5. **Implementar pruebas de integración**: Para verificar que la limpieza y eliminación de datos funcionan correctamente en escenarios reales.
