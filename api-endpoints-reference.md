# Documentación Detallada de Endpoints GCC-Form API

## Convenciones de la API

- Base URL: `/api`
- Formato de respuesta: JSON
- Autenticación: JWT (Bearer Token)
- Códigos de estado HTTP estándar

## Autenticación

### Registro de Usuario
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "fullName": "Mou Grind",
  "username": "mougrind",
  "phoneNumber": "123456789",
  "employeeNumber": "EMP001",
  "email": "mougrind@amdc.hn",
  "password": "@Asd.456@",
  "role": "ADMIN"  // ADMIN, MODERADOR, OPERADOR
}
```

**Respuesta Exitosa (201):**
```json
{
	"id": "8c5c03e6-9263-4c59-93e8-a667a708a055",
	"fullName": "Mou Grind",
	"username": "mougrind",
	"phoneNumber": "123456789",
	"employeeNumber": "EMP001",
	"email": "mougrind@amdc.hn",
	"role": "ADMIN",
	"createdAt": "2025-05-21T17:56:14.628Z",
	"updatedAt": "2025-05-21T17:56:14.628Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Datos inválidos o incompletos
  ```json
  {
    "statusCode": 400,
    "message": ["fullName no debe estar vacío", "email debe ser un correo válido"],
    "error": "Bad Request"
  }
  ```
- **409 Conflict:** El usuario ya existe
  ```json
    {
        "message": "Credenciales ya están en uso",
        "error": "Forbidden",
        "statusCode": 403
    }
  ```

### Inicio de Sesión
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "usernameOrEmail": "mougrind",
    "password": "@Asd.456@"
}
```

**Respuesta Exitosa (200):**
```json
{
    "user": {
        "id": "8c5c03e6-9263-4c59-93e8-a667a708a055",
        "fullName": "Mou Grind",
        "username": "mougrind",
        "phoneNumber": "123456789",
        "employeeNumber": "EMP001",
        "email": "mougrind@amdc.hn",
        "role": "ADMIN",
        "createdAt": "2025-05-21T17:56:14.628Z",
        "updatedAt": "2025-05-21T17:56:14.628Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YzVjMDNlNi05MjYzLTRjNTktOTNlOC1hNjY3YTcwOGEwNTUiLCJ1c2VybmFtZSI6Im1vdWdyaW5kIiwiaWF0IjoxNzQ3ODUwMjMzLCJleHAiOjE3NDc5MzY2MzN9.Ow9EYJLkK1AUEzZHY8Th1OVwOokyAbJzTl4Agv7kgWk"
}
```

**Errores Posibles:**
- **401 Unauthorized:** Credenciales inválidas
  ```json
  {
    "message": "Credenciales incorrectas",
    "error": "Forbidden",
    "statusCode": 403
    }
  ```

### Cierre de Sesión
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado",
    "error": "Unauthorized"
  }
  ```

### Obtener Usuario Actual
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-usuario",
  "fullName": "Nombre Completo",
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "role": "USER",
  "createdAt": "2025-05-21T12:34:56.789Z",
  "updatedAt": "2025-05-21T12:34:56.789Z"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado",
    "error": "Unauthorized"
  }
  ```

## Usuarios

### Listar Usuarios
**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Resultados por página (por defecto: 10)
- `search`: Búsqueda por nombre o email

**Respuesta Exitosa (200):**
```json
{
  "data": [
    {
      "id": "uuid-usuario-1",
      "fullName": "Nombre Usuario 1",
      "username": "usuario1",
      "email": "usuario1@ejemplo.com",
      "role": "ADMIN",
      "createdAt": "2025-05-21T12:34:56.789Z"
    },
    {
      "id": "uuid-usuario-2",
      "fullName": "Nombre Usuario 2",
      "username": "usuario2",
      "email": "usuario2@ejemplo.com",
      "role": "USER",
      "createdAt": "2025-05-20T10:11:12.131Z"
    }
  ],
  "meta": {
    "itemCount": 2,
    "totalItems": 15,
    "itemsPerPage": 10,
    "totalPages": 2,
    "currentPage": 1
  }
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No tiene permisos (solo ADMIN)
  ```json
  {
    "statusCode": 403,
    "message": "Acceso prohibido",
    "error": "Forbidden"
  }
  ```

### Obtener Usuario por ID
**Endpoint:** `GET /api/users/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-usuario",
  "fullName": "Nombre Completo",
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "role": "USER",
  "createdAt": "2025-05-21T12:34:56.789Z",
  "updatedAt": "2025-05-21T12:34:56.789Z"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No tiene permisos (solo ADMIN o el mismo usuario)
- **404 Not Found:** Usuario no encontrado
  ```json
  {
    "statusCode": 404,
    "message": "Usuario con ID uuid-no-existente no encontrado",
    "error": "Not Found"
  }
  ```

### Actualizar Usuario
**Endpoint:** `PATCH /api/users/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request Body:**
```json
{
  "fullName": "Nuevo Nombre Completo",
  "email": "nuevo@ejemplo.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-usuario",
  "fullName": "Nuevo Nombre Completo",
  "username": "usuario",
  "email": "nuevo@ejemplo.com",
  "role": "USER",
  "updatedAt": "2025-05-21T14:22:33.444Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No tiene permisos (solo ADMIN o el mismo usuario)
- **404 Not Found:** Usuario no encontrado
- **409 Conflict:** Email ya en uso

### Eliminar Usuario
**Endpoint:** `DELETE /api/users/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No tiene permisos (solo ADMIN)
- **404 Not Found:** Usuario no encontrado

## Formularios de Inspección

### Crear Formulario
**Endpoint:** `POST /api/datos-form`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request Body:**
```json
{
  "numeroNota": "NOTA-123",
  "propietario": "Nombre del Propietario",
  "direccionObra": "Dirección de la Obra",
  "sectorCatastral": "Sector XYZ",
  "fechaInspeccion": "2025-05-20T10:00:00Z",
  "areaPrivada": true,
  "areaUsoPublico": false,
  "sinLicenciaConstruccion": true,
  "obraInseguraPeligrosa": false,
  "instalacionRotulosVallas": false,
  "construccionNoAutorizada": true,
  "observaciones": "Observaciones de la inspección realizada"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "uuid-formulario",
  "numeroNota": "NOTA-123",
  "propietario": "Nombre del Propietario",
  "direccionObra": "Dirección de la Obra",
  "sectorCatastral": "Sector XYZ",
  "fechaInspeccion": "2025-05-20T10:00:00Z",
  "areaPrivada": true,
  "areaUsoPublico": false,
  "sinLicenciaConstruccion": true,
  "obraInseguraPeligrosa": false,
  "instalacionRotulosVallas": false,
  "construccionNoAutorizada": true,
  "observaciones": "Observaciones de la inspección realizada",
  "userId": "uuid-usuario",
  "createdAt": "2025-05-21T12:34:56.789Z",
  "updatedAt": "2025-05-21T12:34:56.789Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Datos inválidos o incompletos
- **401 Unauthorized:** No autenticado

### Listar Formularios
**Endpoint:** `GET /api/datos-form`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Resultados por página (por defecto: 10)
- `numeroNota`: Filtrar por número de nota
- `propietario`: Filtrar por propietario
- `direccionObra`: Filtrar por dirección
- `sectorCatastral`: Filtrar por sector
- `fechaInicioCreacion`: Filtrar por fecha inicio de creación
- `fechaFinCreacion`: Filtrar por fecha fin de creación
- `fechaInspeccionInicio`: Filtrar por fecha inicio de inspección
- `fechaInspeccionFin`: Filtrar por fecha fin de inspección
- `userId`: Filtrar por usuario creador
- `areaPrivada`: Filtrar por área privada (true/false)
- `areaUsoPublico`: Filtrar por área de uso público (true/false)
- `sortBy`: Ordenar por campo
- `sortOrder`: Dirección de ordenamiento (asc/desc)

**Respuesta Exitosa (200):**
```json
{
  "data": [
    {
      "id": "uuid-formulario-1",
      "numeroNota": "NOTA-123",
      "propietario": "Propietario 1",
      "direccionObra": "Dirección 1",
      "sectorCatastral": "Sector A",
      "fechaInspeccion": "2025-05-20T10:00:00Z",
      "createdAt": "2025-05-21T12:34:56.789Z",
      "user": {
        "id": "uuid-usuario",
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    },
    {
      "id": "uuid-formulario-2",
      "numeroNota": "NOTA-456",
      "propietario": "Propietario 2",
      "direccionObra": "Dirección 2",
      "sectorCatastral": "Sector B",
      "fechaInspeccion": "2025-05-19T09:00:00Z",
      "createdAt": "2025-05-20T11:22:33.444Z",
      "user": {
        "id": "uuid-usuario",
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    }
  ],
  "meta": {
    "itemCount": 2,
    "totalItems": 25,
    "itemsPerPage": 10,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado

### Obtener Formulario por ID
**Endpoint:** `GET /api/datos-form/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-formulario",
  "numeroNota": "NOTA-123",
  "propietario": "Nombre del Propietario",
  "direccionObra": "Dirección de la Obra",
  "sectorCatastral": "Sector XYZ",
  "fechaInspeccion": "2025-05-20T10:00:00Z",
  "areaPrivada": true,
  "areaUsoPublico": false,
  "sinLicenciaConstruccion": true,
  "obraInseguraPeligrosa": false,
  "instalacionRotulosVallas": false,
  "construccionNoAutorizada": true,
  "observaciones": "Observaciones de la inspección realizada",
  "userId": "uuid-usuario",
  "createdAt": "2025-05-21T12:34:56.789Z",
  "updatedAt": "2025-05-21T12:34:56.789Z",
  "user": {
    "id": "uuid-usuario",
    "fullName": "Nombre Usuario",
    "username": "usuario"
  }
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **404 Not Found:** Formulario no encontrado
  ```json
  {
    "statusCode": 404,
    "message": "Formulario con ID uuid-no-existente no encontrado",
    "error": "Not Found"
  }
  ```

### Actualizar Formulario
**Endpoint:** `PUT /api/datos-form/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Request Body:**
```json
{
  "numeroNota": "NOTA-123-UPDATED",
  "propietario": "Nombre del Propietario Actualizado",
  "observaciones": "Observaciones actualizadas"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-formulario",
  "numeroNota": "NOTA-123-UPDATED",
  "propietario": "Nombre del Propietario Actualizado",
  "direccionObra": "Dirección de la Obra",
  "sectorCatastral": "Sector XYZ",
  "fechaInspeccion": "2025-05-20T10:00:00Z",
  "areaPrivada": true,
  "areaUsoPublico": false,
  "sinLicenciaConstruccion": true,
  "obraInseguraPeligrosa": false,
  "instalacionRotulosVallas": false,
  "construccionNoAutorizada": true,
  "observaciones": "Observaciones actualizadas",
  "userId": "uuid-usuario",
  "updatedAt": "2025-05-21T15:44:55.666Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador)
- **404 Not Found:** Formulario no encontrado

### Eliminar Formulario
**Endpoint:** `DELETE /api/datos-form/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Formulario eliminado exitosamente"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador)
- **404 Not Found:** Formulario no encontrado

### Obtener Formularios por Usuario
**Endpoint:** `GET /api/datos-form/user/:userId`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-formulario-1",
    "numeroNota": "NOTA-123",
    "propietario": "Propietario 1",
    "direccionObra": "Dirección 1",
    "sectorCatastral": "Sector A",
    "fechaInspeccion": "2025-05-20T10:00:00Z",
    "createdAt": "2025-05-21T12:34:56.789Z",
    "user": {
      "id": "uuid-usuario",
      "fullName": "Nombre Usuario",
      "username": "usuario"
    }
  },
  {
    "id": "uuid-formulario-2",
    "numeroNota": "NOTA-456",
    "propietario": "Propietario 2",
    "direccionObra": "Dirección 2",
    "sectorCatastral": "Sector B",
    "fechaInspeccion": "2025-05-19T09:00:00Z",
    "createdAt": "2025-05-20T11:22:33.444Z",
    "user": {
      "id": "uuid-usuario",
      "fullName": "Nombre Usuario",
      "username": "usuario"
    }
  }
]
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el usuario solicitado)

### Obtener Mis Formularios
**Endpoint:** `GET /api/datos-form/my-forms`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-formulario-1",
    "numeroNota": "NOTA-123",
    "propietario": "Propietario 1",
    "direccionObra": "Dirección 1",
    "sectorCatastral": "Sector A",
    "fechaInspeccion": "2025-05-20T10:00:00Z",
    "createdAt": "2025-05-21T12:34:56.789Z",
    "user": {
      "id": "uuid-usuario",
      "fullName": "Nombre Usuario",
      "username": "usuario"
    }
  },
  {
    "id": "uuid-formulario-2",
    "numeroNota": "NOTA-456",
    "propietario": "Propietario 2",
    "direccionObra": "Dirección 2",
    "sectorCatastral": "Sector B",
    "fechaInspeccion": "2025-05-19T09:00:00Z",
    "createdAt": "2025-05-20T11:22:33.444Z",
    "user": {
      "id": "uuid-usuario",
      "fullName": "Nombre Usuario",
      "username": "usuario"
    }
  }
]
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado

