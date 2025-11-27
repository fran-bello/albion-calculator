/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // Optimizaciones para Electron
    reactStrictMode: false, // Deshabilitar strict mode puede ayudar con problemas de hidratación en Electron
    swcMinify: true
};

export default nextConfig;
