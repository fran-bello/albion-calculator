const { app, BrowserWindow } = require('electron');
const path = require('path');
const PriceCaptureService = require('./services/PriceCaptureService');

let mainWindow;
let priceCaptureService;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true, // Mejor seguridad
            webSecurity: false, // Útil para evitar problemas de CORS en desarrollo local con APIs externas
            enableRemoteModule: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js') // Script para exponer IPC de forma segura
        }
    });

    // En desarrollo, cargar localhost. En producción, cargar index.html estático.
    const isDev = !app.isPackaged;
    const startUrl = isDev 
        ? 'http://localhost:3000' 
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(startUrl);

    // Inicializar servicio de captura de precios
    priceCaptureService = new PriceCaptureService(mainWindow);

    // Esperar a que la página cargue completamente antes de abrir DevTools
    mainWindow.webContents.once('did-finish-load', () => {
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
        priceCaptureService = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

