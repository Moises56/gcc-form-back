# Corrección de Error UUID en Endpoint `my-forms`

## Problema Detectado

Al consumir el endpoint `http://localhost:3000/api/datos-form/my-forms` se estaba produciendo el siguiente error:

```
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

En la consola del servidor se mostraba el siguiente detalle:

```
ERROR [ExceptionsHandler] PrismaClientKnownRequestError: 
Invalid `this.prisma.datosForm.findUnique()` invocation in
C:\Users\GIS-MOISES\Desktop\WEBAPPS\EU\gcc-form\gcc-form-back\src\datos-form\datos-form.service.ts:134:46 

  131 }
  132 // Get form by id
  133 async getFormById(id: string) {
→ 134   const form = await this.prisma.datosForm.findUnique(
Inconsistent column data: Conversion failed: Conversion failed when converting from a character string to uniqueidentifier.
```

## Causa del Problema

El error ocurría debido a que:

1. Durante la migración de IDs numéricos a UUIDs, no se implementó una validación adecuada para garantizar que los UUIDs fueran válidos antes de enviarlos a Prisma.
2. SQL Server estaba intentando convertir una cadena de texto (que no tenía formato de UUID válido) a un tipo `uniqueidentifier`.
3. El endpoint `my-forms` estaba intentando utilizar el ID del usuario obtenido del token JWT para consultar los formularios asociados.

## Solución Implementada

Se realizaron las siguientes modificaciones:

1. **En el controlador `datos-form.controller.ts`**:
   - Se agregó una validación de UUID en el método `getMyForms` para verificar que el ID del usuario tenga el formato correcto antes de enviarlo al servicio.
   - Se implementó un manejo de errores más robusto con bloques try/catch.
   - Se agregar mensajes de error más descriptivos.

2. **En el servicio `datos-form.service.ts`**:
   - Se añadió validación de formato UUID en el método `getFormById` para evitar que IDs inválidos lleguen hasta la consulta de Prisma.
   - Se mejoró el manejo de errores con bloques try/catch.
   - Se agregaron mensajes de error más descriptivos y logging para facilitar la depuración.

## Implementación Técnica

### En el controlador:
```typescript
@Roles('ADMIN', 'MODERADOR', 'OPERADOR')
@Get('my-forms')
async getMyForms(@GetUser('id') userId: string) {
  try {
    // Validar que el userId sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new BadRequestException('El ID de usuario no es un UUID válido');
    }
    
    return await this.datosFormService.getFormsByUserId(userId);
  } catch (error) {
    console.error('Error al obtener formularios del usuario actual:', error);
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException(`Error al obtener los formularios: ${error.message}`);
  }
}
```

### En el servicio:
```typescript
// Get form by id
async getFormById(id: string) {
  // Validar que el id sea un UUID válido
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new NotFoundException(`El ID del formulario ${id} no es válido`);
  }

  try {
    const form = await this.prisma.datosForm.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
    }

    return form;
  } catch (error) {
    console.error(`Error al buscar formulario con ID ${id}:`, error);
    throw new NotFoundException(`No se pudo encontrar el formulario con ID ${id}`);
  }
}
```

## Beneficios de la Solución

1. **Prevención de errores**: Se evita que lleguen UUIDs inválidos a la capa de base de datos.
2. **Mejor experiencia de usuario**: En lugar de mostrar un error 500 genérico, se proporciona información más precisa sobre el problema.
3. **Facilidad de depuración**: El logging adicional permite identificar rápidamente la causa de los errores.
4. **Robustez**: El sistema ahora puede manejar correctamente casos de error en lugar de fallar completamente.

## Notas Adicionales

Esta solución es parte de la migración de IDs numéricos a UUIDs. Se recomienda aplicar validaciones similares en todos los endpoints que manejen IDs para evitar errores similares en el futuro.
