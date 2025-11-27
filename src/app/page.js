'use client';

import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import MarketPrices from '../components/MarketPrices';
import ConfigurationForm from '../components/ConfigurationForm';
import AnalysisResults from '../components/AnalysisResults';
import FabricationAnalysis from '../components/FabricationAnalysis';
import AccumulatedAmounts from '../components/AccumulatedAmounts';
import HistoryChart from '../components/HistoryChart';
import CitySelector from '../components/CitySelector';
import Link from 'next/link';
import { Button } from 'primereact/button';
import PrimeReactThemeLoader from '../components/PrimeReactThemeLoader';
import { useRentabilidad } from '../hooks/useRentabilidad';

export default function Home() {
  const toast = useRef(null);

  // Colores temáticos de las ciudades
  const cityColors = {
    'Martlock': '#007bff',
    'Bridgewatch': '#fd7e14',
    'Thetford': '#9c27b0',
    'Fort Sterling': '#ffffff',
    'Lymhurst': '#28a745',
    'Caerleon': '#343a40',
    'Brecilien': '#6f42c1'
  };

  // Estado para la ciudad seleccionada
  const [selectedCity, setSelectedCity] = useState({
    name: 'Martlock',
    value: 'Martlock'
  });

  // Log del estado de la ciudad para depuración
  console.log('Estado actual de selectedCity:', selectedCity);

  // Estado para los precios del mercado
  const [precioMercado, setPrecioMercado] = useState({
    pastelPollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '' },
    pollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '' },
    carnePollo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '' },
    trigo: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '' },
    harina: { precioMin: 0, precioMax: 0, precioCompraMin: 0, ultimaActualizacion: null, cargando: false, error: '' }
  });

  // Estado para el progreso de la consulta
  const [progresoConsulta, setProgresoConsulta] = useState({
    consultando: false,
    itemActual: '',
    itemsCompletados: 0,
    totalItems: 5
  });

  // Estado para la configuración
  const [configuracion, setConfiguracion] = useState({
    costoPastel: 450,
    precioClienteGeneral: 378,
    precioSocio: 350,
    silverAcumulado: 0,
    precioPollo: 0,
    precioCarnePollo: 0,
    precioTrigo: 0,
    precioHarina: 0,
    costoPicarPollo: 713,
    costoFabricacion: 213,
    precioVentaPastel: 0
  });

  // Usar el hook personalizado para la lógica de rentabilidad
  const {
    analisisActual,
    historial,
    montosAcumulados,
    analizarRentabilidad: analizarRentabilidadHook,
    guardarAnalisis: guardarAnalisisHook,
    limpiarStorage: limpiarStorageHook
  } = useRentabilidad();

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const configGuardada = localStorage.getItem('configuracionRentabilidad');
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada));
    }

    // Cargar ciudad seleccionada del localStorage
    const ciudadGuardada = localStorage.getItem('ciudadSeleccionada');
    console.log('Ciudad guardada en localStorage:', ciudadGuardada);
    if (ciudadGuardada) {
      const ciudad = JSON.parse(ciudadGuardada);
      console.log('Ciudad cargada del localStorage:', ciudad);
      setSelectedCity(ciudad);
    }
  }, []);

  // Función para manejar el cambio de ciudad
  const handleCityChange = (newCity) => {
    console.log('Cambiando ciudad a:', newCity);
    
    // Validar que newCity tenga la estructura correcta
    if (newCity && typeof newCity === 'object' && newCity.name && newCity.value) {
      setSelectedCity(newCity);
      localStorage.setItem('ciudadSeleccionada', JSON.stringify(newCity));
      
      // Mostrar notificación
      toast.current?.show({
        severity: 'success',
        summary: 'Ciudad Cambiada',
        detail: `Ahora consultando precios en ${newCity.name}`,
        life: 3000
      });
    } else {
      console.error('Estructura de ciudad inválida:', newCity);
    }
  };

  // Función para consultar precios del mercado
  const consultarPrecios = async () => {
    if (progresoConsulta.consultando) return;
    
    setProgresoConsulta(prev => ({ ...prev, consultando: true, itemsCompletados: 0 }));
    
    const items = [
      { key: 'pastelPollo', itemId: 'T3_MEAL_PIE' },
      { key: 'pollo', itemId: 'T3_FARM_CHICKEN_GROWN' },
      { key: 'carnePollo', itemId: 'T3_MEAT' },
      { key: 'trigo', itemId: 'T3_WHEAT' },
      { key: 'harina', itemId: 'T3_FLOUR' }
    ];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setProgresoConsulta(prev => ({ 
        ...prev, 
        itemActual: item.key, 
        itemsCompletados: i 
      }));

      try {
        const response = await fetch(`https://www.albion-online-data.com/api/v2/stats/prices/${item.itemId}?locations=${selectedCity.value}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const cityData = data.find(city => city.location === selectedCity.value);
          
          if (cityData) {
            setPrecioMercado(prev => ({
              ...prev,
              [item.key]: {
                precioMin: cityData.data.sell_price_min || 0,
                precioMax: cityData.data.sell_price_max || 0,
                precioCompraMin: cityData.data.buy_price_max || 0,
                ultimaActualizacion: new Date().toLocaleString('es-ES'),
                cargando: false,
                error: ''
              }
            }));
          }
        }
      } catch (error) {
        console.error(`Error consultando ${item.key}:`, error);
        setPrecioMercado(prev => ({
          ...prev,
          [item.key]: {
            ...prev[item.key],
            error: error.message,
            cargando: false
          }
        }));
      }
      
      // Pequeña pausa entre consultas
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setProgresoConsulta(prev => ({ 
      ...prev, 
      consultando: false, 
      itemsCompletados: 5,
      itemActual: ''
    }));
    
    toast.current?.show({
      severity: 'success',
      summary: 'Consulta Completada',
      detail: 'Precios del mercado actualizados',
      life: 3000
    });
  };

  // Función para analizar rentabilidad
  const analizarRentabilidad = () => {
    // Guardar configuración en localStorage
    localStorage.setItem('configuracionRentabilidad', JSON.stringify(configuracion));
    
    // Llamar a la función del hook
    analizarRentabilidadHook(configuracion, precioMercado);
    
    toast.current?.show({
      severity: 'success',
      summary: 'Análisis Completado',
      detail: 'Rentabilidad calculada exitosamente',
      life: 3000
    });
  };

  // Función para guardar análisis
  const guardarAnalisis = () => {
    const resultado = guardarAnalisisHook();
    
    toast.current?.show({
      severity: resultado.success ? 'success' : 'error',
      summary: resultado.success ? 'Análisis Guardado' : 'Error',
      detail: resultado.message,
      life: 3000
    });
  };

  // Función para limpiar historial
  const limpiarStorage = () => {
    const resultado = limpiarStorageHook();
    
    toast.current?.show({
      severity: 'info',
      summary: 'Historial Limpiado',
      detail: resultado.message,
      life: 3000
    });
  };

  return (
    <>
      <PrimeReactThemeLoader />
      <div className="app-container">
        {/* Header de la aplicación */}
        <header className="app-header">
          <div className="app-header-title">
            <i className="pi pi-store"></i>
            <span>Albion Online - Calculadora de Rentabilidad</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/flipping" passHref>
              <Button 
                label="Market Flipping" 
                icon="pi pi-chart-line" 
                className="p-button-text"
                style={{ color: 'var(--text-primary)' }}
              />
            </Link>
          </div>
        </header>

        <div className="main-layout">
          <Toast ref={toast} />
          
          {/* Sidebar izquierdo */}
          <aside className="left-column">
            <div className="left-column-header">
              <div className="left-column-title">
                <i className="pi pi-calculator"></i>
                Tienda Curtidora
              </div>
              <p className="left-column-subtitle">
                Calculadora de Rentabilidad
              </p>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {/* Selector de Ciudad */}
              <CitySelector 
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
              />
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="right-column">
            {/* Componente de Precios del Mercado */}
            <MarketPrices 
              precioMercado={precioMercado}
              setPrecioMercado={setPrecioMercado}
              progresoConsulta={progresoConsulta}
              setProgresoConsulta={setProgresoConsulta}
              setConfiguracion={setConfiguracion}
              selectedCity={selectedCity}
            />

            {/* Componente de Formulario de Configuración */}
            <ConfigurationForm 
              configuracion={configuracion} 
              setConfiguracion={setConfiguracion}
              analizarRentabilidad={analizarRentabilidad}
            />

            {/* Componente de Resultados del Análisis */}
            <AnalysisResults 
              analisisActual={analisisActual}
              guardarAnalisis={guardarAnalisis}
              limpiarStorage={limpiarStorage}
            />

            {/* Componente de Análisis de Fabricación */}
            <FabricationAnalysis analisisActual={analisisActual} />

            {/* Componente de Montos Acumulados */}
            <AccumulatedAmounts montosAcumulados={montosAcumulados} />

            {/* Componente de Historial */}
            <HistoryChart historial={historial} />
          </main>
        </div>
      </div>
    </>
  );
}
