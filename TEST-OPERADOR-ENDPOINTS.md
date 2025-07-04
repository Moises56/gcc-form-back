# Pruebas de los Nuevos Endpoints de Autogestión

## 🧪 Script de Pruebas para Endpoints de Autogestión

### Requisitos Previos
1. Servidor ejecutándose en puerto 3006
2. Usuario de prueba con rol OPERADOR
3. Token JWT válido

### 1. Obtener Token de Autenticación
```bash
# Login para obtener token
curl -X POST http://localhost:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "operador@test.com",
    "password": "password123"
  }'
```

### 2. Ver Perfil Actual
```bash
# Obtener información del perfil actual
curl -X GET http://localhost:3006/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Actualizar Perfil - Solo Nombre
```bash
# Actualizar solo el nombre completo
curl -X PATCH http://localhost:3006/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Operador Actualizado"
  }'
```

### 4. Actualizar Perfil - Múltiples Campos
```bash
# Actualizar nombre, teléfono y email
curl -X PATCH http://localhost:3006/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Operador Pérez",
    "phoneNumber": "+504 9999-8888",
    "email": "operador.nuevo@test.com"
  }'
```

### 5. Cambiar Contraseña
```bash
# Cambiar contraseña del usuario
curl -X PUT http://localhost:3006/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "nuevaPassword456"
  }'
```

### 6. Verificar Cambios
```bash
# Verificar que los cambios se aplicaron
curl -X GET http://localhost:3006/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Probar Login con Nueva Contraseña
```bash
# Login con la nueva contraseña
curl -X POST http://localhost:3006/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "operador.nuevo@test.com",
    "password": "nuevaPassword456"
  }'
```

## 🔍 Casos de Prueba de Validación

### Caso 1: Email Duplicado
```bash
# Intentar usar email que ya existe
curl -X PATCH http://localhost:3006/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com"
  }'
```
**Resultado Esperado**: Error 400 - Email ya en uso

### Caso 2: Contraseña Actual Incorrecta
```bash
# Intentar cambiar contraseña con contraseña actual incorrecta
curl -X PUT http://localhost:3006/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "contraseña_incorrecta",
    "newPassword": "nuevaPassword789"
  }'
```
**Resultado Esperado**: Error 400 - Contraseña actual incorrecta

### Caso 3: Nueva Contraseña Igual a la Actual
```bash
# Intentar cambiar contraseña por la misma contraseña
curl -X PUT http://localhost:3006/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "password123"
  }'
```
**Resultado Esperado**: Error 400 - Nueva contraseña debe ser diferente

### Caso 4: Contraseña Muy Corta
```bash
# Intentar usar contraseña muy corta
curl -X PUT http://localhost:3006/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "123"
  }'
```
**Resultado Esperado**: Error 400 - Contraseña debe tener mínimo 6 caracteres

### Caso 5: Sin Token de Autenticación
```bash
# Intentar actualizar perfil sin token
curl -X PATCH http://localhost:3006/api/auth/profile \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sin Autorización"
  }'
```
**Resultado Esperado**: Error 401 - Unauthorized

## 📋 Checklist de Verificación

### ✅ Funcionalidades Básicas
- [ ] Login genera token JWT válido
- [ ] GET /api/auth/me retorna información del usuario
- [ ] PATCH /api/auth/profile actualiza información correctamente
- [ ] PUT /api/auth/change-password cambia contraseña exitosamente
- [ ] Login funciona con nueva contraseña

### ✅ Validaciones de Seguridad
- [ ] Email duplicado es rechazado
- [ ] Contraseña actual incorrecta es rechazada
- [ ] Nueva contraseña igual a actual es rechazada
- [ ] Contraseña muy corta es rechazada
- [ ] Peticiones sin token son rechazadas

### ✅ Permisos de Roles
- [ ] ADMIN puede usar los endpoints
- [ ] MODERADOR puede usar los endpoints
- [ ] OPERADOR puede usar los endpoints
- [ ] Campos protegidos no pueden ser modificados

### ✅ Respuestas del API
- [ ] Respuestas exitosas incluyen datos actualizados
- [ ] Errores incluyen mensajes descriptivos
- [ ] Códigos de estado HTTP son correctos
- [ ] Estructura JSON es consistente

## 🎯 Resultados Esperados

### Actualización de Perfil Exitosa:
```json
{
  "id": "user-uuid",
  "fullName": "Juan Operador Pérez",
  "username": "operador",
  "phoneNumber": "+504 9999-8888",
  "email": "operador.nuevo@test.com",
  "role": "OPERADOR",
  "status": "ACTIVO",
  "createdAt": "2025-07-03T10:00:00.000Z",
  "updatedAt": "2025-07-03T15:30:00.000Z"
}
```

### Cambio de Contraseña Exitoso:
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

### Error de Validación:
```json
{
  "message": "El email operador.nuevo@test.com ya está en uso por otro usuario",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

**Nota**: Reemplaza `YOUR_TOKEN_HERE` con el token JWT real obtenido del login.
**Puerto**: Asegúrate de que el servidor esté ejecutándose en el puerto 3006.
**Base URL**: Ajusta la URL base según tu configuración.
