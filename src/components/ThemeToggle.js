'use client';

import { useTheme } from '../contexts/ThemeContext';
import { Button } from 'primereact/button';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="theme-toggle-container">
      <Button
        icon={isDark ? 'pi pi-sun' : 'pi pi-moon'}
        onClick={toggleTheme}
        className={`p-button-text ${isDark ? 'p-button-warning' : 'p-button-info'}`}
        tooltip={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );
}
