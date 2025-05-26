# Endpoints para Gestión de Formularios

Este documento detalla los endpoints disponibles para actualizar y eliminar formularios en la API. Es especialmente útil para probar con aplicaciones frontend como Angular 19.

## Endpoints para Formularios

### 1. Actualizar Formulario Completo

**Endpoint:** `PUT /api/datos-form/:id`

**Parámetros de URL:**
- `id`: ID del formulario a actualizar (UUID)

**Headers necesarios:**
- `Authorization`: Bearer [token]
- `Content-Type`: application/json

**Roles permitidos:** ADMIN, MODERADOR, OPERADOR

**Body:**
```json
{
  "numeroNota": "60005",
  "propietario": "Nombre Actualizado",
  "direccionObra": "Calle Principal 123",
  "sectorCatastral": "Centro",
  "fechaInspeccion": "2025-05-23T12:00:00Z",
  "estado": "ACTIVO",
  "areaPrivada": true,
  "areaUsoPublico": false,
  
  "sinLicenciaConstruccion": true,
  "construccionNoAutorizada": false,
  "cambioUsoNoAutorizado": false,
  "licenciaVencida": true,
  
  "obraInseguraPeligrosa": false,
  "construccionAreaPublica": true,
  "utilizaAreaPublicaMaterial": false,
  "roturaViaBordillo": true,
  
  "instalacionRotulosVallas": false,
  "instalacionAntena": true,
  "instalacionPostes": false,
  "otroTipoInfraccion": "Otra descripción",
  
  "fechaCita": "2025-06-15T10:00:00Z",
  
  "usoSueloHabitacional": true,
  "usoSueloComercial": false,
  "usoSueloEquipamiento": false,
  "usoSueloServicios": true,
  "usoSueloProductivo": false,
  "usoSueloOtro": "Uso mixto",
  
  "areaEstimada": 150.5,
  "niveles": 2,
  "sotanos": 1,
  "materiales": "Concreto y metal",
  "faseObra": 75.5,
  "costoAproximado": 85000.0,
  
  "tipoRotuloValla": "Publicitario",
  "empresa": "Empresa ABC",
  "tipoRotura": "Parcial",
  "cantidadPostesAntenas": 3,
  "faseObraDescripcion": "En proceso",
  "descripcionOtro": "Detalles adicionales",
  
  "numeroExpediente": "EXP-2025-001",
  "numeroLicencia": "LIC-2025-001",
  "fechaAutorizacion": "2025-01-15T09:00:00Z",
  "fechaVencimiento": "2025-12-31T23:59:59Z",
  "observaciones": "Observaciones actualizadas",
  
  "reciboNombreFirma": "Juan Pérez"
}
```

**Respuesta exitosa:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numeroNota": "60005",
  "fechaCreacion": "2025-05-20T10:30:00.000Z",
  "estado": "ACTIVO",
  "userId": "987e6543-e21b-43d3-b456-426614174123",
  "propietario": "Nombre Actualizado",
  // ... resto de campos actualizados
  "createdAt": "2025-05-20T10:30:00.000Z",
  "updatedAt": "2025-05-23T12:45:30.000Z"
}
```

### 2. Actualizar Solo el Estado del Formulario

**Endpoint:** `PUT /api/datos-form/:id/estado/:estado`

**Parámetros de URL:**
- `id`: ID del formulario a actualizar (UUID)
- `estado`: Nuevo estado del formulario (debe ser "ACTIVO" o "INACTIVO")

**Headers necesarios:**
- `Authorization`: Bearer [token]

**Roles permitidos:** ADMIN, MODERADOR, OPERADOR

**Body:** No requiere body

**Ejemplo de URL:**
```
PUT /api/datos-form/123e4567-e89b-12d3-a456-426614174000/estado/INACTIVO
```

**Respuesta exitosa:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "numeroNota": "60005",
  "fechaCreacion": "2025-05-20T10:30:00.000Z",
  "estado": "INACTIVO",
  "userId": "987e6543-e21b-43d3-b456-426614174123",
  // ... resto de campos sin cambios
  "createdAt": "2025-05-20T10:30:00.000Z",
  "updatedAt": "2025-05-23T12:45:30.000Z"
}
```

### 3. Eliminar un Formulario

**Endpoint:** `DELETE /api/datos-form/:id`

**Parámetros de URL:**
- `id`: ID del formulario a eliminar (UUID)

**Headers necesarios:**
- `Authorization`: Bearer [token]

