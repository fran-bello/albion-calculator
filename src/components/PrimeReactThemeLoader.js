'use client';

import { useEffect } from 'react';

export default function PrimeReactThemeLoader() {
  useEffect(() => {
    // Remover tema anterior
    const existingTheme = document.querySelector('link[href*="primereact/resources/themes"]');
    if (existingTheme) {
      existingTheme.remove();
    }

    // Cargar tema oscuro siempre
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/primereact@10.0.0/resources/themes/lara-dark-blue/theme.css';
    
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []); // Solo ejecutar una vez al montar

  return null; // Este componente no renderiza nada
}
