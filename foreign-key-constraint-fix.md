# Solución a Errores de Restricción de Clave Foránea en Eliminación

## Problema

Al intentar eliminar registros de las tablas `User` o `DatosForm`, se producían errores de restricción de clave foránea debido a que estos registros estaban referenciados en la tabla `Log`:

```
Foreign key constraint violated on the constraint: `Log_datosFormId_fkey`
Foreign key constraint violated on the constraint: `Log_userId_fkey`
```

Este problema ocurría porque en el esquema de Prisma, las relaciones entre `Log` y las entidades `User` y `DatosForm` están configuradas con `onDelete: NoAction`, lo que impide eliminar un registro referenciado.

## Causa

En el archivo `schema.prisma`, las relaciones están configuradas de la siguiente manera:

```prisma
model Log {
  // ...
  userId String @db.UniqueIdentifier
  user   User   @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction)

  datosFormId String?    @db.UniqueIdentifier
  datosForm   DatosForm? @relation(fields: [datosFormId], references: [id], onDelete: NoAction, onUpdate: NoAction)
}
```

La opción `onDelete: NoAction` significa que Prisma/SQL Server no permitirá la eliminación de un registro de `User` o `DatosForm` si existen registros en `Log` que los referencian.

## Solución

La solución implementada consiste en modificar los métodos de eliminación para que primero eliminen los registros de `Log` relacionados antes de intentar eliminar el registro principal.

### 1. En `DatosFormService` (`src/datos-form/datos-form.service.ts`):

```typescript
async deleteForm(id: string, userId: string) {
  // First verify the form exists
  const existingForm = await this.prisma.datosForm.findUnique({
    where: { id },
  });

  if (!existingForm) {
    throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
  }

  // First delete related logs to avoid foreign key constraint errors
  await this.prisma.log.deleteMany({
    where: { datosFormId: id },
  });

  // Delete the form
  await this.prisma.datosForm.delete({
    where: { id },
  });

  // Log the action
  await this.loggingService.createLog({
    userId,
    accion: 'DELETE',
    descripcion: `Eliminación de formulario de inspección (ID: ${id})`,
    entidad: 'DatosForm',
  });

  return { message: 'Formulario eliminado exitosamente' };
}
```

### 2. En `UserService` (`src/user/user.service.ts`):

```typescript
async deleteUser(id: string) {
  // First delete related logs to avoid foreign key constraint errors
  await this.prisma.log.deleteMany({
    where: { userId: id },
  });
  
  await this.prisma.user.delete({
    where: {
      id,
    },
  });
  
  return { message: 'Usuario eliminado exitosamente' };
}
```

## Alternativas Consideradas

Otras soluciones posibles incluyen:

1. **Modificar el esquema de Prisma**: Cambiar `onDelete: NoAction` a `onDelete: Cascade` en las relaciones, lo que eliminaría automáticamente los registros relacionados. Sin embargo, esto podría no ser deseable si queremos mantener los logs para auditoría incluso después de eliminar usuarios o formularios.

2. **Usar transacciones**: Envolver la eliminación de logs y la eliminación principal en una transacción para garantizar la consistencia de los datos.

3. **Implementar soft deletes**: En lugar de eliminar físicamente los registros, marcarlos como eliminados con un campo como `isDeleted` o `deletedAt`.

## Recomendaciones para futuros cambios

1. Considerar implementar un sistema de eliminación en cascada en la base de datos para simplificar el manejo de relaciones.

2. Implementar un sistema de auditoría más robusto que pueda mantener los registros históricos incluso después de eliminar entidades.

3. Añadir validaciones en el frontend para evitar la eliminación de registros críticos o mostrar advertencias apropiadas.
