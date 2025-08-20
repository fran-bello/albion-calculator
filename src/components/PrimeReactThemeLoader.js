'use client';

import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function PrimeReactThemeLoader() {
  const { theme } = useTheme();

  useEffect(() => {
    // Remover tema anterior
    const existingTheme = document.querySelector('link[href*="primereact/resources/themes"]');
    if (existingTheme) {
      existingTheme.remove();
    }

    // Cargar nuevo tema
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = theme === 'dark' 
      ? 'https://cdn.jsdelivr.net/npm/primereact@10.0.0/resources/themes/lara-dark-blue/theme.css'
      : 'https://cdn.jsdelivr.net/npm/primereact@10.0.0/resources/themes/lara-light-blue/theme.css';
    
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [theme]);

  return null; // Este componente no renderiza nada
}
