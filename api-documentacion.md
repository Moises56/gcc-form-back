# API de Formularios GCC - Documentación para Frontend Angular 19 con Tailwind

## Descripción General

Esta documentación proporciona la referencia completa de endpoints para la integración del frontend Angular 19 con la API de Formularios GCC.

## Índice

1. [Autenticación](#1-autenticación)
2. [Gestión de Usuarios](#2-gestión-de-usuarios)
3. [Gestión de Formularios](#3-gestión-de-formularios)
4. [Gestión de Imágenes](#4-gestión-de-imágenes)
5. [Dashboard](#5-dashboard)
6. [Gestión de Logs](#6-gestión-de-logs)
7. [Implementación en Angular 19](#7-implementación-en-angular-19-con-tailwind)

---

## 1. Autenticación

### Registro de Usuario
- **Endpoint**: `POST /api/auth/register`
- **Autorización**: No requerida
- **Cuerpo**:
```json
{
  "fullName": "Nombre Completo",
  "username": "nombre_usuario",
  "phoneNumber": "123456789",
  "employeeNumber": "EMP001",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "role": "ADMIN" // ADMIN, MODERADOR, OPERADOR
}
```
- **Respuesta**: Usuario creado y token JWT

### Inicio de Sesión
- **Endpoint**: `POST /api/auth/login`
- **Autorización**: No requerida
- **Cuerpo**:
```json
{
  "usernameOrEmail": "usuario@ejemplo.com", // o nombre_usuario
  "password": "contraseña123"
}
```
- **Respuesta**: Token JWT y datos del usuario

### Perfil del Usuario
- **Endpoint**: `GET /api/auth/me`
- **Autorización**: Bearer Token
- **Respuesta**: Datos del usuario autenticado

### Cerrar Sesión
- **Endpoint**: `POST /api/auth/logout`
- **Autorización**: Bearer Token
- **Respuesta**: Confirmación de cierre de sesión

---

## 2. Gestión de Usuarios

### Listar Usuarios
- **Endpoint**: `GET /api/users`
- **Autorización**: Bearer Token (ADMIN)
- **Respuesta**: Lista de usuarios

### Obtener Usuario por ID
- **Endpoint**: `GET /api/users/{userId}`
- **Autorización**: Bearer Token
- **Respuesta**: Detalles del usuario

### Actualizar Usuario
- **Endpoint**: `PATCH /api/users/{userId}`
- **Autorización**: Bearer Token
- **Cuerpo**:
```json
{
  "fullName": "Nombre Actualizado",
  "phoneNumber": "987654321",
  "email": "nuevo@ejemplo.com" // Opcional
}
```
- **Respuesta**: Usuario actualizado

### Eliminar Usuario
- **Endpoint**: `DELETE /api/users/{userId}`
- **Autorización**: Bearer Token (ADMIN)
- **Respuesta**: Confirmación de eliminación

---

## 3. Gestión de Formularios

### Crear Formulario
- **Endpoint**: `POST /api/datos-form`
- **Autorización**: Bearer Token
- **Cuerpo**:
```json
{
  "numeroNota": "NOTA-2025-001",
  "propietario": "Nombre del Propietario",
  "direccionObra": "Dirección Completa",
  "sectorCatastral": "Sector Norte A-5",
  "fechaInspeccion": "2025-05-21T10:00:00Z",
  
  "areaPrivada": true,
  "areaUsoPublico": false,
  
  "sinLicenciaConstruccion": true,
  "obraInseguraPeligrosa": false,
  "instalacionRotulosVallas": false,
  "construccionNoAutorizada": true,
  "construccionAreaPublica": false,
  "instalacionAntena": false,
  "cambioUsoNoAutorizado": false,
  "utilizaAreaPublicaMaterial": true,
  "instalacionPostes": false,
  "licenciaVencida": false,
  "roturaViaBordillo": false,
  "otroTipoInfraccion": "Descripción de otra infracción",
  
  "fechaCita": "2025-05-28T14:30:00Z",
  
  "usoSueloHabitacional": true,
  "usoSueloComercial": false,
  "usoSueloEquipamiento": false,
  "usoSueloServicios": false,
  "usoSueloProductivo": false,
  "usoSueloOtro": "Detalles adicionales de uso",
  
  "areaEstimada": 120.5,
  "niveles": 3,
  "sotanos": 1,
  "materiales": "Descripción de materiales",
  "faseObra": 75.5,
  "costoAproximado": 850000.00,
  
  "tipoRotuloValla": "Descripción de rótulos",
  "empresa": "Nombre de la empresa",
  "tipoRotura": "Descripción del tipo de rotura",
  "cantidadPostesAntenas": 2,
  "faseObraDescripcion": "Descripción del avance",
  "descripcionOtro": "Observaciones adicionales",
  
  "numeroExpediente": "EXP-2025-123",
  "numeroLicencia": "LIC-2025-456",
  "fechaAutorizacion": "2025-01-15T00:00:00Z",
  "fechaVencimiento": "2025-12-31T23:59:59Z",
  "observaciones": "Observaciones generales",
  
  "reciboNombreFirma": "Nombre de quien recibe"
}
```
- **Respuesta**: Formulario creado con ID

### Listar Formularios
- **Endpoint**: `GET /api/datos-form`
- **Autorización**: Bearer Token
- **Parámetros de consulta**:
  - `page`: Número de página (default: 1)
  - `limit`: Registros por página (default: 10)
  - `sortBy`: Campo de ordenación (default: createdAt)
  - `sortOrder`: Orden (asc/desc) (default: desc)
  - `numeroNota`: Filtrar por número de nota
  - `propietario`: Filtrar por propietario
  - `direccionObra`: Filtrar por dirección
  - `sectorCatastral`: Filtrar por sector
  - `userId`: Filtrar por usuario creador
  - `fechaInicioCreacion`: Fecha inicio para filtrar
  - `fechaFinCreacion`: Fecha fin para filtrar
- **Respuesta**: Lista paginada de formularios

### Mis Formularios
- **Endpoint**: `GET /api/datos-form/my-forms`
- **Autorización**: Bearer Token
- **Respuesta**: Formularios del usuario autenticado

### Formularios por Usuario
- **Endpoint**: `GET /api/datos-form/user/{userId}`
- **Autorización**: Bearer Token
- **Respuesta**: Formularios de un usuario específico

### Obtener Formulario por ID
- **Endpoint**: `GET /api/datos-form/{formId}`
- **Autorización**: Bearer Token
- **Respuesta**: Detalles completos del formulario

### Actualizar Formulario
- **Endpoint**: `PUT /api/datos-form/{formId}`
- **Autorización**: Bearer Token
- **Cuerpo**: Misma estructura que en la creación, con campos a actualizar
- **Respuesta**: Formulario actualizado

### Eliminar Formulario
- **Endpoint**: `DELETE /api/datos-form/{formId}`
- **Autorización**: Bearer Token (ADMIN, MODERADOR)
- **Respuesta**: Confirmación de eliminación

---

## 4. Gestión de Imágenes

### Subir Imagen Individual
- **Endpoint**: `POST /api/datos-form/imagenes/{formId}`
- **Autorización**: Bearer Token
- **Cuerpo**: FormData con clave `file` y archivo seleccionado
- **Respuesta**: Información de la imagen subida

### Subir Múltiples Imágenes
- **Endpoint**: `POST /api/datos-form/imagenes/multiple/{formId}`
- **Autorización**: Bearer Token
- **Cuerpo**: FormData con múltiples claves `files` y archivos seleccionados
- **Respuesta**: Array con información de las imágenes subidas

### Obtener Imágenes de un Formulario
- **Endpoint**: `GET /api/datos-form/imagenes/{formId}`
- **Autorización**: Bearer Token
- **Respuesta**: Lista de imágenes asociadas al formulario

### Eliminar Imagen
- **Endpoint**: `DELETE /api/datos-form/imagenes/{imageId}`
- **Autorización**: Bearer Token
- **Respuesta**: Confirmación de eliminación

---

## 5. Dashboard

### Obtener Estadísticas
- **Endpoint**: `GET /api/dashboard/stats`
- **Autorización**: Bearer Token
- **Respuesta**:
```json
{
  "totalForms": 150,
  "formsByMonth": [
    {"month": 1, "year": 2025, "count": 25},
    {"month": 2, "year": 2025, "count": 30}
  ],
  "formsByUser": [
    {"id": "uuid", "fullName": "Nombre", "username": "usuario", "_count": {"datosForm": 45}}
  ],
  "formsBySector": [
    {"sectorCatastral": "Sector Norte", "_count": {"id": 75}}
  ],
  "infractions": {
    "sinLicenciaConstruccion": 60,
    "obraInseguraPeligrosa": 25,
    "instalacionRotulosVallas": 15,
    "construccionNoAutorizada": 50
  },
  "formsWithImages": 120,
  "formsWithoutImages": 30,
  "recentActivity": [/* datos de actividad reciente */]
}
```

---

## 6. Gestión de Logs

### Listar Logs
- **Endpoint**: `GET /api/logs`
- **Autorización**: Bearer Token
- **Parámetros de consulta**:
  - `page`: Número de página (default: 1)
  - `limit`: Registros por página (default: 10)
  - `sortBy`: Campo de ordenación (default: fecha)
  - `sortOrder`: Orden (asc/desc) (default: desc)
  - `userId`: Filtrar por usuario
  - `entidad`: Filtrar por entidad afectada
  - `accion`: Filtrar por tipo de acción (CREATE, UPDATE, DELETE)
  - `startDate`: Fecha inicio para filtrar
  - `endDate`: Fecha fin para filtrar
- **Respuesta**: Lista paginada de logs

### Obtener Log por ID
- **Endpoint**: `GET /api/logs/{logId}`
- **Autorización**: Bearer Token
- **Respuesta**: Detalles del log

---

## 7. Implementación en Angular 19 con Tailwind

### Consideraciones de seguridad para JWT

- **No usar localStorage**: El token JWT viene en las cookies HTTP, por lo que no se debe almacenar manualmente en localStorage o sessionStorage.
- **Cookies HttpOnly**: La API configura el token como una cookie HttpOnly, lo cual es más seguro ya que previene acceso por JavaScript.
- **Interceptor HTTP**: Implementar un interceptor HTTP que gestione automáticamente el envío de cookies con cada petición.
- **Manejo de CSRF**: Asegurar que se manejan adecuadamente los tokens CSRF cuando sea necesario.

### Estructura recomendada de servicios

1. **Autenticación**: Implementar un servicio de autenticación con interceptores HTTP para manejar cookies JWT.

2. **Manejo de Formularios**: Usar ReactiveFormsModule para la validación y manipulación de formularios complejos.

3. **Carga de Imágenes**: Implementar una directiva para previsualización de imágenes antes de subir.

4. **Dashboard**: Utilizar bibliotecas compatibles con Angular como ngx-charts o Chart.js para visualizaciones.

5. **Permisos por Rol**: Implementar guards de ruta basados en roles (ADMIN, MODERADOR, OPERADOR).

6. **UI con Tailwind**: Aprovechar las utilidades de Tailwind para un diseño responsive y moderno.

7. **Paginación**: Implementar componentes reutilizables de paginación para las listas.

8. **Notificaciones**: Usar un servicio de notificaciones para mostrar resultados de operaciones CRUD.

---

## Errores comunes y soluciones

- **Orden de rutas en datos-form**: Las rutas específicas como `my-forms` deben ir antes que las rutas con parámetros como `:id`.
- **Manejo de errores**: Implementar una estrategia consistente para el manejo de errores HTTP.
- **Validaciones**: Realizar validaciones tanto en el cliente como en el servidor para garantizar integridad de datos.
- **Relaciones de tablas**: Tener en cuenta las relaciones de datos especialmente al eliminar registros.

---

*Documento creado para el equipo de frontend Angular 19 - Mayo 2025*
