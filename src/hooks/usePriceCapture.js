/**
 * Hook para recibir precios capturados en tiempo real desde el packet sniffer
 * Usa la API IPC de Electron para comunicarse con el proceso principal
 */

import { useEffect, useState, useCallback } from 'react';

export const usePriceCapture = () => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedPrices, setCapturedPrices] = useState({});
    const [captureStatus, setCaptureStatus] = useState('inactive');
    const [error, setError] = useState(null);

    // Verificar si estamos en Electron
    const isElectron = typeof window !== 'undefined' && window.electronAPI;

    // Iniciar captura
    const startCapture = useCallback(() => {
        if (!isElectron) {
            setError('Esta función solo está disponible en la versión Electron (.exe)');
            return;
        }
        
        try {
            window.electronAPI.startCapture();
        } catch (err) {
            setError(`Error iniciando captura: ${err.message}`);
        }
    }, [isElectron]);

    // Detener captura
    const stopCapture = useCallback(() => {
        if (!isElectron) return;
        
        try {
            window.electronAPI.stopCapture();
        } catch (err) {
            setError(`Error deteniendo captura: ${err.message}`);
        }
    }, [isElectron]);

    // Obtener estado
    const getStatus = useCallback(() => {
        if (!isElectron) return;
        
        try {
            window.electronAPI.getCaptureStatus();
        } catch (err) {
            setError(`Error obteniendo estado: ${err.message}`);
        }
    }, [isElectron]);

    useEffect(() => {
        if (!isElectron) {
            setError('Packet sniffing solo está disponible en la versión .exe');
            return;
        }

        // Listener para precios capturados individuales
        const handlePriceCaptured = (priceData) => {
            console.log('Precio capturado:', priceData);
            
            // Actualizar estado con el nuevo precio
            setCapturedPrices(prev => ({
                ...prev,
                [priceData.itemId]: {
                    ...prev[priceData.itemId],
                    [priceData.location]: {
                        sellPriceMin: priceData.sellPriceMin,
                        buyPriceMax: priceData.buyPriceMax,
                        timestamp: new Date(),
                        source: 'game-capture'
                    }
                }
            }));
        };

        // Listener para datos completos del mercado
        const handleMarketData = (marketData) => {
            console.log('Datos de mercado actualizados:', marketData);
            
            // Actualizar todos los precios a la vez
            setCapturedPrices(marketData);
        };

        // Listener para estado de captura
        const handleCaptureStatus = (statusData) => {
            console.log('Estado de captura:', statusData);
            setCaptureStatus(statusData.status);
            setIsCapturing(statusData.status === 'active' || statusData.status === 'started');
            
            if (statusData.message) {
                if (statusData.status === 'error') {
                    setError(statusData.message);
                } else {
                    setError(null);
                }
            }
        };

        // Registrar listeners
        window.electronAPI.onPriceCaptured(handlePriceCaptured);
        window.electronAPI.onMarketDataUpdated(handleMarketData);
        window.electronAPI.onCaptureStatus(handleCaptureStatus);

        // Obtener estado inicial
        getStatus();

        // Cleanup
        return () => {
            if (window.electronAPI) {
                window.electronAPI.removeAllListeners('price-captured');
                window.electronAPI.removeAllListeners('market-data-updated');
                window.electronAPI.removeAllListeners('price-capture-status');
            }
        };
    }, [isElectron, getStatus]);

    return {
        isCapturing,
        capturedPrices,
        captureStatus,
        error,
        startCapture,
        stopCapture,
        getStatus,
        isElectron
    };
};

