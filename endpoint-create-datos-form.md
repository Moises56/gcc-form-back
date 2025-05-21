# Endpoint para Crear un Formulario de Datos (DatosForm)

## Descripción
Este endpoint permite crear un nuevo registro de formulario de inspección (DatosForm) en el sistema. El formulario incluye información detallada sobre propiedades, infracciones, ubicaciones y otros datos relevantes para las inspecciones de obras.

## Endpoint
- **URL:** `/api/datos-form`
- **Método:** `POST`
- **Autenticación requerida:** Sí (JWT)

## Headers Requeridos
```
Authorization: Bearer {jwt-token}
Content-Type: application/json
```

## Body del Request
```json
{
  "numeroNota": "NOTA-2025-001",
  
  "propietario": "Juan Pérez González",
  "direccionObra": "Calle Principal #123, Colonia Centro",
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
  "otroTipoInfraccion": "Invasión de espacio público",
  
  "fechaCita": "2025-05-28T14:30:00Z",
  
  "usoSueloHabitacional": true,
  "usoSueloComercial": false,
  "usoSueloEquipamiento": false,
  "usoSueloServicios": false,
  "usoSueloProductivo": false,
  "usoSueloOtro": "Mixto habitacional-oficinas",
  
  "areaEstimada": 120.5,
  "niveles": 3,
  "sotanos": 1,
  "materiales": "Concreto, acero, mampostería",
  "faseObra": 75.5,
  "costoAproximado": 850000.00,
  
  "tipoRotuloValla": "Publicidad comercial",
  "empresa": "Constructora XYZ",
  "tipoRotura": "Pavimento",
  "cantidadPostesAntenas": 2,
  "faseObraDescripcion": "Construcción de muros en tercer nivel",
  "descripcionOtro": "Observaciones adicionales sobre el proyecto",
  
  "numeroExpediente": "EXP-2025-123",
  "numeroLicencia": "LIC-2025-456",
  "fechaAutorizacion": "2025-01-15T00:00:00Z",
  "fechaVencimiento": "2025-12-31T23:59:59Z",
  "observaciones": "Se requiere atención inmediata por riesgo de colapso parcial",
  
  "reciboNombreFirma": "María Rodríguez"
}
```

### Campos Obligatorios
- Ninguno es estrictamente requerido según el esquema de base de datos, pero para fines prácticos se recomienda incluir al menos:
  - `numeroNota`
  - `propietario`
  - `direccionObra`
  - `sectorCatastral`

### Campos Opcionales
- Todos los demás campos son opcionales según el esquema

## Respuesta Exitosa (201 Created)
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "numeroNota": "NOTA-2025-001",
  "fechaCreacion": "2025-05-21T15:30:45.123Z",
  
  "userId": "e23e9b8f-6841-4c1a-8f45-ac5a37024601",
  
  "propietario": "Juan Pérez González",
  "direccionObra": "Calle Principal #123, Colonia Centro",
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
  "otroTipoInfraccion": "Invasión de espacio público",
  
  "fechaCita": "2025-05-28T14:30:00Z",
  
  "usoSueloHabitacional": true,
  "usoSueloComercial": false,
  "usoSueloEquipamiento": false,
  "usoSueloServicios": false,
  "usoSueloProductivo": false,
  "usoSueloOtro": "Mixto habitacional-oficinas",
  
  "areaEstimada": 120.5,
  "niveles": 3,
  "sotanos": 1,
  "materiales": "Concreto, acero, mampostería",
  "faseObra": 75.5,
  "costoAproximado": 850000.00,
  
  "tipoRotuloValla": "Publicidad comercial",
  "empresa": "Constructora XYZ",
  "tipoRotura": "Pavimento",
  "cantidadPostesAntenas": 2,
  "faseObraDescripcion": "Construcción de muros en tercer nivel",
  "descripcionOtro": "Observaciones adicionales sobre el proyecto",
  
  "numeroExpediente": "EXP-2025-123",
  "numeroLicencia": "LIC-2025-456",
  "fechaAutorizacion": "2025-01-15T00:00:00Z",
  "fechaVencimiento": "2025-12-31T23:59:59Z",
  "observaciones": "Se requiere atención inmediata por riesgo de colapso parcial",
  
  "reciboNombreFirma": "María Rodríguez",
  
  "createdAt": "2025-05-21T15:30:45.123Z",
  "updatedAt": "2025-05-21T15:30:45.123Z"
}
```

## Posibles Respuestas de Error

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Formato de fecha inválido", "El costo aproximado debe ser un número"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "No autorizado",
  "error": "Unauthorized"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Error interno del servidor",
  "error": "Internal Server Error"
}
```

## Notas Adicionales

1. El campo `userId` se obtiene automáticamente del token JWT del usuario autenticado.
2. Los campos `fechaCreacion`, `createdAt` y `updatedAt` se generan automáticamente.
3. En el momento de crear un formulario, el array de `imagenes` estará vacío. Las imágenes se deben añadir posteriormente utilizando los endpoints específicos para ello.
4. Se registrará automáticamente un log de la acción en la tabla `Log` con la acción "CREATE".

## Ejemplo de Implementación (Cliente)

### JavaScript/Fetch
```javascript
const token = 'su-jwt-token';
const formData = {
  numeroNota: "NOTA-2025-001",
  propietario: "Juan Pérez González",
  direccionObra: "Calle Principal #123, Colonia Centro",
  // Añadir otros campos según sea necesario
};

fetch('https://api.example.com/api/datos-form', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => console.log('Formulario creado:', data))
.catch(error => console.error('Error:', error));
```

### Angular
```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosFormService {
  private apiUrl = 'https://api.example.com/api/datos-form';

  constructor(private http: HttpClient) {}

  createForm(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
```