## Imágenes de Formularios

### Añadir Imagen a Formulario
**Endpoint:** `POST /api/datos-form/imagenes/:formId`

**Headers:**
```
Authorization: Bearer jwt-token
Content-Type: multipart/form-data
```

**Request Body:**
```
imagen: [Archivo de imagen]
descripcion: Descripción opcional de la imagen
```

**Respuesta Exitosa (201):**
```json
{
  "id": "uuid-imagen",
  "url": "/uploads/images/imagen-1234567890.jpg",
  "descripcion": "Descripción opcional de la imagen",
  "datosFormId": "uuid-formulario",
  "createdAt": "2025-05-21T12:34:56.789Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Formato de imagen inválido o falta archivo
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador del formulario)
- **404 Not Found:** Formulario no encontrado

### Añadir Múltiples Imágenes a Formulario
**Endpoint:** `POST /api/datos-form/imagenes/multiple/:formId`

**Headers:**
```
Authorization: Bearer jwt-token
Content-Type: multipart/form-data
```

**Request Body:**
```
imagenes: [Array de archivos de imagen]
```

**Respuesta Exitosa (201):**
```json
[
  {
    "id": "uuid-imagen-1",
    "url": "/uploads/images/imagen-1234567890.jpg",
    "descripcion": null,
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T12:34:56.789Z"
  },
  {
    "id": "uuid-imagen-2",
    "url": "/uploads/images/imagen-0987654321.jpg",
    "descripcion": null,
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T12:34:56.789Z"
  }
]
```

**Errores Posibles:**
- **400 Bad Request:** Formato de imagen inválido o faltan archivos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador del formulario)
- **404 Not Found:** Formulario no encontrado

### Obtener Imágenes de Formulario
**Endpoint:** `GET /api/datos-form/imagenes/:formId`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-imagen-1",
    "url": "/uploads/images/imagen-1234567890.jpg",
    "descripcion": "Descripción de imagen 1",
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T12:34:56.789Z"
  },
  {
    "id": "uuid-imagen-2",
    "url": "/uploads/images/imagen-0987654321.jpg",
    "descripcion": null,
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T11:22:33.444Z"
  }
]
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **404 Not Found:** Formulario no encontrado

### Eliminar Imagen
**Endpoint:** `DELETE /api/datos-form/imagenes/:imageId`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Imagen eliminada exitosamente"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador del formulario)
- **404 Not Found:** Imagen no encontrada

## Dashboard

### Obtener Estadísticas
**Endpoint:** `GET /api/dashboard/stats`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "totalForms": 125,
  "formsByMonth": [
    {
      "month": 1,
      "year": 2025,
      "count": 23
    },
    {
      "month": 2,
      "year": 2025,
      "count": 18
    },
    {
      "month": 3,
      "year": 2025,
      "count": 20
    },
    {
      "month": 4,
      "year": 2025,
      "count": 30
    },
    {
      "month": 5,
      "year": 2025,
      "count": 34
    }
  ],
  "formsByUser": [
    {
      "id": "uuid-usuario-1",
      "fullName": "Usuario 1",
      "username": "usuario1",
      "_count": {
        "datosForm": 45
      }
    },
    {
      "id": "uuid-usuario-2",
      "fullName": "Usuario 2",
      "username": "usuario2",
      "_count": {
        "datosForm": 32
      }
    }
  ],
  "formsBySector": [
    {
      "sectorCatastral": "Sector A",
      "_count": 42
    },
    {
      "sectorCatastral": "Sector B",
      "_count": 38
    },
    {
      "sectorCatastral": "Sector C",
      "_count": 25
    }
  ],
  "infractions": {
    "sinLicenciaConstruccion": 78,
    "obraInseguraPeligrosa": 43,
    "instalacionRotulosVallas": 29,
    "construccionNoAutorizada": 65
  },
  "formsWithImages": 98,
  "formsWithoutImages": 27,
  "recentActivity": [
    {
      "id": "uuid-log-1",
      "accion": "CREATE",
      "descripcion": "Creación de formulario de inspección (ID: uuid-formulario)",
      "entidad": "DatosForm",
      "fecha": "2025-05-21T12:34:56.789Z",
      "user": {
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    },
    {
      "id": "uuid-log-2",
      "accion": "UPDATE",
      "descripcion": "Actualización de formulario de inspección (ID: uuid-formulario)",
      "entidad": "DatosForm",
      "fecha": "2025-05-21T11:22:33.444Z",
      "user": {
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    }
  ]
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (solo ADMIN)

## Logs

### Listar Logs
**Endpoint:** `GET /api/logs`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Resultados por página (por defecto: 10)
- `userId`: Filtrar por usuario
- `accion`: Filtrar por acción (CREATE, UPDATE, DELETE)
- `entidad`: Filtrar por entidad (DatosForm, User, etc.)
- `fechaInicio`: Filtrar desde fecha
- `fechaFin`: Filtrar hasta fecha

**Respuesta Exitosa (200):**
```json
{
  "data": [
    {
      "id": "uuid-log-1",
      "userId": "uuid-usuario",
      "accion": "CREATE",
      "descripcion": "Creación de formulario de inspección (ID: uuid-formulario)",
      "entidad": "DatosForm",
      "datosFormId": "uuid-formulario",
      "fecha": "2025-05-21T12:34:56.789Z",
      "user": {
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    },
    {
      "id": "uuid-log-2",
      "userId": "uuid-usuario",
      "accion": "UPDATE",
      "descripcion": "Actualización de formulario de inspección (ID: uuid-formulario)",
      "entidad": "DatosForm",
      "datosFormId": "uuid-formulario",
      "fecha": "2025-05-21T11:22:33.444Z",
      "user": {
        "fullName": "Nombre Usuario",
        "username": "usuario"
      }
    }
  ],
  "meta": {
    "itemCount": 2,
    "totalItems": 250,
    "itemsPerPage": 10,
    "totalPages": 25,
    "currentPage": 1
  }
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (solo ADMIN)

### Obtener Log por ID
**Endpoint:** `GET /api/logs/:id`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-log",
  "userId": "uuid-usuario",
  "accion": "UPDATE",
  "descripcion": "Actualización de formulario de inspección (ID: uuid-formulario)",
  "entidad": "DatosForm",
  "datosFormId": "uuid-formulario",
  "fecha": "2025-05-21T12:34:56.789Z",
  "user": {
    "id": "uuid-usuario",
    "fullName": "Nombre Usuario",
    "username": "usuario",
    "email": "usuario@ejemplo.com"
  }
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (solo ADMIN)
- **404 Not Found:** Log no encontrado

## Uploads

### Subir Imagen Individual
**Endpoint:** `POST /api/uploads/single/:formId`

**Headers:**
```
Authorization: Bearer jwt-token
Content-Type: multipart/form-data
```

**Request Body:**
```
imagen: [Archivo de imagen]
descripcion: Descripción opcional de la imagen
```

**Respuesta Exitosa (201):**
```json
{
  "id": "uuid-imagen",
  "url": "/uploads/images/imagen-1234567890.jpg",
  "descripcion": "Descripción opcional de la imagen",
  "datosFormId": "uuid-formulario",
  "createdAt": "2025-05-21T12:34:56.789Z"
}
```

**Errores Posibles:**
- **400 Bad Request:** Formato de imagen inválido o falta archivo
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado
- **404 Not Found:** Formulario no encontrado

### Subir Múltiples Imágenes
**Endpoint:** `POST /api/uploads/multiple/:formId`

**Headers:**
```
Authorization: Bearer jwt-token
Content-Type: multipart/form-data
```

**Request Body:**
```
imagenes: [Array de archivos de imagen]
```

**Respuesta Exitosa (201):**
```json
[
  {
    "id": "uuid-imagen-1",
    "url": "/uploads/images/imagen-1234567890.jpg",
    "descripcion": null,
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T12:34:56.789Z"
  },
  {
    "id": "uuid-imagen-2",
    "url": "/uploads/images/imagen-0987654321.jpg",
    "descripcion": null,
    "datosFormId": "uuid-formulario",
    "createdAt": "2025-05-21T12:34:56.789Z"
  }
]
```

**Errores Posibles:**
- **400 Bad Request:** Formato de imagen inválido o faltan archivos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado
- **404 Not Found:** Formulario no encontrado

### Eliminar Imagen
**Endpoint:** `DELETE /api/uploads/image/:imageId`

**Headers:**
```
Authorization: Bearer jwt-token
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Imagen eliminada exitosamente"
}
```

**Errores Posibles:**
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (si no es ADMIN ni el creador del formulario)
- **404 Not Found:** Imagen no encontrada
