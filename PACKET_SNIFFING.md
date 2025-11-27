# Implementación de Packet Sniffing para Captura de Precios en Tiempo Real

## Estado Actual

La estructura base está creada y lista para recibir datos de precios capturados:
- ✅ Sistema IPC configurado entre proceso principal y renderer
- ✅ Hook React (`usePriceCapture`) para recibir precios en la UI
- ✅ Servicio de captura (`PriceCaptureService`) preparado para integrar packet sniffer
- ❌ **Packet sniffing aún no implementado** (requiere herramientas nativas)

## Prerrequisitos

### 1. Instalar Npcap
- Descargar desde: https://npcap.com/
- Instalar la versión más reciente
- **Importante**: Durante la instalación, marcar la opción "Install Npcap in WinPcap API-compatible Mode" si está disponible

### 2. Visual Studio Build Tools (para compilar librerías nativas)
- Descargar desde: https://visualstudio.microsoft.com/downloads/
- Instalar "Desktop development with C++" workload
- O usar Visual Studio Build Tools standalone

## Opciones de Implementación

### Opción 1: Usar librería `pcap` (Recomendada)

```bash
npm install pcap --save
```

Esta librería requiere compilación nativa. Después de instalar Npcap y Build Tools, debería compilar automáticamente.

### Opción 2: Usar `node-cap` (Alternativa)

```bash
npm install cap --save
```

Similar a pcap pero con mejor soporte para Windows.

### Opción 3: Usar un proceso externo

Si las librerías nativas dan problemas, puedes crear un pequeño programa en C# (como hace el proyecto original) que capture los paquetes y los envíe a tu app Electron vía socket/pipe.

## Pasos para Completar la Implementación

### 1. Instalar la librería de captura

Una vez tengas Npcap y Build Tools instalados:

```bash
npm install pcap --save
# o
npm install cap --save
```

### 2. Implementar el Packet Sniffer

Edita `electron/services/PriceCaptureService.js` y completa el método de captura.

### 3. Decodificar Paquetes de Photon

Los paquetes de Albion Online usan **Photon Engine** y están serializados. Necesitarás analizar el tráfico con Wireshark.

### 4. Identificar Puertos y Protocolos

Albion Online usa:
- **UDP** para comunicación en tiempo real
- Puerto típico: `5056` (puede variar según servidor)
- Protocolo: Photon Engine con serialización binaria

## Nota de Seguridad

Esta implementación es de **solo lectura** (pasiva). No modifica el tráfico ni envía datos al servidor. Es similar a lo que hace el Albion Data Client oficial.

