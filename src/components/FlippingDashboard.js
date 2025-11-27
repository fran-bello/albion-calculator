'use client';

import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Checkbox } from 'primereact/checkbox';
import { getCurrentPrices, getBulkSalesHistory } from '../services/albionApi';
import { ITEM_CATEGORIES, CITIES } from '../config/flippingItems';

const CATEGORY_ICONS = {
    'Recursos Refinados': 'T4_METALBAR',
    'Comidas': 'T8_MEAL_STEW',
    'Pociones': 'T6_POTION_HEAL',
    'Bolsas y Capas': 'T4_BAG',
    'Monturas': 'T4_MOUNT_HORSE',
    'Facción (Corazones)': 'T2_ROCK_HEART',
    'Armaduras (Plate)': 'T4_ARMOR_PLATE_SET1',
    'Chaquetas (Leather)': 'T4_ARMOR_LEATHER_SET1',
    'Túnicas (Cloth)': 'T4_ARMOR_CLOTH_SET1',
    'Botas y Zapatos': 'T4_SHOES_PLATE_SET1',
    'Cascos y Capuchas': 'T4_HEAD_PLATE_SET1',
    'Armas - Espadas': 'T4_MAIN_SWORD',
    'Armas - Dagas': 'T4_MAIN_DAGGER',
    'Armas - Arcos': 'T4_2H_BOW',
    'Armas - Ballestas': 'T4_2H_CROSSBOW',
    'Armas - Varitas de Fuego': 'T4_MAIN_FIRESTAFF',
    'Armas - Varitas de Escarcha': 'T4_MAIN_FROSTSTAFF',
    'Armas - Varitas Arcanas y Sagradas': 'T4_MAIN_ARCANESTAFF',
    'Armas - Varitas de Naturaleza y Malditas': 'T4_MAIN_NATURESTAFF',
    'Armas - Mazas y Martillos': 'T4_MAIN_MACE',
    'Armas - Lanzas y Hachas': 'T4_MAIN_AXE'
};