**Roles permitidos:** ADMIN, MODERADOR

**Body:** No requiere body

**Ejemplo de URL:**
```
DELETE /api/datos-form/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta exitosa:**
```json
{
  "message": "Formulario eliminado exitosamente"
}
```

## Ejemplos de Código para Angular 19

### 1. Servicio en Angular para Gestión de Formularios

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener los headers con el token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Actualizar formulario completo
  updateFormulario(id: string, formulario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/datos-form/${id}`, formulario, this.getHeaders());
  }

  // Actualizar solo el estado del formulario
  updateFormularioEstado(id: string, estado: 'ACTIVO' | 'INACTIVO'): Observable<any> {
    return this.http.put(`${this.apiUrl}/datos-form/${id}/estado/${estado}`, {}, this.getHeaders());
  }

  // Eliminar formulario
  deleteFormulario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/datos-form/${id}`, this.getHeaders());
  }
}
```

### 2. Componente de Ejemplo para Actualizar Estado

```typescript
import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../services/formulario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-estado',
  templateUrl: './actualizar-estado.component.html',
  styleUrls: ['./actualizar-estado.component.scss']
})
export class ActualizarEstadoComponent implements OnInit {
  formularioId: string = '';
  estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO';
  loading: boolean = false;
  mensaje: string = '';
  error: string = '';

  constructor(
    private formularioService: FormularioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.formularioId = this.route.snapshot.paramMap.get('id') || '';
  }

  actualizarEstado() {
    this.loading = true;
    this.mensaje = '';
    this.error = '';

    this.formularioService.updateFormularioEstado(this.formularioId, this.estado)
      .subscribe({
        next: (response) => {
          this.mensaje = `Formulario actualizado exitosamente a estado: ${this.estado}`;
          this.loading = false;
        },
        error: (err) => {
          this.error = `Error al actualizar el formulario: ${err.message}`;
          this.loading = false;
        }
      });
  }

  toggleEstado() {
    this.estado = this.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
  }

  regresar() {
    this.router.navigate(['/formularios']);
  }
}
```

### 3. HTML del Componente para Actualizar Estado

```html
<div class="container mt-4">
  <div class="card">
    <div class="card-header bg-primary text-white">
      <h2>Actualizar Estado del Formulario</h2>
    </div>
    <div class="card-body">
      <div *ngIf="mensaje" class="alert alert-success">{{mensaje}}</div>
      <div *ngIf="error" class="alert alert-danger">{{error}}</div>
      
      <div class="mb-3">
        <h4>ID del Formulario: {{formularioId}}</h4>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Estado:</label>
        <div class="btn-group" role="group">
          <button 
            [class]="estado === 'ACTIVO' ? 'btn btn-success' : 'btn btn-outline-success'"
            (click)="estado = 'ACTIVO'">
            ACTIVO
          </button>
          <button 
            [class]="estado === 'INACTIVO' ? 'btn btn-danger' : 'btn btn-outline-danger'"
            (click)="estado = 'INACTIVO'">
            INACTIVO
          </button>
        </div>
      </div>
      
      <div class="mb-3 mt-4">
        <button 
          class="btn btn-primary me-2" 
          (click)="actualizarEstado()"
          [disabled]="loading">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
          Guardar Cambios
        </button>
        <button class="btn btn-secondary" (click)="regresar()">Regresar</button>
      </div>
    </div>
  </div>
</div>
```

### 4. Componente para Eliminar Formulario

```typescript
import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../services/formulario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-eliminar-formulario',
  templateUrl: './eliminar-formulario.component.html',
  styleUrls: ['./eliminar-formulario.component.scss']
})
export class EliminarFormularioComponent implements OnInit {
  formularioId: string = '';
  confirmacion: string = '';
  loading: boolean = false;
  mensaje: string = '';
  error: string = '';

  constructor(
    private formularioService: FormularioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.formularioId = this.route.snapshot.paramMap.get('id') || '';
  }

  eliminarFormulario() {
    // Requiere confirmación escribiendo "ELIMINAR"
    if (this.confirmacion !== 'ELIMINAR') {
      this.error = 'Debe escribir ELIMINAR para confirmar';
      return;
    }

    this.loading = true;
    this.mensaje = '';
    this.error = '';

    this.formularioService.deleteFormulario(this.formularioId)
      .subscribe({
        next: (response) => {
          this.mensaje = 'Formulario eliminado exitosamente';
          this.loading = false;
          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/formularios']);
          }, 2000);
        },
        error: (err) => {
          this.error = `Error al eliminar el formulario: ${err.message}`;
          this.loading = false;
        }
      });
  }

  cancelar() {
    this.router.navigate(['/formularios']);
  }
}
```

