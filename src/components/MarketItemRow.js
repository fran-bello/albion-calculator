'use client';

import { Button } from 'primereact/button';

/**
 * Componente reutilizable para mostrar una fila de item del mercado
 * @param {Object} props - Propiedades del componente
 * @param {string} props.itemId - ID del item de Albion Online
 * @param {string} props.itemName - Nombre del item
 * @param {string} props.itemCode - Código del item (ej: T3_MEAL_PIE)
 * @param {Object} props.precioData - Datos de precios del item
 * @param {number} props.precioData.precioMin - Precio mínimo
 * @param {number} props.precioData.precioMax - Precio máximo
 * @param {string} props.precioData.ultimaActualizacion - Última actualización
 * @param {boolean} props.precioData.cargando - Si está cargando
 * @param {string} props.precioData.error - Error si lo hay
 * @param {Function} props.onSetConfiguracion - Función para actualizar la configuración
 * @param {string} props.configKey - Clave de configuración para este item
 */
export default function MarketItemRow({ 
  itemId, 
  itemName, 
  itemCode, 
  precioData, 
  onSetConfiguracion, 
  configKey 
}) {
  // Calcular precio promedio
  const precioPromedio = precioData.precioMin > 0 && precioData.precioMax > 0 
    ? Math.round((precioData.precioMin + precioData.precioMax) / 2) 
    : 0;

  // Función para actualizar configuración con un precio específico
  const actualizarConfiguracion = (precio) => {
    onSetConfiguracion(prev => ({ ...prev, [configKey]: precio }));
  };

  return (
    <tr>
      {/* Columna del Item */}
      <td className="text-start">
        <div className="d-flex align-items-center">
          <img 
            src={`https://render.albiononline.com/v1/item/${itemId}.png?quality=1&size=28`}
            alt={itemName} 
            className="me-2"
            style={{ width: '28px', height: '28px' }}
          />
          <div>
            <strong style={{ fontSize: '0.9rem' }}>{itemName}</strong>
          </div>
        </div>
      </td>

      {/* Columna Precio Mínimo */}
      <td className="text-center">
        <span className="badge bg-success" style={{ fontSize: '0.8rem' }}>${precioData.precioMin}</span>
      </td>

      {/* Columna Precio Máximo */}
      <td className="text-center">
        <span className="badge bg-warning" style={{ fontSize: '0.8rem' }}>${precioData.precioMax}</span>
      </td>

      {/* Columna Precio Promedio */}
      <td className="text-center">
        <span className="badge bg-info" style={{ fontSize: '0.8rem' }}>${precioPromedio}</span>
      </td>

      {/* Columna Última Actualización */}
      <td className="text-center">
        {precioData.ultimaActualizacion && precioData.ultimaActualizacion !== 'No disponible' && precioData.ultimaActualizacion !== 'Error' ? (
          <div className="d-flex flex-column align-items-center">
            <span className="badge bg-secondary mb-1" style={{ fontSize: '0.75rem' }}>
              {precioData.ultimaActualizacion}
            </span>
            {precioData.timestamp && (
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                {new Date(precioData.timestamp).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            )}
          </div>
        ) : (
          <span className="badge bg-light text-dark" style={{ fontSize: '0.75rem' }}>
            {precioData.ultimaActualizacion || 'No disponible'}
          </span>
        )}
      </td>

      {/* Columna de Acciones */}
      <td className="text-center">
        <div className="btn-group-vertical">
          {precioData.precioMin > 0 && (
            <Button 
              label="Mín" 
              icon="pi pi-check" 
              className="p-button-sm mb-1 w-100"
              style={{ 
                backgroundColor: '#198754', 
                borderColor: '#198754',
                height: '26px',
                fontSize: '0.7rem',
                borderRadius: '0.4rem'
              }}
              onClick={() => actualizarConfiguracion(precioData.precioMin)}
            />
          )}
          
          {precioData.precioMax > 0 && (
            <Button 
              label="Máx" 
              icon="pi pi-check" 
              className="p-button-sm mb-1 w-100"
              style={{ 
                backgroundColor: '#ffc107', 
                borderColor: '#ffc107',
                color: '#000',
                height: '26px',
                fontSize: '0.7rem',
                borderRadius: '0.4rem'
              }}
              onClick={() => actualizarConfiguracion(precioData.precioMax)}
            />
          )}
          
          {precioData.precioMin > 0 && precioData.precioMax > 0 && (
            <Button 
              label="Prom" 
              icon="pi pi-check" 
              className="p-button-sm w-100"
              style={{ 
                backgroundColor: '#0dcaf0', 
                borderColor: '#0dcaf0',
                color: '#000',
                height: '26px',
                fontSize: '0.7rem',
                borderRadius: '0.4rem',
                whiteSpace: 'nowrap'
              }}
              onClick={() => actualizarConfiguracion(precioPromedio)}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
