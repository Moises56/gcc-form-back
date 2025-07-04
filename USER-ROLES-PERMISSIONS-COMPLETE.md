# Documentación Completa de Roles y Permisos del Sistema

## Resumen del Sistema de Roles

El sistema implementa un control de acceso basado en roles (RBAC) con tres niveles de permisos:

- **ADMIN**: Acceso completo a todas las funcionalidades del sistema
- **MODERADOR**: Acceso a la mayoría de funcionalidades excepto gestión de usuarios
- **OPERADOR**: Acceso limitado principalmente a operaciones de formularios e imágenes

## Implementación Técnica

### Guards y Decoradores
- **JwtGuard**: Verifica autenticación JWT
- **RolesGuard**: Verifica permisos de rol
- **@Roles()**: Decorador que especifica qué roles tienen acceso a cada endpoint

### Validación de Roles
```typescript
// Ejemplo de uso en controladores
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'MODERADOR', 'OPERADOR')
@Get()
getAllForms() { ... }
```

## Detalle de Permisos por Rol

### 🔴 ADMIN (Administrador)
**Permisos completos en todo el sistema**

#### Gestión de Usuarios (`/api/users`)
- ✅ **GET** `/users` - Listar todos los usuarios
- ✅ **GET** `/users/:id` - Ver detalles de un usuario
- ✅ **PATCH** `/users/:id` - Actualizar información de usuario
- ✅ **PUT** `/users/:id/status` - Cambiar estado de usuario (activo/inactivo)
- ✅ **DELETE** `/users/:id` - Eliminar usuario

#### Gestión de Formularios (`/api/datos-form`)
- ✅ **POST** `/datos-form` - Crear formulario
- ✅ **GET** `/datos-form` - Listar formularios con filtros
- ✅ **GET** `/datos-form/user/:userId` - Formularios por usuario
- ✅ **GET** `/datos-form/:id` - Ver formulario específico
- ✅ **PUT** `/datos-form/:id` - Actualizar formulario
- ✅ **PUT** `/datos-form/:id/estado/:estado` - Cambiar estado del formulario
- ✅ **DELETE** `/datos-form/:id` - Eliminar formulario

#### Gestión de Imágenes (`/api/uploads`)
- ✅ **POST** `/uploads/single/:formId` - Subir imagen individual
- ✅ **POST** `/uploads/multiple/:formId` - Subir múltiples imágenes
- ✅ **DELETE** `/uploads/image/:imageId` - Eliminar imagen
- ✅ **PUT** `/uploads/description/:imageId` - Actualizar descripción

#### Gestión de Imágenes de Formularios (`/api/datos-form-imagenes`)
- ✅ **POST** `/datos-form-imagenes/:formId/imagen` - Agregar imagen
- ✅ **GET** `/datos-form-imagenes/:formId/imagenes` - Listar imágenes
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId` - Actualizar imagen
- ✅ **DELETE** `/datos-form-imagenes/imagen/:imageId` - Eliminar imagen
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId/description` - Actualizar descripción

#### Logs y Auditoría (`/api/logs`)
- ✅ **GET** `/logs` - Ver logs del sistema con filtros
- ✅ **GET** `/logs/:id` - Ver log específico

#### Dashboard (`/api/dashboard`)
- ✅ **GET** `/dashboard/stats` - Estadísticas del sistema

---

### 🟡 MODERADOR (Moderador)
**Permisos amplios excepto gestión completa de usuarios**

#### Gestión de Usuarios (`/api/users`)
- ✅ **GET** `/users/:id` - Ver detalles de un usuario
- ❌ **GET** `/users` - Listar usuarios (solo ADMIN)
- ❌ **PATCH** `/users/:id` - Actualizar usuarios (solo ADMIN)
- ❌ **PUT** `/users/:id/status` - Cambiar estado (solo ADMIN)
- ❌ **DELETE** `/users/:id` - Eliminar usuarios (solo ADMIN)

#### Gestión de Formularios (`/api/datos-form`)
- ✅ **POST** `/datos-form` - Crear formulario
- ✅ **GET** `/datos-form` - Listar formularios con filtros
- ✅ **GET** `/datos-form/user/:userId` - Formularios por usuario
- ✅ **GET** `/datos-form/:id` - Ver formulario específico
- ✅ **PUT** `/datos-form/:id` - Actualizar formulario
- ✅ **PUT** `/datos-form/:id/estado/:estado` - Cambiar estado del formulario
- ✅ **DELETE** `/datos-form/:id` - Eliminar formulario

#### Gestión de Imágenes (`/api/uploads`)
- ✅ **POST** `/uploads/single/:formId` - Subir imagen individual
- ✅ **POST** `/uploads/multiple/:formId` - Subir múltiples imágenes
- ✅ **DELETE** `/uploads/image/:imageId` - Eliminar imagen
- ✅ **PUT** `/uploads/description/:imageId` - Actualizar descripción

#### Gestión de Imágenes de Formularios (`/api/datos-form-imagenes`)
- ✅ **POST** `/datos-form-imagenes/:formId/imagen` - Agregar imagen
- ✅ **GET** `/datos-form-imagenes/:formId/imagenes` - Listar imágenes
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId` - Actualizar imagen
- ✅ **DELETE** `/datos-form-imagenes/imagen/:imageId` - Eliminar imagen
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId/description` - Actualizar descripción

