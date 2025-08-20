'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import MarketItemRow from './MarketItemRow';
import { marketItems } from './marketItemsConfig';

/**
 * Componente para consultar precios del mercado de Albion Online
 * 
 * Todos los items usan la API de historial para obtener datos más confiables:
 * https://west.albion-online-data.com/api/v2/stats/history/{item_id}?locations={city}&time-scale=24
 * 
 * Esta API devuelve el historial de precios de las últimas 24 horas, donde el último registro
 * es el más actual. Se calcula el rango mínimo-máximo entre los dos últimos precios disponibles
 * para proporcionar una visión más completa del mercado.
 */

export default function MarketPrices({ 
  precioMercado, 
  setPrecioMercado, 
  progresoConsulta, 
  setProgresoConsulta,
  setConfiguracion,
  selectedCity 
}) {
  const toast = useRef(null);

  // Log para depuración
  console.log('MarketPrices - selectedCity recibido:', selectedCity);

  // Efecto para limpiar precios cuando cambie la ciudad
  useEffect(() => {
    if (selectedCity && selectedCity.value) {
      setPrecioMercado({
        pastelPollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '', timestamp: null },
        pollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '', timestamp: null },
        carnePollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '', timestamp: null },
        trigo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '', timestamp: null },
        harina: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '', timestamp: null }
      });
    }
  }, [selectedCity]);

  // Función para consultar precios del mercado
  const consultarPrecioMercado = async () => {
    // Validar que haya una ciudad seleccionada
    if (!selectedCity || !selectedCity.value) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar una ciudad antes de consultar precios',
        life: 3000
      });
      return;
    }

    // Marcar todos como cargando
    setPrecioMercado(prev => ({
      pastelPollo: { ...prev.pastelPollo, cargando: true, error: '', timestamp: null },
      pollo: { ...prev.pollo, cargando: true, error: '', timestamp: null },
      carnePollo: { ...prev.carnePollo, cargando: true, error: '', timestamp: null },
      trigo: { ...prev.trigo, cargando: true, error: '', timestamp: null },
      harina: { ...prev.harina, cargando: true, error: '', timestamp: null }
    }));

    // Iniciar progreso
    setProgresoConsulta({
      consultando: true,
      itemActual: '',
      totalItems: 5,
      itemsCompletados: 0
    });
    
    // Lista de items a consultar con sus IDs
    const items = marketItems.map(item => ({
      id: item.id,
      nombre: item.name,
      tipo: item.configKey
    }));
    
    // Función para consultar un item individual
    const consultarItem = async (item) => {
      try {
        // Usar la API de historial para todos los items
        const url = `https://west.albion-online-data.com/api/v2/stats/history/${item.id}?locations=${selectedCity.value}&time-scale=24`;
        
        console.log(`Consultando URL: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Respuesta para ${item.nombre}:`, data);
        
        if (data && data.length > 0) {
          // Buscar datos de la ciudad seleccionada
          const cityData = data.find(city => city.location === selectedCity.value);
          console.log(`Datos de ${selectedCity.value} para ${item.nombre}:`, cityData);
          
          if (cityData && cityData.data && cityData.data.length > 0) {
            // Los datos vienen en orden cronológico, el último es el más reciente
            const ultimoPrecio = cityData.data[cityData.data.length - 1]; // El último elemento es el más reciente
            const segundoPrecio = cityData.data[cityData.data.length - 2]; // El penúltimo elemento para comparar
            
            if (ultimoPrecio && ultimoPrecio.avg_price > 0) {
              // Usar el precio más reciente como precio principal
              const precioActual = ultimoPrecio.avg_price;
              const precioAnterior = segundoPrecio?.avg_price || precioActual;
              
              // Calcular precio mínimo y máximo entre los dos últimos precios
              const precioMin = Math.min(precioActual, precioAnterior);
              const precioMax = Math.max(precioActual, precioAnterior);
              
              // Formatear la fecha de manera amigable
              const fechaUltimaActualizacion = new Date(ultimoPrecio.timestamp);
              const fechaFormateada = fechaUltimaActualizacion.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return {
                precioMin: precioMin,
                precioMax: precioMax,
                ultimaActualizacion: fechaFormateada,
                cargando: false,
                error: '',
                precioCompraMin: precioActual, // Usar el precio más reciente como precio de compra
                precioCompraMax: precioMax,
                fechaVentaMin: ultimoPrecio.timestamp,
                fechaVentaMax: segundoPrecio?.timestamp || ultimoPrecio.timestamp,
                timestamp: ultimoPrecio.timestamp // Guardar el timestamp original para referencia
              };
            }
          }
          
          // Si no se encontraron datos válidos
          return {
            precioMin: 0,
            precioMax: 0,
            ultimaActualizacion: 'No disponible',
            cargando: false,
            error: `No se encontraron datos para ${item.nombre} en ${selectedCity.value}`,
            timestamp: null
          };
        } else {
          throw new Error('No se recibieron datos de la API');
        }
      } catch (error) {
        console.error(`Error consultando ${item.nombre}:`, error);
        return {
          precioMin: 0,
          precioMax: 0,
          ultimaActualizacion: 'Error',
          cargando: false,
          error: `Error: ${error.message}`,
          timestamp: null
        };
      }
    };
    
    try {
      // Consultar cada item por separado con un pequeño delay entre consultas
      const nuevosPrecios = { ...precioMercado };
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Actualizar progreso
        setProgresoConsulta(prev => ({
          ...prev,
          itemActual: item.nombre,
          itemsCompletados: i
        }));
        
        console.log(`Consultando ${item.nombre}...`);
        
        // Consultar el item
        const resultado = await consultarItem(item);
        nuevosPrecios[item.tipo] = resultado;
        
        // Actualizar el estado después de cada consulta
        setPrecioMercado(prev => ({
          ...prev,
          [item.tipo]: resultado
        }));
        
        // Pequeño delay entre consultas para respetar rate limits
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms entre consultas
        }
      }
      
      // Finalizar progreso
      setProgresoConsulta(prev => ({
        ...prev,
        consultando: false,
        itemActual: '',
        itemsCompletados: prev.totalItems
      }));
      
      // Mostrar notificación de éxito
      toast.current?.show({
        severity: 'success',
        summary: 'Precios Obtenidos',
        detail: `Se consultaron ${items.length} items del mercado en ${selectedCity.value}`,
        life: 4000
      });
      
      // Actualizar automáticamente los inputs si hay precios válidos
      actualizarInputsConPreciosMercado(nuevosPrecios);
      
    } catch (error) {
      console.error('Error general en consulta:', error);
      
      // Finalizar progreso con error
      setProgresoConsulta(prev => ({
        ...prev,
        consultando: false,
        itemActual: '',
        itemsCompletados: 0
      }));
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error General',
        detail: `Error en la consulta: ${error.message}`,
        life: 5000
      });
    }
  };

  // Función para actualizar automáticamente los inputs con los precios del mercado
  const actualizarInputsConPreciosMercado = (precios) => {
    const nuevosValores = {};
    
    // Usar la configuración centralizada para actualizar los precios
    marketItems.forEach(item => {
      const precioData = precios[item.configKey];
      if (precioData && precioData.precioMin > 0 && !precioData.error) {
        nuevosValores[item.configKey] = precioData.precioMin;
      }
    });
    
    // Actualizar la configuración con los nuevos valores
    if (Object.keys(nuevosValores).length > 0) {
      setConfiguracion(prev => ({ ...prev, ...nuevosValores }));
    }
  };

  // Función para verificar si hay precios válidos disponibles
  const hayPreciosValidos = () => {
    return Object.values(precioMercado).some(precioData => 
      precioData && precioData.precioMin > 0 && !precioData.error
    );
  };

  // Función para aplicar un tipo de precio global a todos los items
  const aplicarPrecioGlobal = (tipo) => {
    const nuevosValores = {};
    
    marketItems.forEach(item => {
      const precioData = precioMercado[item.configKey];
      if (precioData && !precioData.error) {
        let precioAplicar = 0;
        
        switch (tipo) {
          case 'minimo':
            precioAplicar = precioData.precioMin;
            break;
          case 'maximo':
            precioAplicar = precioData.precioMax;
            break;
          case 'promedio':
            precioAplicar = Math.round((precioData.precioMin + precioData.precioMax) / 2);
            break;
          default:
            return;
        }
        
        if (precioAplicar > 0) {
          nuevosValores[item.configKey] = precioAplicar;
        }
      }
    });
    
    // Actualizar la configuración con los nuevos valores
    if (Object.keys(nuevosValores).length > 0) {
      setConfiguracion(prev => ({ ...prev, ...nuevosValores }));
      
      // Mostrar notificación de éxito
      const tipoTexto = tipo === 'minimo' ? 'mínimos' : tipo === 'maximo' ? 'máximos' : 'promedios';
      toast.current?.show({
        severity: 'success',
        summary: 'Precios Aplicados',
        detail: `Se aplicaron los precios ${tipoTexto} a todos los items disponibles`,
        life: 4000
      });
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Sin Precios',
        detail: 'No hay precios válidos disponibles para aplicar',
        life: 3000
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      
      {/* Coste de Mercado */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center mb-3">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <h5 className="mb-0 text-center text-md-start">
                  <i className="pi pi-globe text-info me-2"></i>
                  Coste de Mercado - {selectedCity.value}
                </h5>
              </div>
              <Button 
                label="Consultar Todos" 
                icon="pi pi-search" 
                className="p-button-info"
                onClick={consultarPrecioMercado}
                loading={progresoConsulta.consultando}
                disabled={progresoConsulta.consultando || !selectedCity || !selectedCity.value}
              />
            </div>

            {/* Mensaje cuando no hay ciudad seleccionada */}
            {(!selectedCity || !selectedCity.value) && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-warning">
                    <div className="d-flex align-items-center">
                      <i className="pi pi-exclamation-triangle me-2" style={{ fontSize: '1.2rem' }}></i>
                      <div className="flex-grow-1">
                        <strong>Seleccione una ciudad</strong>
                        <div className="mt-2">
                          <small className="text-muted">
                            Debe seleccionar una ciudad desde el selector superior para poder consultar precios del mercado
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Indicador de Progreso */}
            {progresoConsulta.consultando && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-info">
                    <div className="d-flex align-items-center">
                      <i className="pi pi-spin pi-spinner me-2" style={{ fontSize: '1.2rem' }}></i>
                      <div className="flex-grow-1">
                        <strong>Consultando precios del mercado...</strong>
                        <div className="mt-2">
                          <small className="text-muted">
                            {progresoConsulta.itemActual} ({progresoConsulta.itemsCompletados + 1} de {progresoConsulta.totalItems})
                          </small>
                        </div>
                        <div className="progress mt-2" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar progress-bar-striped progress-bar-animated" 
                            role="progressbar" 
                            style={{ width: `${((progresoConsulta.itemsCompletados + 1) / progresoConsulta.totalItems) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Materiales de Fabricación */}
            <div className="row">
              <div className="col-12">
                <h6 className="text-center mb-3" style={{ fontSize: '0.9rem' }}>
                  <i className="pi pi-table text-primary me-2"></i>
                  Precios de Materiales - {selectedCity.value}
                </h6>
                
                {/* Botones globales para aplicar precios a todos los items */}
                <div className="d-flex justify-content-center mb-3">
                  <div className="btn-group" role="group">
                    <Button
                      label="Usar Mínimos"
                      icon="pi pi-check"
                      className="p-button-success p-button-sm me-2"
                      onClick={() => aplicarPrecioGlobal('minimo')}
                      disabled={!hayPreciosValidos()}
                      tooltip="Aplicar precio mínimo a todos los items"
                    />
                    <Button
                      label="Usar Máximos"
                      icon="pi pi-check"
                      className="p-button-warning p-button-sm me-2"
                      onClick={() => aplicarPrecioGlobal('maximo')}
                      disabled={!hayPreciosValidos()}
                      tooltip="Aplicar precio máximo a todos los items"
                    />
                    <Button
                      label="Usar Promedios"
                      icon="pi pi-check"
                      className="p-button-info p-button-sm"
                      onClick={() => aplicarPrecioGlobal('promedio')}
                      disabled={!hayPreciosValidos()}
                      tooltip="Aplicar precio promedio a todos los items"
                    />
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Item</th>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Precio Mínimo</th>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Precio Máximo</th>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Precio Promedio</th>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Última Actualización</th>
                        <th scope="col" className="text-center" style={{ fontSize: '0.8rem' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketItems.map((item) => (
                        <MarketItemRow
                          key={item.id}
                          itemId={item.id}
                          itemName={item.name}
                          itemCode={item.code}
                          precioData={precioMercado[item.configKey] || {}}
                          onSetConfiguracion={setConfiguracion}
                          configKey={item.configKey}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Información adicional */}
                <div className="mt-3">
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted">
                        <i className="pi pi-info-circle me-1"></i>
                        Los precios se obtienen del historial de 24 horas de la API oficial
                      </small>
                    </div>
                    <div className="col-md-6 text-end">
                      <small className="text-muted">
                        <i className="pi pi-clock me-1"></i>
                        Última consulta: {new Date().toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
