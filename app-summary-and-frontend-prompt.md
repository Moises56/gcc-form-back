# Resumen de la Aplicación GCC-Form


## Descripción General
GCC-Form es una aplicación de inspección y gestión de formularios para obras de construcción. Permite a los usuarios registrar datos de inspecciones, cargar imágenes, administrar permisos y generar estadísticas sobre las inspecciones realizadas. La aplicación gestiona información sobre propietarios, direcciones de obra, sectores catastrales y tipos de infracciones.

## Componentes Principales

### 1. Sistema de Autenticación
- Registro y login de usuarios
- Control de acceso basado en roles
- Protección de rutas con JWT

### 2. Gestión de Formularios de Inspección
- Creación, lectura, actualización y eliminación de formularios
- Filtrado y búsqueda avanzada
- Paginación de resultados

### 3. Gestión de Imágenes
- Carga de imágenes individuales y múltiples
- Asociación de imágenes a formularios específicos
- Eliminación de imágenes

### 4. Dashboard y Estadísticas
- Resumen de formularios por mes
- Estadísticas por usuario
- Análisis de sectores y tipos de infracciones

### 5. Sistema de Logs
- Registro de todas las acciones realizadas
- Auditoría de cambios

## Endpoints Principales

### Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registro de nuevo usuario
- `POST /api/auth/login`: Inicio de sesión
- `POST /api/auth/logout`: Cierre de sesión
- `GET /api/auth/me`: Información del usuario autenticado

### Usuarios (`/api/users`)
- `GET /api/users`: Listar todos los usuarios
- `GET /api/users/:id`: Obtener un usuario específico
- `PATCH /api/users/:id`: Actualizar usuario
- `DELETE /api/users/:id`: Eliminar usuario

### Formularios de Inspección (`/api/datos-form`)
- `POST /api/datos-form`: Crear nuevo formulario
- `GET /api/datos-form`: Listar formularios con filtros y paginación
- `GET /api/datos-form/:id`: Obtener un formulario específico
- `PUT /api/datos-form/:id`: Actualizar formulario
- `DELETE /api/datos-form/:id`: Eliminar formulario
- `GET /api/datos-form/user/:userId`: Obtener formularios por usuario
- `GET /api/datos-form/my-forms`: Obtener formularios del usuario autenticado

### Imágenes de Formularios (`/api/datos-form/imagenes`)
- `POST /api/datos-form/imagenes/:formId`: Añadir imagen a un formulario
- `POST /api/datos-form/imagenes/multiple/:formId`: Añadir múltiples imágenes
- `GET /api/datos-form/imagenes/:formId`: Obtener imágenes de un formulario
- `DELETE /api/datos-form/imagenes/:imageId`: Eliminar imagen

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats`: Obtener estadísticas del dashboard

### Logs (`/api/logs`)
- `GET /api/logs`: Listar logs con paginación
- `GET /api/logs/:id`: Obtener un log específico

### Uploads (`/api/uploads`)
- `POST /api/uploads/single/:formId`: Subir una imagen
- `POST /api/uploads/multiple/:formId`: Subir múltiples imágenes
- `DELETE /api/uploads/image/:imageId`: Eliminar imagen

## Modelos de Datos Principales

### Usuario
- ID (UUID)
- Nombre completo
- Nombre de usuario
- Email
- Contraseña (encriptada)
- Rol (ADMIN, USER)

### Formulario de Datos (DatosForm)
- ID (UUID)
- Número de nota
- Propietario
- Dirección de obra
- Sector catastral
- Fecha de inspección
- Área privada (booleano)
- Área de uso público (booleano)
- Tipos de infracción (varios campos booleanos)
- Usuario que creó el formulario (relación)

### Imagen de Formulario (ImagenForm)
- ID (UUID)
- URL
- Descripción
- ID del formulario relacionado (relación)
- Fecha de creación

### Log
- ID (UUID)
- Usuario (relación)
- Acción (CREATE, UPDATE, DELETE)
- Descripción
- Entidad
- ID del formulario relacionado (opcional)
- Fecha

# Prompt para Generación del Frontend

## Generación de Frontend para GCC-Form con Angular 19 y Tailwind

Estoy desarrollando una aplicación de inspección de obras llamada GCC-Form. Ya he completado el backend en NestJS utilizando Prisma y PostgreSQL con UUIDs para todas las entidades. Necesito que me guíes para crear un frontend moderno y responsive con Angular 19 y Tailwind CSS que se integre con este backend.

### Características del Backend:
- API RESTful completa
- Autenticación JWT
- Manejo de roles (ADMIN, USER)
- Carga de imágenes
- Gestión de formularios con múltiples campos
- Dashboard con estadísticas
- Endpoints para CRUD completo

### Requisitos del Frontend:
1. **Estructura del proyecto Angular 19**:
   - Arquitectura modular
   - Implementación de Standalone Components
   - Uso de Signals para estado reactivo
   - Aplicación del patrón de arquitectura por características

2. **Autenticación y Autorización**:
   - Login y registro de usuarios
   - Interceptores para JWT
   - Guards para rutas protegidas
   - Manejo de roles en la interfaz

3. **UI/UX**:
   - Diseño responsive con Tailwind CSS
   - Tema claro/oscuro
   - Dashboard interactivo con gráficos
   - Formularios con validación
   - Carga de imágenes con previsualizaciones
   - Notificaciones de acciones al usuario

4. **Componentes Principales**:
   - Módulo de autenticación
   - Módulo de usuarios (administración)
   - Módulo de formularios de inspección
   - Módulo de imágenes
   - Dashboard con estadísticas
   - Módulo de logs del sistema

5. **Funcionalidades Avanzadas**:
   - Exportación de datos a PDF/word/Excel
   - Filtros avanzados para búsquedas
   - Visualización de imágenes con zoom
   - Mapa para visualizar ubicaciones

Por favor, guíame a través del proceso de creación de esta aplicación frontend, desde la estructura del proyecto hasta la implementación de componentes específicos que se integren con mi backend NestJS. Necesito que utilice las últimas características de Angular 19 como Signals, Standalone Components y el nuevo router. El diseño debe ser moderno y profesional utilizando Tailwind CSS.
