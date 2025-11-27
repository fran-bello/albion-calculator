/**
 * Servicio para interactuar con la API de Albion Online Data Project
 * Documentación: https://www.albion-online-data.com/api/swagger/index.html
 * 
 * Servidores:
 * - West (America): https://west.albion-online-data.com/api/v2/stats
 * - East (Asia): https://east.albion-online-data.com/api/v2/stats
 * - Europe: https://europe.albion-online-data.com/api/v2/stats
 */

// Configuración por defecto: Servidor Americano (West)
const BASE_URL = 'https://west.albion-online-data.com/api/v2/stats';

/**
 * Obtiene los precios actuales (órdenes de compra y venta) para una lista de items y ciudades
 * @param {string[]} itemIds - Array de IDs de items (ej: ['T4_BAG', 'T5_BAG'])
 * @param {string[]} locations - Array de ciudades (ej: ['Martlock', 'Thetford'])
 * @param {number} qualities - Calidad de los items (opcional, defecto 1)
 */
export const getCurrentPrices = async (itemIds, locations) => {
  const itemsString = itemIds.join(',');
  const locationsString = locations.join(',');
  
  // Construimos la URL
  // Endpoint: /prices/{itemList}?locations={locationList}&qualities={qualities}
  const url = `${BASE_URL}/prices/${itemsString}?locations=${locationsString}`;

  console.log('API Request (Prices):', url);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching prices: ${response.status}`);
    const data = await response.json();
    console.log('Prices data received:', data);
    return data;
  } catch (error) {
    console.error('Error en getCurrentPrices:', error);
    return [];
  }
};

/**
 * Obtiene el historial de ventas (volumen) para múltiples items y ciudades en una sola petición.
 * @param {string[]} itemIds - Array de IDs de items
 * @param {string[]} locations - Array de ciudades
 * @param {number} timeScale - Escala de tiempo (24, 6, 1, etc.)
 */
export const getBulkSalesHistory = async (itemIds, locations, timeScale = 24) => {
  const itemsString = itemIds.join(',');
  const locationsString = locations.join(',');
  
  const url = `${BASE_URL}/history/${itemsString}?locations=${locationsString}&time-scale=${timeScale}`;
  console.log('API Request (History):', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching history: ${response.status}`);
    const data = await response.json();
    
    // Transformar array plano en un mapa para búsqueda rápida: map[itemId][location] = dailyVolume
    const volumeMap = {};
    
    if (Array.isArray(data)) {
        data.forEach(entry => {
            if (!volumeMap[entry.item_id]) volumeMap[entry.item_id] = {};
            
            // Sumar item_count de los datos disponibles
            // La API devuelve un array 'data' con timestamps. Sumamos todo el volumen del periodo.
            let totalVolume = 0;
            let weightedPriceSum = 0;
            let totalItemsForAvg = 0;

            if (entry.data && Array.isArray(entry.data)) {
                entry.data.forEach(record => {
                    totalVolume += record.item_count;
                    weightedPriceSum += (record.avg_price * record.item_count);
                    totalItemsForAvg += record.item_count;
                });
            }
            
            // Calcular precio promedio ponderado real
            const avgPrice = totalItemsForAvg > 0 ? Math.round(weightedPriceSum / totalItemsForAvg) : 0;

            volumeMap[entry.item_id][entry.location] = {
                dailyVolume: totalVolume,
                avgPrice: avgPrice
            };
        });
    }
    
    return volumeMap;

  } catch (error) {
    console.error(`Error en getBulkSalesHistory:`, error);
    return {};
  }
};

/**
 * @deprecated Usar getBulkSalesHistory para eficiencia.
 */
export const getSalesHistory = async (itemId, location, timeScale = 24) => {
    // Wrapper para mantener compatibilidad si es necesario, pero idealmente no usar en bucles.
    const map = await getBulkSalesHistory([itemId], [location], timeScale);
    return {
        location,
        itemId,
        dailyVolume: map[itemId]?.[location] || 0
    };
};
