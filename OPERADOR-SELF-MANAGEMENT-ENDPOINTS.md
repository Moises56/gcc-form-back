# Nuevos Endpoints de Autogestión para Usuarios

## 📋 Resumen de Funcionalidades Implementadas

Se han agregado dos nuevos endpoints para permitir que **todos los usuarios autenticados** (incluyendo OPERADORES) puedan:

1. **Actualizar su propio perfil**
2. **Cambiar su propia contraseña**

## 🔧 Endpoints Implementados

### 1. **Actualizar Perfil Propio**
```http
PATCH /api/auth/profile
```

**Permisos**: Cualquier usuario autenticado (ADMIN, MODERADOR, OPERADOR)

**Headers Requeridos**:
```http
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**Cuerpo de la Petición**:
```json
{
  "fullName": "Juan Pérez Actualizado",
  "phoneNumber": "+504 9999-9999",
  "email": "nuevo.email@ejemplo.com"
}
```

**Campos Disponibles**:
- `fullName` (opcional): Nombre completo del usuario
- `phoneNumber` (opcional): Número de teléfono
- `email` (opcional): Correo electrónico

**Validaciones**:
- El email debe ser único (no puede estar en uso por otro usuario)
- Todos los campos son opcionales (se pueden enviar solo los que se desean cambiar)
- El email debe tener formato válido

**Respuesta Exitosa**:
```json
{
  "id": "user-uuid",
  "fullName": "Juan Pérez Actualizado",
  "username": "juanperez",
  "phoneNumber": "+504 9999-9999",
  "employeeNumber": "EMP001",
  "email": "nuevo.email@ejemplo.com",
  "role": "OPERADOR",
  "status": "ACTIVO",
  "createdAt": "2025-07-03T10:00:00.000Z",
  "updatedAt": "2025-07-03T15:30:00.000Z"
}
```

**Errores Posibles**:
- **400 Bad Request**: El email ya está en uso
- **401 Unauthorized**: Token inválido
- **403 Forbidden**: Usuario no encontrado

### 2. **Cambiar Contraseña Propia**
```http
PUT /api/auth/change-password
```

**Permisos**: Cualquier usuario autenticado (ADMIN, MODERADOR, OPERADOR)

**Headers Requeridos**:
```http
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**Cuerpo de la Petición**:
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña_segura"
}
```

**Campos Requeridos**:
- `currentPassword`: Contraseña actual del usuario
- `newPassword`: Nueva contraseña (mínimo 6 caracteres)

**Validaciones**:
- La contraseña actual debe ser correcta
- La nueva contraseña debe tener mínimo 6 caracteres
- La nueva contraseña debe ser diferente a la actual

**Respuesta Exitosa**:
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores Posibles**:
- **400 Bad Request**: Contraseña actual incorrecta o nueva contraseña igual a la actual
- **401 Unauthorized**: Token inválido
- **403 Forbidden**: Usuario no encontrado

## 📚 Ejemplos de Uso

### Ejemplo 1: Actualizar solo el nombre
```bash
curl -X PATCH \
  'http://localhost:3006/api/auth/profile' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "fullName": "Nuevo Nombre Completo"
  }'
```

### Ejemplo 2: Actualizar email y teléfono
```bash
curl -X PATCH \
  'http://localhost:3006/api/auth/profile' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "nuevo@email.com",
    "phoneNumber": "+504 8888-8888"
  }'
```

### Ejemplo 3: Cambiar contraseña
```bash
curl -X PUT \
  'http://localhost:3006/api/auth/change-password' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "currentPassword": "mi_contraseña_actual",
    "newPassword": "nueva_contraseña_segura"
  }'
```

## 🔒 Seguridad Implementada

### Validaciones de Seguridad
1. **Autenticación JWT**: Todos los endpoints requieren token válido
2. **Verificación de Usuario**: Se verifica que el usuario existe
3. **Validación de Contraseña**: Se verifica la contraseña actual antes de cambiarla
4. **Prevención de Duplicados**: Se evita que el email esté en uso por otro usuario
5. **Contraseña Hasheada**: Las contraseñas se almacenan con bcrypt

### Restricciones
- **Campos Protegidos**: Los usuarios NO pueden cambiar:
  - `role` (rol del usuario)
  - `status` (estado del usuario)
  - `username` (nombre de usuario)
  - `employeeNumber` (número de empleado)
  - `id` (identificador único)

## 📋 DTOs Implementados

### UpdateProfileDto
```typescript
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
```

### ChangePasswordDto
```typescript
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
```

## 🎯 Beneficios para Usuarios OPERADOR

### Antes de la Implementación:
❌ Dependían del ADMIN para cualquier cambio
❌ No podían actualizar su información personal
❌ No podían cambiar su contraseña

### Después de la Implementación:
✅ Pueden actualizar su información personal
✅ Pueden cambiar su contraseña cuando sea necesario
✅ Mayor autonomía y mejor experiencia de usuario
✅ Mantienen la seguridad del sistema

## 🔄 Flujo de Trabajo Mejorado

### Para Usuarios OPERADOR:
1. **Iniciar sesión** con sus credenciales
2. **Ver su perfil** con `GET /api/auth/me`
3. **Actualizar información** con `PATCH /api/auth/profile`
4. **Cambiar contraseña** con `PUT /api/auth/change-password`
5. **Continuar trabajando** con formularios e imágenes

### Para Usuarios ADMIN/MODERADOR:
- Mantienen todas sus funcionalidades anteriores
- También pueden usar los nuevos endpoints de autogestión
- Continúan gestionando otros usuarios según sus permisos

## 🚀 Implementación Técnica

### Archivos Modificados:
1. **`src/auth/dto/auth.dto.ts`**: Agregados DTOs para autogestión
2. **`src/auth/auth.service.ts`**: Implementados métodos de actualización
3. **`src/auth/auth.controller.ts`**: Agregados endpoints públicos

### Métodos Agregados:
- `updateProfile(userId, dto)`: Actualiza información del perfil
- `changePassword(userId, dto)`: Cambia la contraseña del usuario

### Validaciones Implementadas:
- Verificación de existencia del usuario
- Validación de contraseña actual
- Verificación de unicidad de email
- Validación de formato de datos

---

## 📝 Notas Importantes

1. **Compatibilidad**: Los endpoints existentes no se han modificado
2. **Seguridad**: Se mantienen todas las validaciones de seguridad
3. **Roles**: Los permisos de roles no se han modificado
4. **Auditoría**: Se recomienda agregar logging para estos cambios

**Fecha de Implementación**: 3 de Julio, 2025  
**Versión**: 1.1.0  
**Estado**: Implementado y Listo para Uso
