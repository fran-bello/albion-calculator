# 🥧 Albion Online - Calculadora de Rentabilidad de Pasteles

Una aplicación web moderna para calcular la rentabilidad de la fabricación de pasteles de pollo en Albion Online, con análisis de costos, precios del mercado y seguimiento de ganancias.

## ✨ Características Principales

- **📊 Análisis de Rentabilidad**: Cálculo automático de ganancias y ROI
- **🏪 Precios del Mercado**: Consulta en tiempo real de precios de materiales
- **💰 Seguimiento de Ganancias**: Historial de análisis y acumulación de silver
- **🌙 Tema Claro/Oscuro**: Interfaz adaptable con cambio de tema
- **📱 Responsive Design**: Optimizado para móviles y escritorio
- **🏙️ Múltiples Ciudades**: Soporte para todas las ciudades de Albion Online

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18
- **UI Components**: PrimeReact, Bootstrap 5
- **Styling**: CSS Modules, CSS Variables
- **State Management**: React Hooks, Context API
- **API**: Albion Online Data API
- **Deployment**: Vercel

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/albion-app.git
cd albion-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# No se requieren variables de entorno para el funcionamiento básico
# La aplicación usa APIs públicas de Albion Online
```

## 📱 Funcionalidades

### 1. **Configuración de la Tienda**
- Costo del pastel de pollo
- Precios para clientes generales y socios
- Silver acumulado en la tienda

### 2. **Configuración de Fabricación**
- Precios de materiales (pollo, carne, trigo, harina)
- Costos de picar pollo y cocina
- Comparación de métodos de fabricación

### 3. **Análisis de Rentabilidad**
- Cálculo automático de ganancias por pastel
- ROI (Retorno de Inversión) para diferentes tipos de cliente
- Comparación de métodos de fabricación (picar pollos vs carne directa)

### 4. **Precios del Mercado**
- Consulta automática de precios en tiempo real
- Historial de 24 horas de precios
- Aplicación masiva de precios (mínimos, máximos, promedios)

### 5. **Seguimiento y Historial**
- Guardado de análisis en localStorage
- Acumulación de silver generado
- Historial de pasteles usados

## 🎨 Temas y Personalización

La aplicación incluye dos temas:
- **🌞 Tema Claro**: Fondo blanco con elementos grises claros
- **🌙 Tema Oscuro**: Fondo azul oscuro (#112731) con tarjetas azul medio (#06334b)

## 📊 API de Albion Online

La aplicación utiliza la API oficial de Albion Online para obtener precios del mercado:
- **Endpoint**: `https://west.albion-online-data.com/api/v2/stats/history/`
- **Datos**: Historial de 24 horas de precios
- **Ciudades**: Todas las ciudades disponibles en el juego

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El build y deployment serán automáticos

### Otros Servicios
- **Netlify**: Soporte completo para Next.js
- **Railway**: Opción gratuita disponible
- **Render**: Hosting gratuito para aplicaciones web

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Albion Online**: Por crear un juego increíble
- **Albion Online Data**: Por proporcionar la API de precios
- **Next.js Team**: Por el framework React
- **PrimeReact**: Por los componentes UI de alta calidad

## 📞 Contacto

- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **Proyecto**: [Albion App](https://github.com/tu-usuario/albion-app)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
