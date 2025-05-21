# Mejoras en la Colección de Postman para GCC Form API

## Resumen de cambios realizados

La colección de Postman ha sido actualizada para incluir todos los endpoints de la API, organizados de manera lógica y con scripts de prueba que facilitan su uso. A continuación se detallan las mejoras:

### 1. Organización de Endpoints

La colección ahora está organizada en las siguientes carpetas principales:

- **Autenticación**: Registro e inicio de sesión
- **Usuarios**: Gestión de usuarios (crear, listar, actualizar, eliminar)
- **Formularios**: Gestión de formularios DatosForm (crear, listar, actualizar, eliminar)
- **Imágenes - DatosForm**: Endpoints para la gestión de imágenes a través de `/api/datos-form/imagenes`
- **Imágenes - Uploads**: Endpoints para la gestión de imágenes a través de `/api/uploads`
- **Dashboard**: Endpoints para estadísticas y datos del tablero
- **Logs**: Visualización y gestión de logs del sistema

### 2. Scripts de prueba automáticos

Se han implementado scripts que automáticamente capturan variables importantes entre peticiones:

- **Token de autenticación**: Capturado automáticamente al iniciar sesión
- **ID de usuario**: Guardado para operaciones posteriores
- **ID de formulario**: Capturado al crear un nuevo formulario
- **ID de imagen**: Guardado cuando se sube una imagen (ya sea simple o múltiple)
- **ID de log**: Capturado al listar logs

Estos scripts facilitan encadenar peticiones sin tener que copiar y pegar manualmente los IDs.

### 3. Documentación integrada

Cada endpoint incluye:
- Descripción clara de su función
- Parámetros necesarios
- Ejemplos de uso
- Notas sobre permisos requeridos

### 4. Endpoints de imágenes

Se han incluido todos los endpoints para la gestión de imágenes:

#### Ruta `/api/datos-form/imagenes`:
- **GET /api/datos-form/imagenes/{formId}**: Obtener todas las imágenes de un formulario
- **POST /api/datos-form/imagenes/{formId}**: Subir una imagen individual para un formulario
- **POST /api/datos-form/imagenes/multiple/{formId}**: Subir múltiples imágenes para un formulario
- **DELETE /api/datos-form/imagenes/{imageId}**: Eliminar una imagen específica

#### Ruta `/api/uploads`:
- **POST /api/uploads/single/{formId}**: Subir una imagen individual mediante la API general de uploads
- **POST /api/uploads/multiple/{formId}**: Subir múltiples imágenes mediante la API general de uploads
- **DELETE /api/uploads/image/{imageId}**: Eliminar una imagen mediante la API general de uploads

### 5. Endpoints de logs

Se han corregido los endpoints de logs para utilizar el campo `fecha` en lugar de `createdAt`:

- **GET /api/logs**: Listar logs con paginación y ordenación correcta
- **GET /api/logs/{id}**: Obtener un log específico por ID

### 6. Variables de entorno

La colección utiliza las siguientes variables que se actualizan automáticamente:
- `{{token}}`: Token JWT de autenticación
- `{{userId}}`: ID del usuario autenticado
- `{{formId}}`: ID del formulario creado o seleccionado
- `{{imageId}}`: ID de una imagen subida
- `{{logId}}`: ID de un log del sistema

## Cómo usar la colección

1. Importar la colección en Postman
2. Crear un entorno en Postman (opcional pero recomendado)
3. Comenzar con la autenticación (registro o inicio de sesión)
4. Las siguientes peticiones ya tendrán acceso a las variables necesarias
5. Seguir el flujo lógico de operaciones: crear usuario → crear formulario → subir imágenes → etc.

## Nota sobre seguridad

Las peticiones que requieren autenticación utilizan automáticamente el token JWT capturado durante el inicio de sesión. Asegúrese de que el token sea válido antes de ejecutar estas peticiones.
