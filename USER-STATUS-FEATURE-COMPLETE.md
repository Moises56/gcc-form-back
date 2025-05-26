# 📋 USER STATUS FEATURE - DOCUMENTATION

## 🎯 OBJETIVO
Agregar funcionalidad para activar/desactivar usuarios del sistema. Los usuarios inactivos no podrán ingresar al sistema.

---

## ✅ CAMBIOS IMPLEMENTADOS

### 1. **Schema de Base de Datos**
- **Archivo:** `prisma/schema.prisma`
- **Campo agregado:** `status String @default("ACTIVO") // ACTIVO, INACTIVO`
- **Migración:** `20250526194234_add_user_status_field`

### 2. **DTO Creado**
- **Archivo:** `src/user/dto/update-user-status.dto.ts`
- **Validación:** Solo acepta valores 'ACTIVO' o 'INACTIVO'

```typescript
export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['ACTIVO', 'INACTIVO'])
  status: string;
}
```

### 3. **Servicio de Usuario Actualizado**
- **Archivo:** `src/user/user.service.ts`
- **Métodos actualizados:**
  - `getAllUsers()` - Incluye campo status
  - `getUserById()` - Incluye campo status
  - `updateUser()` - Incluye campo status en respuesta
- **Método agregado:**
  - `updateUserStatus()` - Método específico para cambiar status

### 4. **Controlador de Usuario Actualizado**
- **Archivo:** `src/user/user.controller.ts`
- **Endpoint agregado:** `PUT /api/users/:id/status`
- **Permisos:** Solo ADMIN puede cambiar status

### 5. **Autenticación Actualizada**
- **Archivo:** `src/auth/auth.service.ts`
- **Validación en login:** Verifica que el usuario esté ACTIVO antes de permitir login
- **Mensaje de error:** "Su cuenta está inactiva. Contacte al administrador."

---

## 🚀 ENDPOINTS

### 📤 Actualizar Status de Usuario
```bash
PUT /api/users/:userId/status
Authorization: Bearer jwt-token
Content-Type: application/json

# Request Body
{
  "status": "INACTIVO"  // ACTIVO | INACTIVO
}

# Response (200)
{
  "id": "uuid-usuario",
  "fullName": "Nombre Usuario",
  "username": "usuario",
  "phoneNumber": "123456789",
  "employeeNumber": "EMP001",
  "email": "usuario@ejemplo.com",
  "role": "OPERADOR",
  "status": "INACTIVO",
  "createdAt": "2025-05-26T19:42:34.123Z",
  "updatedAt": "2025-05-26T19:42:34.123Z"
}
```

### 📋 Obtener Todos los Usuarios (con status)
```bash
GET /api/users
Authorization: Bearer jwt-token

# Response (200)
[
  {
    "id": "uuid-usuario",
    "fullName": "Nombre Usuario",
    "username": "usuario",
    "phoneNumber": "123456789",
    "employeeNumber": "EMP001",
    "email": "usuario@ejemplo.com",
    "role": "OPERADOR",
    "status": "ACTIVO",
    "createdAt": "2025-05-26T19:42:34.123Z",
    "updatedAt": "2025-05-26T19:42:34.123Z"
  }
]
```

### 👤 Obtener Usuario Actual (con status)
```bash
GET /api/auth/me
Authorization: Bearer jwt-token

# Response (200)
{
  "id": "uuid-usuario",
  "fullName": "Nombre Usuario",
  "username": "usuario",
  "phoneNumber": "123456789",
  "employeeNumber": "EMP001",
  "email": "usuario@ejemplo.com",
  "role": "ADMIN",
  "status": "ACTIVO",
  "createdAt": "2025-05-26T19:42:34.123Z",
  "updatedAt": "2025-05-26T19:42:34.123Z"
}
```

---

## 🔐 CONTROL DE ACCESO

### Status Validation en Login
```typescript
// En auth.service.ts -> login()
if (user.status !== 'ACTIVO') {
  throw new ForbiddenException('Su cuenta está inactiva. Contacte al administrador.');
}
```

### Permisos de Endpoints
- **Cambiar status:** Solo ADMIN
- **Ver usuarios:** ADMIN
- **Ver usuario específico:** ADMIN, MODERADOR

---

## 📊 COMPORTAMIENTO

### ✅ Usuario ACTIVO
- ✅ Puede hacer login
- ✅ Puede usar todas las funciones del sistema
- ✅ Sus datos aparecen en listados

### ❌ Usuario INACTIVO
- ❌ No puede hacer login
- ❌ Recibe mensaje: "Su cuenta está inactiva. Contacte al administrador."
- ✅ Sus datos siguen en base de datos (no se eliminan)
- ✅ ADMIN puede reactivar su cuenta

---

## 🔄 MIGRACIONES

### Database Migration Applied
```sql
-- Migration: 20250526194234_add_user_status_field
BEGIN TRANSACTION;

-- Add status column with default value
ALTER TABLE [User] ADD [status] NVARCHAR(1000) NOT NULL CONSTRAINT [User_status_df] DEFAULT 'ACTIVO';

COMMIT;
```

### Usuarios Existentes
- ✅ Todos los usuarios existentes automáticamente tienen status = 'ACTIVO'
- ✅ No requiere actualización manual

---

## ✅ TESTING

### Compilación
```bash
npm run build
# ✅ SUCCESS - No errors
```

### Migration Status
```bash
npx prisma migrate status
# ✅ SUCCESS - Database is up to date
```

---

## 📁 ARCHIVOS MODIFICADOS

1. `prisma/schema.prisma` - Agregado campo status
2. `src/user/dto/update-user-status.dto.ts` - DTO creado
3. `src/user/user.service.ts` - Métodos actualizados + nuevo método
4. `src/user/user.controller.ts` - Endpoint agregado
5. `src/auth/auth.service.ts` - Validación en login agregada

---

## 🎉 STATUS: FEATURE COMPLETE

**✅ FUNCIONALIDAD IMPLEMENTADA:**
- ✅ Campo status agregado al modelo User
- ✅ Migración aplicada exitosamente
- ✅ Validación en login implementada
- ✅ Endpoint para cambiar status creado
- ✅ Todos los métodos incluyen campo status
- ✅ Permisos de seguridad configurados
- ✅ Proyecto compila sin errores

**🚀 LISTO PARA USAR EN PRODUCCIÓN**