export default function FlippingDashboard() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    // Checks desactivados por defecto
    const [isPremium, setIsPremium] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [includeCaerleon, setIncludeCaerleon] = useState(false);
    const toast = useRef(null);

    const TAX_RATE = isPremium ? 0.04 : 0.08;
    const SETUP_FEE = 0.025;

    // Función para analizar todas las categorías automáticamente
    const analyzeAllCategories = async () => {
        setLoading(true);
        setProgress(0);
        setOpportunities([]);
        setSelectedCategory('all');
        
        const allCandidates = [];
        const categories = Object.keys(ITEM_CATEGORIES);
        const totalCategories = categories.length;
        let completedCategories = 0;
        
        try {
            console.log('Iniciando análisis global de mercado...');
            
            // Procesar categorías en lotes para no saturar la API ni bloquear la UI
            // Lote de 3 en 3
            const batchSize = 3;
            
            for (let i = 0; i < categories.length; i += batchSize) {
                const batch = categories.slice(i, i + batchSize);
                
                const promises = batch.map(async (categoryName) => {
                    try {
                        const itemsToAnalyze = ITEM_CATEGORIES[categoryName];
                        const itemIds = itemsToAnalyze.map(i => i.id);
                        const activeCities = includeCaerleon ? CITIES : CITIES.filter(c => c.value !== 'Caerleon');
                        const cityNames = activeCities.map(c => c.value);
                        
                        // 1. Obtener precios
                        const prices = await getCurrentPrices(itemIds, cityNames);
                        if (!prices || prices.length === 0) return [];
                        
                        // 2. Obtener historial (Optimización: Solo si hay precios)
                        const volumeMap = await getBulkSalesHistory(itemIds, cityNames);
                        
                        const categoryCandidates = [];
                        const pricesByItem = {};
                        
                        prices.forEach(p => {
                            if (!pricesByItem[p.item_id]) pricesByItem[p.item_id] = [];
                            pricesByItem[p.item_id].push(p);
                        });
                        
                        for (const itemId of Object.keys(pricesByItem)) {
                            const itemPrices = pricesByItem[itemId];
                            const itemConfig = itemsToAnalyze.find(i => i.id === itemId);
                            
                            for (const source of itemPrices) {
                                if (source.sell_price_min <= 0) continue;
                                
                                const sourceDate = new Date(source.sell_price_min_date);
                                if ((new Date() - sourceDate) / (1000 * 60 * 60) > 24) continue;
                                
                                for (const dest of itemPrices) {
                                    if (source.city === dest.city) continue;
                                    if (dest.sell_price_min <= 0) continue;
                                    
                                    const buyPrice = source.sell_price_min;
                                    const sellPrice = dest.sell_price_min - 1;
                                    
                                    // Filtros básicos de validez (sin cálculos complejos aun)
                                    if (sellPrice <= buyPrice) continue;

                                    const sellingTax = sellPrice * TAX_RATE;
                                    const setupFee = sellPrice * SETUP_FEE;
                                    const totalCost = buyPrice + sellingTax + setupFee;
                                    const profit = sellPrice - totalCost;
                                    const margin = (profit / totalCost) * 100;
                                    
                                    // Filtros de seguridad
                                    if (margin > 300) continue;
                                    if (dest.buy_price_max > 0) {
                                        const spread = (dest.sell_price_min - dest.buy_price_max) / dest.buy_price_max;
                                        if (spread > 3) continue;
                                    }
                                    
                                    const destAvgPrice = volumeMap[itemId]?.[dest.city]?.avgPrice || 0;
                                    let safeSellPrice = sellPrice;
                                    if (destAvgPrice > 0 && sellPrice > destAvgPrice * 1.2) {
                                        safeSellPrice = destAvgPrice;
                                    }
                                    
                                    const safeSellingTax = safeSellPrice * TAX_RATE;
                                    const safeSetupFee = safeSellPrice * SETUP_FEE;
                                    const safeTotalCost = buyPrice + safeSellingTax + safeSetupFee;
                                    const safeProfit = safeSellPrice - safeTotalCost;
                                    const safeMargin = (safeProfit / safeTotalCost) * 100;
                                    
                                    if (safeProfit > 500 && safeMargin > 5) {
                                        const destVolume = volumeMap[itemId]?.[dest.city]?.dailyVolume || 0;
                                        
                                        // Mínimo de ventas más estricto para el análisis global (evitar liquidez baja)
                                        if (destVolume < 25) continue; 

                                        // SCORING ALGORITHM MEJORADO
                                        // Usamos Raíz Cuadrada para dar más peso al volumen que el Logaritmo
                                        // Profit 100k, Vol 10 -> 100k * 3.16 = 316k
                                        // Profit 50k, Vol 50 -> 50k * 7.07 = 353k (Gana el de mayor volumen aunque tenga mitad de profit)
                                        const score = safeProfit * Math.sqrt(destVolume);
                                        
                                        categoryCandidates.push({
                                            id: `${itemId}-${source.city}-${dest.city}`,
                                            itemId,
                                            itemName: itemConfig?.name || itemId,
                                            sourceCity: source.city,
                                            destCity: dest.city,
                                            buyPrice,
                                            sellPrice: safeSellPrice,
                                            profit: safeProfit,
                                            margin: safeMargin,
                                            dailyVolume: destVolume,
                                            volumeAnalysis: destVolume > 100 ? 'High' : destVolume > 40 ? 'Medium' : 'Low',
                                            isPriceAdjusted: safeSellPrice < sellPrice,
                                            score: score
                                        });
                                    }
                                }
                            }
                        }
                        return categoryCandidates;

                    } catch (err) {
                        console.error(`Error analizando categoría ${categoryName}:`, err);
                        return [];
                    }
                });
                
                const batchResults = await Promise.all(promises);
                batchResults.forEach(res => allCandidates.push(...res));
                
                completedCategories += batch.length;
                const newProgress = Math.round((completedCategories / totalCategories) * 100);
                setProgress(newProgress);
            }
            
            // Deduplicar: Si un item aparece múltiples veces (diferentes rutas), 
            // quedarse solo con la mejor opción según el Score.
            const uniqueItemsMap = new Map();
            allCandidates.forEach(c => {
                // Si no existe o el nuevo tiene mejor score, lo guardamos
                if (!uniqueItemsMap.has(c.itemId) || c.score > uniqueItemsMap.get(c.itemId).score) {
                    uniqueItemsMap.set(c.itemId, c);
                }
            });
            const uniqueCandidates = Array.from(uniqueItemsMap.values());

            // Ordenar por Score
            uniqueCandidates.sort((a, b) => b.score - a.score);
            
            // Top 10
            const top10 = uniqueCandidates.slice(0, 10);
            setOpportunities(top10);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Análisis Global Completado', 
                detail: `Se encontraron las 10 mejores oportunidades de todo el mercado.` 
            });

        } catch (error) {
            console.error('Error en análisis global:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falló el análisis global.' });
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    const analyzeMarket = async (categoryName) => {
        console.log('Button clicked for category:', categoryName); // Debug log
        
        // Verificar que categoryName existe
        if (!categoryName) {
            console.error('Category name is missing!');
            return;
        }
        
        setLoading(true);
        setSelectedCategory(categoryName);
        setProgress(0);
        setOpportunities([]);

        try {
            // Seleccionar items según la categoría
            const itemsToAnalyze = ITEM_CATEGORIES[categoryName];
            if (!itemsToAnalyze) throw new Error('Categoría no válida');

            const itemIds = itemsToAnalyze.map(i => i.id);
            // Filtrar Caerleon si no está activo
            const activeCities = includeCaerleon ? CITIES : CITIES.filter(c => c.value !== 'Caerleon');
            const cityNames = activeCities.map(c => c.value);

            // 1. Obtener precios actuales
            console.log(`Consultando precios para ${categoryName}...`);
            const prices = await getCurrentPrices(itemIds, cityNames);
            setProgress(30);

            if (!prices || prices.length === 0) throw new Error('No se recibieron precios');

            // 2. Obtener historial de volumen (Bulk)
            console.log(`Consultando historial de volumen masivo...`);
            const volumeMap = await getBulkSalesHistory(itemIds, cityNames);
            setProgress(50);

            // 3. Procesar y encontrar arbitrajes
            const candidates = [];
            const pricesByItem = {};
            
            // Mapeo para agrupar oportunidades: "itemId-sourceCity-destCity" -> Opportunity
            const uniqueOpportunities = new Map();

            prices.forEach(p => {
                if (!pricesByItem[p.item_id]) pricesByItem[p.item_id] = [];
                pricesByItem[p.item_id].push(p);
            });

            for (const itemId of Object.keys(pricesByItem)) {
                const itemPrices = pricesByItem[itemId];
                const itemConfig = itemsToAnalyze.find(i => i.id === itemId);

                for (const source of itemPrices) {
                    if (source.sell_price_min <= 0) continue;

                    const sourceDate = new Date(source.sell_price_min_date);
                    const hoursDiffSource = (new Date() - sourceDate) / (1000 * 60 * 60);
                    if (hoursDiffSource > 24) continue;

                    for (const dest of itemPrices) {
                        if (source.city === dest.city) continue;
                        if (dest.sell_price_min <= 0) continue;

                        const buyPrice = source.sell_price_min;
                        const sellPrice = dest.sell_price_min - 1;

                        const sellingTax = sellPrice * TAX_RATE;
                        const setupFee = sellPrice * SETUP_FEE;
                        const totalCost = buyPrice + sellingTax + setupFee;
                        const profit = sellPrice - totalCost;
                        const margin = (profit / totalCost) * 100;

                        // 1. FILTRO: Margen absurdo (Anti-Scam / Manipulación)
                        // Si el margen es > 300%, es muy probable que sea precio manipulado o error de dato.
                        if (margin > 300) continue;

                        // 2. FILTRO: Spread Check en Destino
                        // Si hay orden de compra (buy_price_max > 0), el precio de venta (sell_price_min) no debería ser astronómicamente mayor.
                        // Ejemplo Scam: Sell Order 5M, Buy Order 4k. Spread gigante.
                        if (dest.buy_price_max > 0) {
                            const spread = (dest.sell_price_min - dest.buy_price_max) / dest.buy_price_max;
                            // Si el precio de venta es más de 3 veces la orden de compra (200% spread), es sospechoso.
                            if (spread > 3) continue; 
                        }

                        // 3. FILTRO: Precio de Venta Seguro (Anti-Outlier)
                        // Validar que el precio al que queremos vender no esté muy lejos del promedio histórico real.
                        // Si quiero vender a 4000, pero el promedio histórico es 2000, es arriesgado.
                        const destAvgPrice = volumeMap[itemId]?.[dest.city]?.avgPrice || 0;
                        
                        // Definimos un "Precio de Venta Seguro"
                        // Si el precio promedio existe y es menor que nuestro precio objetivo, usamos el promedio para ser conservadores.
                        // Permitimos un 20% de sobreprecio sobre el promedio por fluctuaciones normales.
                        let safeSellPrice = sellPrice;
                        if (destAvgPrice > 0 && sellPrice > destAvgPrice * 1.2) {
                            // Si el precio de venta actual es > 20% del promedio, calculamos la ganancia con el precio promedio (más realista)
                            safeSellPrice = destAvgPrice;
                        }

                        // Recalcular profit con el precio seguro
                        const safeSellingTax = safeSellPrice * TAX_RATE;
                        const safeSetupFee = safeSellPrice * SETUP_FEE;
                        const safeTotalCost = buyPrice + safeSellingTax + safeSetupFee;
                        const safeProfit = safeSellPrice - safeTotalCost;
                        const safeMargin = (safeProfit / safeTotalCost) * 100;

                        if (safeProfit > 500 && safeMargin > 5) {
                            // Verificar volumen usando el mapa precargado
                            const destVolume = volumeMap[itemId]?.[dest.city]?.dailyVolume || 0;
                            
                            // FILTRO: Liquidez mínima (15 ventas/día)
                            if (destVolume < 15) continue;

                            const volumeAnalysis = destVolume > 100 ? 'High' : 'Medium';

                            // Clave única para agrupar
                            const key = `${itemId}-${source.city}-${dest.city}`;
                            
                            if (!uniqueOpportunities.has(key)) {
                                uniqueOpportunities.set(key, {
                                    id: key,
                                    itemId,
                                    itemName: itemConfig?.name || itemId,
                                    sourceCity: source.city,
                                    destCity: dest.city,
                                    buyPrice,
                                    sellPrice: safeSellPrice, // Mostramos el precio "Seguro"
                                    profit: safeProfit,
                                    margin: safeMargin,
                                    dailyVolume: destVolume,
                                    volumeAnalysis,
                                    isPriceAdjusted: safeSellPrice < sellPrice // Flag para indicar que ajustamos el precio
                                });
                            }
                        }
                    }
                }
            }

            candidates.push(...uniqueOpportunities.values());
            candidates.sort((a, b) => b.profit - a.profit);
            setOpportunities(candidates);
            
            toast.current.show({ 
                severity: 'success', 
                summary: 'Análisis Completo', 
                detail: `Se encontraron ${candidates.length} oportunidades en ${categoryName}.` 
            });

        } catch (error) {
            console.error('Error en analyzeMarket:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error de Análisis', 
                detail: error.message || 'Falló la conexión con la API de Albion Data.' 
            });
        } finally {
            setLoading(false);
            setProgress(100);
            // No reset category here to keep button selected
        }
    };

    // Templates para la tabla
    const itemTemplate = (rowData) => {
        const imageUrl = `https://render.albiononline.com/v1/item/${rowData.itemId}.png?quality=1&size=48`;
        return (
            <div className="flex align-items-center gap-2">
                <img src={imageUrl} alt={rowData.itemName} style={{ width: '48px', height: '48px' }} />
                <span>{rowData.itemName}</span>
            </div>
        );
    };

    const priceTemplate = (rowData, field) => {
        return (
            <div className="flex flex-column">
                <span>{new Intl.NumberFormat('en-US').format(rowData[field])}</span>
                {field === 'sellPrice' && rowData.isPriceAdjusted && (
                    <small className="text-xs text-primary">(Ajustado al Promedio)</small>
                )}
            </div>
        );
    };

    const profitTemplate = (rowData) => {
        return <span className={rowData.profit > 0 ? 'text-success fw-bold' : 'text-danger'}>
            {new Intl.NumberFormat('en-US').format(Math.round(rowData.profit))}
        </span>;
    };

    const marginTemplate = (rowData) => {
        return <Tag severity={rowData.margin > 20 ? 'success' : 'warning'} value={`${rowData.margin.toFixed(1)}%`} />;
    };

    const volumeTemplate = (rowData) => {
        return (
            <div className="d-flex flex-column">
                <Tag severity={rowData.volumeAnalysis === 'High' ? 'success' : 'danger'} value={rowData.volumeAnalysis} />
                <small className="text-muted text-center">{rowData.dailyVolume} / día</small>
            </div>
        );
    };

    // Test de interacción básica
    const handleTestClick = () => {
        console.log('Test button clicked!');
        alert('Los eventos funcionan correctamente!');
    };

    return (
        <div className="card mt-4">
            <Toast ref={toast} />
            
            <Card title="Smart Market Flipping" subTitle="Análisis de Arbitraje con Verificación de Liquidez">
                
                {/* Botón de prueba */}
                <div className="mb-3">
                    <Button 
                        label="Test de Interactividad" 
                        onClick={handleTestClick}
                        className="p-button-outlined p-button-secondary"
                    />
                </div>
                
                    {/* Botón de Análisis Global */}
                    <div className="mb-4">
                         <Button 
                            label="Analizar TODO el Mercado (Top 10)" 
                            icon="pi pi-search-plus"
                            onClick={analyzeAllCategories}
                            disabled={loading}
                            className="p-button-raised p-button-success w-full p-3 text-lg font-bold"
                        />
                         <small className="block mt-2 text-center text-muted">
                            Escanea todas las categorías y busca el mejor balance entre ganancia y velocidad de venta.
                        </small>
                    </div>

                    <div className="flex flex-column gap-3 mb-4">
                    {/* Botones de Categoría Rediseñados */}
                    <div className="flex flex-wrap gap-2" style={{ flexDirection: 'row' }}>
                        {Object.keys(ITEM_CATEGORIES).map(category => {
                            const handleCategoryClick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Category button clicked:', category);
                                analyzeMarket(category);
                            };
                            
                            return (
                            <Button 
                                key={category}
                                onClick={handleCategoryClick}
                                disabled={loading}
                                className={`
                                    p-button-text
                                    flex align-items-center gap-2 p-2 border-1 border-round cursor-pointer transition-colors
                                    ${selectedCategory === category 
                                        ? 'bg-primary-50 border-primary text-primary' 
                                        : 'bg-transparent border-300 text-color hover:surface-100'
                                    }
                                `}
                                style={{ display: 'flex', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}
                            >
                                <img 
                                    src={`https://render.albiononline.com/v1/item/${CATEGORY_ICONS[category]}.png?quality=1&size=40`}
                                    onError={(e) => e.target.src = 'https://render.albiononline.com/v1/item/T4_BAG.png?quality=1&size=40'}
                                    alt={category}
                                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                />
                                <span className="font-medium text-sm">{category}</span>
                                {loading && selectedCategory === category && <i className="pi pi-spin pi-spinner ml-auto text-sm"></i>}
                            </Button>
                            );
                        })}
                    </div>
                    
                    <div className="flex align-items-center gap-4" style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                        <div 
                            className="checkbox-wrapper" 
                            onClick={() => setIsPremium(!isPremium)}
                        >
                            <Checkbox 
                                inputId="premium-checkbox"
                                checked={isPremium}
                                readOnly
                                style={{ pointerEvents: 'none' }} // Evitar doble evento
                            />
                            <label 
                                htmlFor="premium-checkbox" 
                                className="checkbox-label"
                                style={{ pointerEvents: 'none' }} // Dejar que el div maneje el clic
                            >
                                {isPremium ? 'Premium Activo (4% Tax)' : 'Sin Premium (8% Tax)'}
                            </label>
                        </div>

                        <div 
                            className="checkbox-wrapper"
                            onClick={() => setIncludeCaerleon(!includeCaerleon)}
                        >
                            <Checkbox 
                                inputId="caerleon-checkbox"
                                checked={includeCaerleon}
                                readOnly
                                style={{ pointerEvents: 'none' }}
                            />
                            <label 
                                htmlFor="caerleon-checkbox" 
                                className="checkbox-label"
                                style={{ pointerEvents: 'none' }}
                            >
                                {includeCaerleon ? 'Caerleon Incluido (Riesgo)' : 'Caerleon Excluido (Seguro)'}
                            </label>
                        </div>
                    </div>
                </div>

                {loading && <ProgressBar value={progress} className="mb-4" />}

                <DataTable value={opportunities} paginator rows={10} sortField="profit" sortOrder={-1} responsiveLayout="scroll">
                    <Column field="itemName" header="Item" body={itemTemplate} sortable></Column>
                    <Column field="sourceCity" header="Comprar en" sortable></Column>
                    <Column field="destCity" header="Vender en" sortable></Column>
                    <Column field="buyPrice" header="Precio Compra" body={(r) => priceTemplate(r, 'buyPrice')} sortable></Column>
                    <Column field="sellPrice" header="Precio Venta" body={(r) => priceTemplate(r, 'sellPrice')} sortable></Column>
                    <Column field="dailyVolume" header="Liquidez (Destino)" body={volumeTemplate} sortable></Column>
                    <Column field="profit" header="Ganancia Est." body={profitTemplate} sortable></Column>
                    <Column field="score" header="Score" body={(r) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(r.score)} sortable></Column>
                    <Column field="margin" header="Margen %" body={marginTemplate} sortable></Column>
                </DataTable>

                <div className="mt-3">
                    <small className="text-muted">
                        * Los cálculos incluyen Tasa de Mercado ({isPremium ? '4%' : '8%'}) y Setup Fee (2.5%).
                        Solo se muestran oportunidades con datos recientes (menos de 24h) y liquidez &gt; 15/día.
                    </small>
                </div>
            </Card>
        </div>
    );
}

