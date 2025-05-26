# Endpoints para Actualizar Descripción de Imágenes

## ✅ Implementación Completada

Se han agregado los endpoints para actualizar las descripciones de imágenes existentes en ambos controladores:

### 1. Endpoint en `/api/datos-form/imagenes`

**URL:** `PUT /api/datos-form/imagenes/description/:imageId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Nueva descripción para la imagen"
}
```

**Respuesta:**
```json
{
  "id": "uuid-imagen",
  "url": "/uploads/imagen-1234567890.jpg",
  "descripcion": "Nueva descripción para la imagen",
  "datosFormId": "uuid-formulario",
  "createdAt": "2025-05-26T11:24:39.000Z"
}
```

### 2. Endpoint en `/api/uploads`

**URL:** `PUT /api/uploads/description/:imageId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: application/json
```

**Body:**
```json
{
  "descripcion": "Nueva descripción para la imagen"
}
```

**Respuesta:**
```json
{
  "id": "uuid-imagen",
  "url": "/uploads/imagen-1234567890.jpg", 
  "descripcion": "Nueva descripción para la imagen",
  "datosFormId": "uuid-formulario",
  "createdAt": "2025-05-26T11:24:39.000Z"
}
```

## Permisos Requeridos

Los siguientes roles pueden actualizar descripciones:
- `ADMIN`
- `MODERADOR` 
- `OPERADOR`

## Ejemplo de Uso con JavaScript/Fetch

```javascript
async function updateImageDescription(imageId, newDescription, token) {
  const response = await fetch(`/api/uploads/description/${imageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      descripcion: newDescription
    })
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar descripción: ${response.statusText}`);
  }

  return await response.json();
}
```

## Ejemplo de Uso con curl

```bash
curl -X PUT "http://localhost:3000/api/uploads/description/[IMAGE-ID]" \
  -H "Authorization: Bearer [JWT-TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"descripcion": "Nueva descripción actualizada"}'
```

## Validaciones

- La descripción es obligatoria y debe ser una cadena de texto no vacía
- El usuario debe estar autenticado
- El usuario debe tener los permisos necesarios
- La imagen debe existir en la base de datos

## Errores Posibles

- **400 Bad Request:** Descripción vacía o datos inválidos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Sin permisos suficientes
- **404 Not Found:** Imagen no encontrada

## Estado de la Solución

✅ **UPLOAD FIX:** Las descripciones ahora se guardan correctamente durante la subida de imágenes
✅ **EDIT FIX:** Las descripciones pueden ser editadas después de subir las imágenes
✅ **DUAL ENDPOINTS:** Disponible en ambas rutas (`/api/uploads` y `/api/datos-form/imagenes`)
✅ **LOGGING:** Se registra automáticamente un log de la acción
✅ **SERVER RUNNING:** Servidor funcionando en http://localhost:3000

## Próximos Pasos Recomendados

1. **Pruebas:** Realizar pruebas con diferentes roles de usuario
2. **Frontend:** Implementar la interfaz para editar descripciones
3. **Validaciones:** Añadir validación de longitud máxima si es necesario
4. **Documentación:** Actualizar la colección de Postman con los nuevos endpoints