#### Logs y Auditoría (`/api/logs`)
- ✅ **GET** `/logs` - Ver logs del sistema con filtros
- ✅ **GET** `/logs/:id` - Ver log específico

#### Dashboard (`/api/dashboard`)
- ✅ **GET** `/dashboard/stats` - Estadísticas del sistema

---

### 🟢 OPERADOR (Operador)
**Permisos limitados principalmente a operaciones de formularios**

#### Gestión de Usuarios (`/api/users`)
- ❌ **Todos los endpoints** - Sin acceso a gestión de usuarios

#### Gestión de Formularios (`/api/datos-form`)
- ✅ **POST** `/datos-form` - Crear formulario
- ✅ **GET** `/datos-form` - Listar formularios con filtros
- ✅ **GET** `/datos-form/user/:userId` - Formularios por usuario
- ✅ **GET** `/datos-form/:id` - Ver formulario específico
- ✅ **PUT** `/datos-form/:id` - Actualizar formulario
- ✅ **PUT** `/datos-form/:id/estado/:estado` - Cambiar estado del formulario
- ❌ **DELETE** `/datos-form/:id` - Eliminar formulario (solo ADMIN/MODERADOR)

#### Gestión de Imágenes (`/api/uploads`)
- ✅ **POST** `/uploads/single/:formId` - Subir imagen individual
- ✅ **POST** `/uploads/multiple/:formId` - Subir múltiples imágenes
- ❌ **DELETE** `/uploads/image/:imageId` - Eliminar imagen (solo ADMIN/MODERADOR)
- ✅ **PUT** `/uploads/description/:imageId` - Actualizar descripción

#### Gestión de Imágenes de Formularios (`/api/datos-form-imagenes`)
- ✅ **POST** `/datos-form-imagenes/:formId/imagen` - Agregar imagen
- ✅ **GET** `/datos-form-imagenes/:formId/imagenes` - Listar imágenes
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId` - Actualizar imagen
- ❌ **DELETE** `/datos-form-imagenes/imagen/:imageId` - Eliminar imagen (solo ADMIN/MODERADOR)
- ✅ **PUT** `/datos-form-imagenes/imagen/:imageId/description` - Actualizar descripción

#### Logs y Auditoría (`/api/logs`)
- ❌ **Todos los endpoints** - Sin acceso a logs (solo ADMIN/MODERADOR)

#### Dashboard (`/api/dashboard`)
- ❌ **Todos los endpoints** - Sin acceso a dashboard (solo ADMIN/MODERADOR)

---

## Funcionalidades Especiales por Rol

### Limitaciones de Imágenes
- **Máximo 10 imágenes por formulario** (aplicable a todos los roles)
- **Tipos de archivo permitidos**: JPG, JPEG, PNG, GIF
- **Tamaño máximo**: Configurado en el servidor

### Estados de Formularios
- **ACTIVO**: Formulario visible y editable
- **INACTIVO**: Formulario oculto pero conservado

### Auditoría y Logs
- Todas las operaciones CRUD se registran en logs
- Los logs incluyen: usuario, acción, timestamp, datos modificados
- Solo ADMIN y MODERADOR pueden ver logs

### Validaciones de Seguridad
- Autenticación JWT obligatoria para todos los endpoints
- Verificación de permisos de rol en cada operación
- Validación de UUIDs para parámetros de ID
- Sanitización de datos de entrada

## Arquitectura de Seguridad

### Flujo de Autenticación
1. **Login**: Usuario proporciona credenciales
2. **JWT Token**: Sistema genera token con información del usuario y rol
3. **Verificación**: Cada request verifica token válido
4. **Autorización**: RolesGuard verifica permisos específicos

### Middlewares de Seguridad
- **JwtGuard**: Verifica token JWT válido
- **RolesGuard**: Verifica permisos de rol
- **ValidationPipe**: Valida DTOs y tipos de datos
- **ParseUUIDPipe**: Valida formato UUID en parámetros

### Manejo de Errores
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: Usuario sin permisos suficientes
- **400 Bad Request**: Datos inválidos o malformados
- **500 Internal Server Error**: Errores del servidor

## Casos de Uso Comunes

### Flujo de Trabajo ADMIN
1. Crear usuarios con roles específicos
2. Gestionar todos los formularios del sistema
3. Supervisar logs y auditoría
4. Acceder a estadísticas del dashboard
5. Eliminar contenido cuando sea necesario

### Flujo de Trabajo MODERADOR
1. Revisar y aprobar formularios
2. Gestionar contenido e imágenes
3. Supervisar actividad del sistema
4. Moderar contenido inapropiado
5. Acceder a estadísticas del dashboard

### Flujo de Trabajo OPERADOR
1. Crear y editar formularios
2. Subir y gestionar imágenes
3. Actualizar estado de formularios
4. Mantener descripción de imágenes actualizada

## Consideraciones de Implementación

### Configuración de Roles
Los roles se definen en el modelo de base de datos:
```sql
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERADOR', 'OPERADOR');
```

### Jerarquía de Permisos
- **ADMIN** > **MODERADOR** > **OPERADOR**
- Los permisos no son heredados automáticamente
- Cada endpoint especifica explícitamente qué roles tienen acceso

### Escalabilidad
- Nuevos roles pueden agregarse fácilmente
- Los permisos se pueden modificar cambiando los decoradores @Roles()
- El sistema es extensible para permisos granulares adicionales

---

*Documentación generada el: $(Get-Date)*
*Versión del API: 1.0.0*
*Sistema: GCC Form Management API*
