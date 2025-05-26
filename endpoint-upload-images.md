# Endpoints para Subir Imágenes a Formularios

En el sistema GCC-Form existen dos formas de subir imágenes para un formulario (DatosForm), cada una con sus propios endpoints y características. Estas imágenes son utilizadas para documentar los permisos de construcción con evidencias visuales. A continuación se detallan ambas opciones:

## Opción 1: Usando el endpoint `/api/uploads`

### Subir una Imagen Individual

**Endpoint:** `POST /api/uploads/single/:formId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: multipart/form-data
```

**Parámetros URL:**
- `formId`: El ID UUID del formulario al que se asociará la imagen

**Request Body (form-data):**
```
file: [Archivo de imagen]
descripcion: [Descripción opcional de la imagen]
```

**Ejemplo de uso con curl:**
```bash
curl -X POST "https://api.example.com/api/uploads/single/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer [tu-token-jwt]" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/a/tu/imagen.jpg" \
  -F "descripcion=Fachada principal del edificio"
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3",
  "url": "/uploads/a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3.jpg",
  "descripcion": "Fachada principal del edificio",
  "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "createdAt": "2025-05-21T14:30:45.123Z"
}
```

### Subir Múltiples Imágenes

**Endpoint:** `POST /api/uploads/multiple/:formId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: multipart/form-data
```

**Parámetros URL:**
- `formId`: El ID UUID del formulario al que se asociarán las imágenes

**Request Body (form-data):**

**Opción A - Descripciones individuales (recomendado):**
```
files: [Archivo de imagen 1]
files: [Archivo de imagen 2]
files: [Archivo de imagen 3]
descripciones[0]: [Descripción específica para imagen 1]
descripciones[1]: [Descripción específica para imagen 2]
descripciones[2]: [Descripción específica para imagen 3]
```

**Opción B - Descripción general (todas las imágenes):**
```
files: [Archivo de imagen 1]
files: [Archivo de imagen 2]
...
descripcion: [Descripción que se aplicará a todas las imágenes]
```

**Opción C - Mixta (descripciones individuales + fallback):**
```
files: [Archivo de imagen 1]
files: [Archivo de imagen 2]
files: [Archivo de imagen 3]
descripciones[0]: [Descripción específica para imagen 1]
descripciones[2]: [Descripción específica para imagen 3]
descripcion: [Descripción fallback para imagen 2]
```

**Ejemplo de uso con curl (descripciones individuales):**
```bash
curl -X POST "https://api.example.com/api/uploads/multiple/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer [tu-token-jwt]" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/ruta/a/fachada.jpg" \
  -F "files=@/ruta/a/interior.jpg" \
  -F "files=@/ruta/a/planos.jpg" \
  -F "descripciones[0]=Fachada principal del edificio" \
  -F "descripciones[1]=Vista interior del salón principal" \
  -F "descripciones[2]=Planos arquitectónicos aprobados"
```

**Ejemplo de uso con curl (descripción general):**
```bash
curl -X POST "https://api.example.com/api/uploads/multiple/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer [tu-token-jwt]" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/ruta/a/imagen1.jpg" \
  -F "files=@/ruta/a/imagen2.jpg" \
  -F "descripcion=Imágenes del proceso de construcción"
```

**Respuesta Exitosa (200 OK):**

**Con descripciones individuales:**
```json
[
  {
    "id": "a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3",
    "url": "/uploads/a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3.jpg",
    "descripcion": "Fachada principal del edificio",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:45.123Z"
  },
  {
    "id": "b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7",
    "url": "/uploads/b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7.jpg",
    "descripcion": "Vista interior del salón principal",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:46.789Z"
  },
  {
    "id": "c2d1e0f9-a8b7-6543-h2g1-j0i9k8l7m6n5",
    "url": "/uploads/c2d1e0f9-a8b7-6543-h2g1-j0i9k8l7m6n5.jpg",
    "descripcion": "Planos arquitectónicos aprobados",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:47.456Z"
  }
]
```

**Con descripción general:**
```json
[
  {
    "id": "a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3",
    "url": "/uploads/a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3.jpg",
    "descripcion": "Imágenes del proceso de construcción",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:45.123Z"
  },
  {
    "id": "b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7",
    "url": "/uploads/b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7.jpg",
    "descripcion": "Imágenes del proceso de construcción",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:46.789Z"
  }
]
```

## Opción 2: Usando el endpoint `/api/datos-form/imagenes`

### Subir una Imagen Individual

**Endpoint:** `POST /api/datos-form/imagenes/:formId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: multipart/form-data
```

**Parámetros URL:**
- `formId`: El ID UUID del formulario al que se asociará la imagen

**Request Body (form-data):**
```
file: [Archivo de imagen]
```

**Ejemplo de uso con curl:**
```bash
curl -X POST "https://api.example.com/api/datos-form/imagenes/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer [tu-token-jwt]" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3",
  "url": "/uploads/a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3.jpg",
  "descripcion": "",
  "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "createdAt": "2025-05-21T14:30:45.123Z"
}
```

### Subir Múltiples Imágenes

**Endpoint:** `POST /api/datos-form/imagenes/multiple/:formId`

**Headers:**
```
Authorization: Bearer [jwt-token]
Content-Type: multipart/form-data
```

**Parámetros URL:**
- `formId`: El ID UUID del formulario al que se asociarán las imágenes

