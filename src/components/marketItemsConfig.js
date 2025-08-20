/**
 * Configuración centralizada de items del mercado de Albion Online
 * Este archivo contiene toda la información necesaria para renderizar
 * las filas de la tabla de precios del mercado
 */

export const marketItems = [
  {
    id: 'T3_MEAL_PIE',
    name: 'Pastel de Pollo',
    code: 'T3_MEAL_PIE',
    configKey: 'costoPastel',
    description: 'Pastel de pollo tier 3'
  },
  {
    id: 'T3_FARM_CHICKEN_GROWN',
    name: 'Pollo',
    code: 'T3_FARM_CHICKEN_GROWN',
    configKey: 'precioPollo',
    description: 'Pollo tier 3'
  },
  {
    id: 'T3_MEAT',
    name: 'Carne de Pollo',
    code: 'T3_MEAT',
    configKey: 'precioCarnePollo',
    description: 'Carne de pollo tier 3'
  },
  {
    id: 'T3_WHEAT',
    name: 'Trigo',
    code: 'T3_WHEAT',
    configKey: 'precioTrigo',
    description: 'Trigo tier 3'
  },
  {
    id: 'T3_FLOUR',
    name: 'Harina',
    code: 'T3_FLOUR',
    configKey: 'precioHarina',
    description: 'Harina tier 3'
  }
];

/**
 * Función helper para obtener la URL de la imagen de un item
 * @param {string} itemId - ID del item
 * @param {number} quality - Calidad del item (por defecto 1)
 * @param {number} size - Tamaño de la imagen (por defecto 32)
 * @returns {string} URL de la imagen
 */
export const getItemImageUrl = (itemId, quality = 1, size = 32) => {
  return `https://render.albiononline.com/v1/item/${itemId}.png?quality=${quality}&size=${size}`;
};

/**
 * Función helper para obtener el item por su clave de configuración
 * @param {string} configKey - Clave de configuración
 * @returns {Object|null} Item encontrado o null
 */
export const getItemByConfigKey = (configKey) => {
  return marketItems.find(item => item.configKey === configKey) || null;
};