### 5. Servicio para Subir Imágenes con Descripción

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Subir una imagen individual con descripción
  uploadSingleImage(formId: string, file: File, descripcion?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/uploads/single/${formId}`, formData, { headers });
  }

  // Subir múltiples imágenes con descripción
  uploadMultipleImages(formId: string, files: File[], descripcion?: string): Observable<any> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/uploads/multiple/${formId}`, formData, { headers });
  }

  // Eliminar imagen
  deleteImage(imageId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/uploads/image/${imageId}`, { headers });
  }
}
```

### 6. Componente para Subir Imágenes

```typescript
import { Component } from '@angular/core';
import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  selectedFiles: File[] = [];
  descripcion: string = '';
  uploading: boolean = false;
  mensaje: string = '';
  error: string = '';

  constructor(private imageUploadService: ImageUploadService) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadImages(formId: string) {
    if (this.selectedFiles.length === 0) {
      this.error = 'Por favor seleccione al menos una imagen';
      return;
    }

    this.uploading = true;
    this.mensaje = '';
    this.error = '';

    if (this.selectedFiles.length === 1) {
      // Subir una sola imagen
      this.imageUploadService.uploadSingleImage(formId, this.selectedFiles[0], this.descripcion)
        .subscribe({
          next: (response) => {
            this.mensaje = 'Imagen subida exitosamente';
            this.uploading = false;
            this.resetForm();
          },
          error: (error) => {
            this.error = 'Error al subir la imagen: ' + error.message;
            this.uploading = false;
          }
        });
    } else {
      // Subir múltiples imágenes
      this.imageUploadService.uploadMultipleImages(formId, this.selectedFiles, this.descripcion)
        .subscribe({
          next: (response) => {
            this.mensaje = `${response.length} imágenes subidas exitosamente`;
            this.uploading = false;
            this.resetForm();
          },
          error: (error) => {
            this.error = 'Error al subir las imágenes: ' + error.message;
            this.uploading = false;
          }
        });
    }
  }

  resetForm() {
    this.selectedFiles = [];
    this.descripcion = '';
  }
}
```

## Endpoints de Subida de Imágenes

### Subir Imagen Individual
- **URL**: `POST /api/uploads/single/:formId`
- **Parámetros**: `formId` (UUID del formulario)
- **Body**: `multipart/form-data`
  - `file`: Archivo de imagen
  - `descripcion`: Descripción opcional de la imagen
- **Roles**: ADMIN, MODERADOR, OPERADOR

### Subir Múltiples Imágenes
- **URL**: `POST /api/uploads/multiple/:formId`
- **Parámetros**: `formId` (UUID del formulario)
- **Body**: `multipart/form-data`
  - `files`: Archivos de imagen (máximo 6)
  - `descripcion`: Descripción opcional que se aplicará a todas las imágenes
- **Roles**: ADMIN, MODERADOR, OPERADOR

### Eliminar Imagen
- **URL**: `DELETE /api/uploads/image/:imageId`
- **Parámetros**: `imageId` (UUID de la imagen)
- **Roles**: ADMIN, MODERADOR

## Manejo de Errores Comunes

Al trabajar con estos endpoints, puedes encontrar los siguientes errores:

1. **Error 401 (Unauthorized)**: El token no es válido o ha expirado.
   - Solución: Regenerar el token haciendo login nuevamente.

2. **Error 403 (Forbidden)**: El usuario no tiene los permisos necesarios.
   - Solución: Verificar que el usuario tenga el rol adecuado.

3. **Error 404 (Not Found)**: El formulario con el ID especificado no existe.
   - Solución: Verificar que el ID del formulario sea correcto.

4. **Error 400 (Bad Request)**: Los datos enviados son inválidos.
   - Solución: Verificar que el formato de los datos sea correcto.

## Notas Importantes

1. Todos los endpoints requieren autenticación mediante token JWT.
2. La eliminación de un formulario también elimina sus imágenes asociadas (debido a la regla `onDelete: Cascade`).
3. Al actualizar solo el estado, no es necesario enviar otros datos en el body.
4. Los campos con fecha deben estar en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
5. Al eliminar un formulario, asegúrate de tener los permisos necesarios (ADMIN o MODERADOR).
