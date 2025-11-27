/**
 * Sistema de IPC para comunicar precios capturados desde el proceso principal (packet sniffing)
 * hacia el renderer process (UI de React).
 * 
 * NOTA: Para que esto funcione completamente, necesitas:
 * 1. Instalar Npcap: https://npcap.com/
 * 2. Implementar el packet sniffer en electron/main.js usando una librería compatible
 * 3. Decodificar los paquetes de Photon Engine que usa Albion Online
 * 
 * Por ahora, este sistema está preparado para recibir datos cuando esté implementado.
 */

const { ipcMain } = require('electron');

class PriceCaptureService {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.isCapturing = false;
        this.setupIPC();
    }

    setupIPC() {
        // Handler para iniciar la captura
        ipcMain.on('start-price-capture', async (event) => {
            try {
                this.isCapturing = true;
                // TODO: Iniciar packet sniffing aquí
                console.log('Price capture iniciado (pendiente de implementación)');
                event.reply('price-capture-status', { 
                    status: 'started', 
                    message: 'Packet sniffing no está completamente implementado. Necesitas instalar Npcap y completar la implementación.' 
                });
            } catch (error) {
                console.error('Error iniciando captura:', error);
                event.reply('price-capture-status', { 
                    status: 'error', 
                    message: error.message 
                });
            }
        });

        // Handler para detener la captura
        ipcMain.on('stop-price-capture', (event) => {
            this.isCapturing = false;
            // TODO: Detener packet sniffing aquí
            console.log('Price capture detenido');
            event.reply('price-capture-status', { status: 'stopped' });
        });

        // Handler para verificar estado
        ipcMain.on('get-capture-status', (event) => {
            event.reply('price-capture-status', { 
                status: this.isCapturing ? 'active' : 'inactive',
                message: this.isCapturing ? 'Capturando...' : 'Detenido'
            });
        });
    }

    /**
     * Método para enviar precios capturados a la UI
     * Debe ser llamado desde el código de packet sniffing cuando se detecten precios
     */
    sendCapturedPrice(priceData) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('price-captured', priceData);
        }
    }

    /**
     * Método para enviar precios masivos (cuando se abre el mercado completo)
     */
    sendMarketData(marketData) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('market-data-updated', marketData);
        }
    }
}

module.exports = PriceCaptureService;

