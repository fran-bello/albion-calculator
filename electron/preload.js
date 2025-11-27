/**
 * Preload script - Expone APIs de IPC de forma segura al renderer process
 * Este script se ejecuta en el contexto del renderer pero tiene acceso a Node.js APIs
 */

const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs de forma segura
contextBridge.exposeInMainWorld('electronAPI', {
    // Precio capturado en tiempo real
    onPriceCaptured: (callback) => {
        ipcRenderer.on('price-captured', (event, data) => callback(data));
    },
    
    // Datos de mercado actualizados
    onMarketDataUpdated: (callback) => {
        ipcRenderer.on('market-data-updated', (event, data) => callback(data));
    },
    
    // Estado de captura
    onCaptureStatus: (callback) => {
        ipcRenderer.on('price-capture-status', (event, data) => callback(data));
    },
    
    // Comandos para controlar la captura
    startCapture: () => ipcRenderer.send('start-price-capture'),
    stopCapture: () => ipcRenderer.send('stop-price-capture'),
    getCaptureStatus: () => ipcRenderer.send('get-capture-status'),
    
    // Limpiar listeners
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});

