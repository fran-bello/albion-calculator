import { useState, useEffect } from 'react';

export const useRentabilidad = () => {
  // Estado para el análisis
  const [analisisActual, setAnalisisActual] = useState({
    gananciaClienteGeneral: 0,
    gananciaSocio: 0,
    roiClienteGeneral: 0,
    roiSocio: 0,
    costeFabricacionPollo: 0,
    costeFabricacionCarne: 0,
    gananciaFabricacionPollo: 0,
    gananciaFabricacionCarne: 0,
    roiFabricacionPollo: 0,
    roiFabricacionCarne: 0,
    pastelesUsados: 0,
    silverGenerado: 0,
    costoPastel: 0,
    costoPor100Nutricion: 0,
    nutricionPorPastel: 156,
    // Nuevos campos para comparación de carne
    precioCarneDirecta: 0,
    precioCarnePorPicar: 0,
    costoPolloPicado: 0,
    fecha: ''
  });

  // Estado para el historial
  const [historial, setHistorial] = useState([]);

  // Estado para montos acumulados
  const [montosAcumulados, setMontosAcumulados] = useState({
    totalGanado: 0,
    totalPastelesUsados: 0,
    promedioGanancia: 0
  });

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const historialGuardado = localStorage.getItem('historialRentabilidad');
    const montosGuardados = localStorage.getItem('montosAcumulados');
    
    if (historialGuardado) {
      try {
        const historialCargado = JSON.parse(historialGuardado);
        setHistorial(historialCargado);
        
        // Calcular montos acumulados desde el historial cargado
        const totalSilverGenerado = historialCargado.reduce((total, item) => total + (item.silverGenerado || 0), 0);
        const totalPastelesUsados = historialCargado.reduce((total, item) => total + (item.pastelesUsados || 0), 0);
        
        // Calcular promedio de ganancia
        const ganancias = historialCargado.map(item => item.gananciaClienteGeneral).filter(g => g > 0);
        const promedioGanancia = ganancias.length > 0 ? ganancias.reduce((sum, g) => sum + g, 0) / ganancias.length : 0;
        
        setMontosAcumulados({
          totalGanado: totalSilverGenerado,
          totalPastelesUsados,
          promedioGanancia: Math.round(promedioGanancia * 100) / 100
        });
        
        console.log('📊 Historial cargado:', {
          totalAnalisis: historialCargado.length,
          totalSilverGenerado,
          totalPastelesUsados,
          promedioGanancia
        });
      } catch (error) {
        console.error('Error cargando historial:', error);
        localStorage.removeItem('historialRentabilidad');
        localStorage.removeItem('montosAcumulados');
      }
    } else if (montosGuardados) {
      // Si no hay historial pero sí montos guardados, cargarlos
      try {
        const montosCargados = JSON.parse(montosGuardados);
        setMontosAcumulados(montosCargados);
        console.log('💰 Montos acumulados cargados:', montosCargados);
      } catch (error) {
        console.error('Error cargando montos:', error);
        localStorage.removeItem('montosAcumulados');
      }
    }
  }, []);

  // Función para analizar rentabilidad
  const analizarRentabilidad = (configuracion) => {
    console.log('🔍 Función analizarRentabilidad ejecutada');
    console.log('📊 Estado actual de configuracion:', configuracion);
    
    const costoPastel = configuracion.costoPastel || 0;
    const precioClienteGeneral = configuracion.precioClienteGeneral || 0;
    const precioSocio = configuracion.precioSocio || 0;
    
    // Usar el silver acumulado del historial actual, no solo del input
    const silverAcumuladoAnterior = Math.max(
      configuracion.silverAcumulado || 0, 
      montosAcumulados.totalGanado || 0
    );

    // Constantes de nutrición
    const NUTRICION_POR_PASTEL = 156; // Nutrición que aporta cada pastel
    
    // Calcular costo por 100 nutrición (tu fórmula correcta)
    const costoPor100Nutricion = costoPastel > 0 ? (costoPastel / NUTRICION_POR_PASTEL) * 100 : 0;
    
         // Debug: mostrar valores en consola
     console.log('Valores de entrada:', {
       costoPastel,
       precioClienteGeneral,
       precioSocio,
       NUTRICION_POR_PASTEL,
       silverAcumuladoInput: configuracion.silverAcumulado || 0,
       silverAcumuladoHistorial: montosAcumulados.totalGanado || 0,
       silverAcumuladoUsado: silverAcumuladoAnterior
     });
    
    console.log('Cálculos intermedios:', {
      costoPor100Nutricion: costoPor100Nutricion.toFixed(2)
    });
    
    // Calcular ganancias basadas en el costo por 100 nutrición
    const gananciaClienteGeneral = precioClienteGeneral - costoPor100Nutricion;
    const gananciaSocio = precioSocio - costoPor100Nutricion;
    
    console.log('Ganancias calculadas:', {
      gananciaClienteGeneral: gananciaClienteGeneral.toFixed(2),
      gananciaSocio: gananciaSocio.toFixed(2)
    });

    // Calcular ROI basado en el costo por 100 nutrición
    const roiClienteGeneral = costoPor100Nutricion > 0 ? ((gananciaClienteGeneral / costoPor100Nutricion) * 100) : 0;
    const roiSocio = costoPor100Nutricion > 0 ? ((gananciaSocio / costoPor100Nutricion) * 100) : 0;

    // Fabricación de pollos y carne
    const precioPollo = configuracion.precioPollo || 0;
    const precioCarnePollo = configuracion.precioCarnePollo || 0;
    const precioTrigo = configuracion.precioTrigo || 0;
    const precioHarina = configuracion.precioHarina || 0;

    // RECETA CORREGIDA: Fabricar 10 pasteles requiere:
    // - 8 carne de pollo
    // - 4 harinas  
    // - 2 trigos
    // - Costo de fabricación (por 10 pasteles)
    // Retorno de materiales: 15.2% de los materiales usados
    
    // CALCULAR COSTO DE CARNE DE POLLO (2 opciones):
    // Opción 1: Comprar carne directamente del mercado
    const precioCarneDirecta = precioCarnePollo;
    
    // Opción 2: Comprar pollo y picarlo (1 pollo = 21 carnes)
    const costoPolloPicado = precioPollo + (configuracion.costoPicarPollo || 0);
    const precioCarnePorPicar = costoPolloPicado / 21; // Costo por carne al picar pollo
    
    console.log('🥩 Comparación de opciones de carne:', {
      precioCarneDirecta,
      precioPollo,
      costoPicarPollo: configuracion.costoPicarPollo,
      costoPolloPicado,
      precioCarnePorPicar
    });
    
    // Usar la opción más barata para el cálculo
    // Si no hay precio de carne directa, usar picar pollo por defecto
    const precioCarneElegida = (precioCarneDirecta > 0 && precioCarneDirecta < precioCarnePorPicar) 
      ? precioCarneDirecta 
      : precioCarnePorPicar;
    
    // CALCULAR DOS COSTOS DIFERENTES DE FABRICACIÓN:
    
    // 1. Fabricar con carne directa del mercado
    const costeMaterialesPor10PastelesCarne = (precioCarneDirecta * 8) + (precioHarina * 4) + (precioTrigo * 2);
    const costeFabricacionPor10PastelesCarne = costeMaterialesPor10PastelesCarne + (configuracion.costoFabricacion || 0);
    const retornoMaterialesCarne = costeMaterialesPor10PastelesCarne * 0.152;
    const costeNetoPor10PastelesCarne = costeFabricacionPor10PastelesCarne - retornoMaterialesCarne;
    const costeFabricacionCarne = costeNetoPor10PastelesCarne / 10;
    
    // 2. Fabricar picando pollos
    const costeMaterialesPor10PastelesPollo = (precioCarnePorPicar * 8) + (precioHarina * 4) + (precioTrigo * 2);
    const costeFabricacionPor10PastelesPollo = costeMaterialesPor10PastelesPollo + (configuracion.costoFabricacion || 0);
    const retornoMaterialesPollo = costeMaterialesPor10PastelesPollo * 0.152;
    const costeNetoPor10PastelesPollo = costeFabricacionPor10PastelesPollo - retornoMaterialesPollo;
    const costeFabricacionPollo = costeNetoPor10PastelesPollo / 10;
    
    console.log('📊 Cálculo de fabricación:', {
      // Opciones de carne
      precioCarneDirecta,
      costoPolloPicado,
      precioCarnePorPicar,
      precioCarneElegida,
      // Costos por carne directa
      costeMaterialesPor10PastelesCarne,
      costeFabricacionPor10PastelesCarne,
      retornoMaterialesCarne,
      costeNetoPor10PastelesCarne,
      costePorPastelCarne: costeFabricacionCarne,
      // Costos picando pollos
      costeMaterialesPor10PastelesPollo,
      costeFabricacionPor10PastelesPollo,
      retornoMaterialesPollo,
      costeNetoPor10PastelesPollo,
      costePorPastelPollo: costeFabricacionPollo
    });
    
    // Mostrar la diferencia entre ambos métodos
    console.log('💰 Comparación de costos de fabricación:', {
      diferencia: costeFabricacionCarne - costeFabricacionPollo,
      porcentajeDiferencia: ((costeFabricacionCarne - costeFabricacionPollo) / costeFabricacionCarne * 100).toFixed(2) + '%',
      masBarato: costeFabricacionCarne < costeFabricacionPollo ? 'Carne Directa' : 'Picando Pollos'
    });

    const gananciaFabricacionPollo = costoPastel - costeFabricacionPollo;
    const gananciaFabricacionCarne = costoPastel - costeFabricacionCarne;

    const roiFabricacionPollo = costeFabricacionPollo > 0 ? ((gananciaFabricacionPollo / costeFabricacionPollo) * 100) : 0;
    const roiFabricacionCarne = costeFabricacionCarne > 0 ? ((gananciaFabricacionCarne / costeFabricacionCarne) * 100) : 0;

         // Calcular pasteles usados y silver generado
     // Solo considerar pasteles si hay silver acumulado anterior
     const pastelesUsados = silverAcumuladoAnterior > 0 ? Math.floor(silverAcumuladoAnterior / costoPastel) : 0;
     const silverGenerado = pastelesUsados * gananciaClienteGeneral;
     
     console.log('🥧 Cálculo de pasteles y silver:', {
       silverAcumuladoAnterior,
       costoPastel,
       pastelesUsados,
       gananciaClienteGeneral,
       silverGenerado
     });

    const resultado = {
      gananciaClienteGeneral: Math.round(gananciaClienteGeneral),
      gananciaSocio: Math.round(gananciaSocio),
      roiClienteGeneral: Math.round(roiClienteGeneral * 100) / 100,
      roiSocio: Math.round(roiSocio * 100) / 100,
      costeFabricacionPollo: Math.round(costeFabricacionPollo),
      costeFabricacionCarne: Math.round(costeFabricacionCarne),
      gananciaFabricacionPollo: Math.round(gananciaFabricacionPollo),
      gananciaFabricacionCarne: Math.round(gananciaFabricacionCarne),
      roiFabricacionPollo: Math.round(roiFabricacionPollo * 100) / 100,
      roiFabricacionCarne: Math.round(roiFabricacionCarne * 100) / 100,
      pastelesUsados,
      silverGenerado: Math.round(silverGenerado),
      costoPastel: costoPastel,
      costoPor100Nutricion: Math.round(costoPor100Nutricion * 100) / 100,
      nutricionPorPastel: NUTRICION_POR_PASTEL,
      // Nuevos campos para comparación de carne
      precioCarneDirecta: Math.round(precioCarneDirecta * 100) / 100,
      precioCarnePorPicar: Math.round(precioCarnePorPicar * 100) / 100,
      costoPolloPicado: Math.round(costoPolloPicado),
      fecha: new Date().toLocaleString()
    };

    console.log('📈 Resultado final del análisis:', resultado);
    
    setAnalisisActual(resultado);
    return resultado;
  };

  // Función para guardar análisis en el historial
  const guardarAnalisis = () => {
    if (!analisisActual || analisisActual.gananciaClienteGeneral === 0) {
      return { success: false, message: 'Primero debes realizar un análisis' };
    }

    // Crear un nuevo análisis con timestamp y datos completos
    const analisisParaGuardar = {
      ...analisisActual,
      id: Date.now(), // ID único para cada análisis
      timestamp: new Date().toISOString(),
      fecha: new Date().toLocaleString('es-ES')
    };

    // Agregar el nuevo análisis al historial (sin sobrescribir)
    const nuevoHistorial = [analisisParaGuardar, ...historial];
    setHistorial(nuevoHistorial);
    localStorage.setItem('historialRentabilidad', JSON.stringify(nuevoHistorial));

    // Calcular montos acumulados correctamente
    const totalSilverGenerado = nuevoHistorial.reduce((total, item) => total + (item.silverGenerado || 0), 0);
    const totalPastelesUsados = nuevoHistorial.reduce((total, item) => total + (item.pastelesUsados || 0), 0);
    
    // Calcular promedio de ganancia
    const ganancias = nuevoHistorial.map(item => item.gananciaClienteGeneral).filter(g => g > 0);
    const promedioGanancia = ganancias.length > 0 ? ganancias.reduce((sum, g) => sum + g, 0) / ganancias.length : 0;
    
    setMontosAcumulados({
      totalGanado: totalSilverGenerado,
      totalPastelesUsados,
      promedioGanancia: Math.round(promedioGanancia * 100) / 100
    });

    // Guardar también los montos acumulados en localStorage
    localStorage.setItem('montosAcumulados', JSON.stringify({
      totalGanado: totalSilverGenerado,
      totalPastelesUsados,
      promedioGanancia: Math.round(promedioGanancia * 100) / 100
    }));

    console.log('💾 Análisis guardado:', {
      analisis: analisisParaGuardar,
      totalSilverGenerado,
      totalPastelesUsados,
      promedioGanancia
    });

    return { 
      success: true, 
      message: `Análisis guardado. Total acumulado: ${totalSilverGenerado} silver`,
      totalSilverGenerado,
      totalPastelesUsados
    };
  };

  // Función para limpiar storage
  const limpiarStorage = () => {
    // Limpiar historial y montos acumulados
    localStorage.removeItem('historialRentabilidad');
    localStorage.removeItem('montosAcumulados');
    
    // Resetear estados
    setHistorial([]);
    setMontosAcumulados({
      totalGanado: 0,
      totalPastelesUsados: 0,
      promedioGanancia: 0
    });
    
    console.log('🗑️ Historial limpiado completamente');
    
    return { 
      success: true, 
      message: 'Historial de análisis y silver acumulado limpiado completamente' 
    };
  };

  return {
    analisisActual,
    historial,
    montosAcumulados,
    analizarRentabilidad,
    guardarAnalisis,
    limpiarStorage
  };
};