**Request Body (form-data):**
```
files: [Archivo de imagen 1]
files: [Archivo de imagen 2]
...
```

**Ejemplo de uso con curl:**
```bash
curl -X POST "https://api.example.com/api/datos-form/imagenes/multiple/f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -H "Authorization: Bearer [tu-token-jwt]" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/ruta/a/tu/imagen1.jpg" \
  -F "files=@/ruta/a/tu/imagen2.jpg"
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3",
    "url": "/uploads/a5b9c8d7-e6f5-4321-b0c9-d8e7f6a5b4c3.jpg",
    "descripcion": "",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:45.123Z"
  },
  {
    "id": "b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7",
    "url": "/uploads/b4c3d2e1-f0a9-8765-g4h3-i2j1k0l9m8n7.jpg",
    "descripcion": "",
    "datosFormId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "createdAt": "2025-05-21T14:30:46.789Z"
  }
]
```

## Notas Importantes

1. **Límite de imágenes**: Un formulario puede tener un máximo de 6 imágenes en total.

2. **Formatos de imagen aceptados**: Solo se aceptan archivos con extensiones `.jpg`, `.jpeg`, `.png` y `.gif`.

3. **Tamaño máximo**: El tamaño máximo permitido por imagen es de 5MB.

4. **Permisos**: Para subir imágenes, el usuario debe tener uno de los siguientes roles:
   - `ADMIN`
   - `MODERADOR`
   - `OPERADOR`

5. **Comportamiento predeterminado**: Las imágenes se crean con una descripción vacía que puede ser actualizada posteriormente.

## Errores comunes

- **400 Bad Request**: Si el formato de imagen es inválido, el tamaño excede el límite permitido, o si no se proporciona ningún archivo.

- **401 Unauthorized**: Si el usuario no está autenticado.

- **403 Forbidden**: Si el usuario no tiene los permisos necesarios.

- **404 Not Found**: Si el formulario con el ID especificado no existe.

- **409 Conflict**: Si el formulario ya tiene el máximo de 6 imágenes permitidas y se intenta añadir más.

## Ejemplo de Implementación en JavaScript/Fetch

```javascript
// Ejemplo para subir una imagen individual
async function uploadSingleImage(formId, imageFile, descripcion = '', token) {
  const formData = new FormData();
  formData.append('file', imageFile);
  if (descripcion) {
    formData.append('descripcion', descripcion);
  }

  const response = await fetch(`https://api.example.com/api/uploads/single/${formId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error al subir la imagen: ${response.statusText}`);
  }

  return await response.json();
}

// Ejemplo para subir múltiples imágenes
async function uploadMultipleImages(formId, imageFiles, descripcion = '', token) {
  const formData = new FormData();
  
  // Añadir múltiples archivos al mismo campo 'files'
  imageFiles.forEach(file => {
    formData.append('files', file);
  });
  
  // Añadir descripción si se proporciona
  if (descripcion) {
    formData.append('descripcion', descripcion);
  }

  const response = await fetch(`https://api.example.com/api/uploads/multiple/${formId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error al subir las imágenes: ${response.statusText}`);
  }

  return await response.json();
}
```

## Pruebas con Postman

Se ha incluido una colección completa de Postman (`GCC_Form_API.postman_collection.json`) con todos los endpoints para subir y gestionar imágenes. La colección incluye:

1. Scripts que capturan automáticamente el token JWT al iniciar sesión
2. Scripts que guardan automáticamente los IDs de formularios e imágenes para facilitar las pruebas
3. Ejemplos preconfigurados para cada endpoint

### Pasos para probar los endpoints de imágenes:

1. Importar la colección en Postman
2. Ejecutar la petición "Inicio de Sesión" en la carpeta "Autenticación"
3. Crear un nuevo formulario o utilizar uno existente
4. Usar los endpoints en las carpetas "Imágenes - DatosForm" o "Imágenes - Uploads"

## Consideraciones importantes

1. **Límites de tamaño**: El sistema tiene un límite de 5MB por archivo. Intente optimizar sus imágenes antes de subirlas.
2. **Formatos aceptados**: Solo se permiten archivos con extensiones jpg, jpeg, png, gif.
3. **Máximo de imágenes**: Cada formulario puede tener un máximo de 6 imágenes.
4. **Permisos**:
   - Los roles ADMIN y MODERADOR pueden subir y eliminar imágenes
   - El rol OPERADOR solo puede subir imágenes pero no eliminarlas
5. **Rendimiento**: Para formularios con muchas imágenes, preferir la carga individual para un mejor control y manejo de errores.

## Recomendaciones para Frontend

Al implementar la subida de imágenes en el frontend, considere:

1. Mostrar una previsualización de las imágenes antes de subirlas
2. Implementar una barra de progreso para archivos grandes
3. Validar el tamaño y formato de archivo antes de enviarlo al servidor
4. Manejar adecuadamente los errores y mostrar mensajes claros al usuario
5. Permitir la eliminación de imágenes con confirmación previa

## Integración con el Ciclo de Vida del Formulario

Las imágenes deben gestionarse correctamente durante todo el ciclo de vida del formulario:

1. **Creación**: Permitir al usuario subir imágenes después de crear el formulario básico
2. **Edición**: Ofrecer opciones para añadir, reemplazar o eliminar imágenes
3. **Visualización**: Mostrar miniaturas con opción de ver la imagen completa
4. **Impresión/PDF**: Incluir las imágenes relevantes en los informes generados
