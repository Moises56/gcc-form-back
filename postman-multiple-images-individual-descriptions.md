# Actualización de Postman Collection - Descripciones Individuales para Imágenes Múltiples

## Nuevo Request: Upload Multiple Images with Individual Descriptions

### Configuración del Request

**Method:** POST
**URL:** `{{base_url}}/api/uploads/multiple/{{formId}}`

**Headers:**
```
Authorization: Bearer {{jwt_token}}
Content-Type: multipart/form-data
```

### Body (form-data)

#### Opción 1: Descripciones Individuales
```
files: [Seleccionar archivo 1]
files: [Seleccionar archivo 2]  
files: [Seleccionar archivo 3]
descripciones[0]: "Fachada principal del edificio"
descripciones[1]: "Vista interior del salón principal"
descripciones[2]: "Planos arquitectónicos aprobados"
```

#### Opción 2: Descripción General + Algunas Individuales
```
files: [Seleccionar archivo 1]
files: [Seleccionar archivo 2]
files: [Seleccionar archivo 3]
descripciones[0]: "Fachada principal del edificio"
descripciones[2]: "Planos arquitectónicos aprobados"
descripcion: "Documentación del proyecto"
```
*Nota: La imagen en índice 1 usará la descripción general como fallback*

#### Opción 3: Solo Descripción General (comportamiento anterior)
```
files: [Seleccionar archivo 1]
files: [Seleccionar archivo 2]
descripcion: "Imágenes del proceso de construcción"
```

### Variables de Entorno Necesarias
- `base_url`: URL base de la API
- `jwt_token`: Token JWT para autenticación  
- `formId`: ID UUID del formulario

### Respuesta Esperada
```json
[
  {
    "id": "uuid-imagen-1",
    "url": "/uploads/filename-1.jpg",
    "descripcion": "Fachada principal del edificio",
    "datosFormId": "{{formId}}",
    "createdAt": "2025-05-26T..."
  },
  {
    "id": "uuid-imagen-2", 
    "url": "/uploads/filename-2.jpg",
    "descripcion": "Vista interior del salón principal",
    "datosFormId": "{{formId}}",
    "createdAt": "2025-05-26T..."
  }
]
```

### Tests Sugeridos para Postman

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    const response = pm.response.json();
    pm.expect(response).to.be.an('array');
});

pm.test("Each image has individual description", function () {
    const response = pm.response.json();
    const descriptions = response.map(img => img.descripcion);
    
    // Verificar que no todas las descripciones son iguales
    const uniqueDescriptions = [...new Set(descriptions)];
    pm.expect(uniqueDescriptions.length).to.be.greaterThan(1);
});

pm.test("All images belong to the same form", function () {
    const response = pm.response.json();
    const formId = pm.variables.get("formId");
    
    response.forEach(image => {
        pm.expect(image.datosFormId).to.equal(formId);
    });
});
```

## Instrucciones para Actualizar la Colección

1. **Duplicar el request existente:** "Upload Multiple Images"
2. **Renombrar:** "Upload Multiple Images with Individual Descriptions"
3. **Actualizar el body** con los nuevos campos `descripciones[0]`, `descripciones[1]`, etc.
4. **Agregar los tests** mencionados arriba
5. **Crear ejemplos** para cada una de las 3 opciones de uso

## Casos de Uso Recomendados

### Para Documentación de Construcción:
```
descripciones[0]: "Fachada frontal - cumple normativa municipal"
descripciones[1]: "Fachada posterior - acceso de servicio"
descripciones[2]: "Planta baja - distribución aprobada"
descripciones[3]: "Primer piso - dormitorios según planos"
```

### Para Inspecciones de Seguridad:
```
descripciones[0]: "Salida de emergencia principal"
descripciones[1]: "Extintores ubicados según normativa"
descripciones[2]: "Señalización de evacuación instalada"
```

### Para Documentación de Avances:
```
descripciones[0]: "Fundación completada - semana 1"
descripciones[1]: "Estructura metálica instalada - semana 3"
descripciones[2]: "Acabados exteriores - semana 6"
```
