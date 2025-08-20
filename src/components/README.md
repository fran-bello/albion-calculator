# Componentes de la Aplicación Albion

## MarketPrices.js

### Cambios Implementados

#### 1. API Unificada de Historial
- **Antes**: Los pollos usaban la API de historial, otros items usaban la API de precios
- **Ahora**: Todos los items usan la API de historial para mayor confiabilidad
- **Endpoint**: `https://west.albion-online-data.com/api/v2/stats/history/{item_id}?locations={city}&time-scale=24`

#### 2. Nueva Columna: Última Actualización
- Se agregó una columna que muestra cuándo se actualizó por última vez cada precio
- La fecha se formatea de manera amigable (ej: "21 jul 2025, 00:00")
- Se muestra también la hora específica del timestamp

#### 3. Formato de Fechas Mejorado
- Las fechas se muestran en español (es-ES)
- Formato: "21 jul 2025, 00:00"
- Se incluye tanto la fecha como la hora para mayor precisión

#### 4. Manejo de Datos del Historial
- Se obtienen los últimos 2 precios del historial de 24 horas
- Precio mínimo: el menor entre los dos últimos precios
- Precio máximo: el mayor entre los dos últimos precios
- Precio promedio: calculado entre mínimo y máximo

### Beneficios de los Cambios

1. **Mayor Confiabilidad**: La API de historial siempre devuelve datos, evitando errores cuando no hay precios actuales
2. **Datos Más Completos**: Se obtiene un rango de precios en lugar de un solo precio
3. **Transparencia**: Los usuarios pueden ver cuándo se actualizó cada precio
4. **Consistencia**: Todos los items usan el mismo tipo de API

### Estructura de Datos

```javascript
{
  precioMin: number,           // Precio mínimo entre los dos últimos registros
  precioMax: number,           // Precio máximo entre los dos últimos registros
  ultimaActualizacion: string, // Fecha formateada (ej: "21 jul 2025, 00:00")
  timestamp: string,           // Timestamp original de la API
  cargando: boolean,          // Estado de carga
  error: string               // Mensaje de error si lo hay
}
```

### Ejemplo de Respuesta de la API

```json
[
  {
    "location": "Martlock",
    "item_id": "T3_FARM_CHICKEN_GROWN",
    "quality": 1,
    "data": [
      {
        "item_count": 472,
        "avg_price": 6714,
        "timestamp": "2025-07-21T00:00:00"
      },
      {
        "item_count": 1500,
        "avg_price": 7246,
        "timestamp": "2025-07-22T00:00:00"
      }
    ]
  }
]
```

### Uso

1. Seleccionar una ciudad desde el selector
2. Hacer clic en "Consultar Todos"
3. Los precios se obtienen automáticamente del historial de 24 horas
4. Cada fila muestra la última actualización del precio
5. Usar los botones de acción para aplicar precios a la configuración
