'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import styles from './CitySelector.module.css';

/**
 * Componente selector de ciudad para Albion Online
 * Permite cambiar la ubicación de las consultas de precios del mercado
 */

// Lista de ciudades principales de Albion Online con sus colores temáticos
const cities = [
  { name: 'Martlock', value: 'Martlock', color: '#007bff', bgColor: '#e3f2fd' },
  { name: 'Bridgewatch', value: 'Bridgewatch', color: '#fd7e14', bgColor: '#fff3e0' },
  { name: 'Thetford', value: 'Thetford', color: '#9c27b0', bgColor: '#f3e5f5' },
  { name: 'Fort Sterling', value: 'Fort Sterling', color: '#ffffff', bgColor: '#f8f9fa' },
  { name: 'Lymhurst', value: 'Lymhurst', color: '#28a745', bgColor: '#e8f5e8' },
  { name: 'Caerleon', value: 'Caerleon', color: '#343a40', bgColor: '#e9ecef' },
  { name: 'Brecilien', value: 'Brecilien', color: '#6f42c1', bgColor: '#f3e5f5' }
];

export default function CitySelector({ selectedCity, onCityChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Log para depuración
  console.log('CitySelector - selectedCity recibido:', selectedCity);
  
  // Encontrar la ciudad seleccionada en el array cities para que coincida por referencia
  const currentSelectedCity = cities.find(city => city.value === selectedCity?.value) || cities[0];
  console.log('CitySelector - currentSelectedCity para dropdown:', currentSelectedCity);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para manejar el cambio de ciudad
  const handleCityChange = (city) => {
    console.log('CitySelector - ciudad seleccionada:', city);
    
    // Cerrar dropdown inmediatamente
    setIsOpen(false);
    
    // Llamar a onCityChange con un pequeño delay para mejor UX
    setTimeout(() => {
      onCityChange(city);
    }, 100);
  };

  // Función para alternar el dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="mb-3">
      <div className="d-flex justify-content-between align-items-center">
                 <div className="d-flex align-items-center">
           <i className="pi pi-map-marker me-2" style={{ fontSize: '1.2rem', color: currentSelectedCity?.color }}></i>
           <h6 className="mb-0" style={{ color: currentSelectedCity?.color, fontSize: '0.8rem' }}>Ubicación de Consulta</h6>
         </div>
        <div style={{ width: '300px' }} ref={dropdownRef}>
          {/* Dropdown personalizado */}
          <div className="position-relative">
            {/* Botón del dropdown */}
                         <button
               type="button"
               className={`btn w-100 d-flex justify-content-between align-items-center ${styles.dropdownButton}`}
               onClick={toggleDropdown}
               style={{ 
                 height: '38px',
                 borderColor: currentSelectedCity?.color,
                 color: currentSelectedCity?.color,
                 backgroundColor: 'transparent'
               }}
             >
               <span className="fw-bold">{currentSelectedCity?.name || 'Seleccionar ciudad...'}</span>
               <i className={`pi ${isOpen ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
             </button>

            {/* Lista de opciones */}
            {isOpen && (
              <div 
                className={`position-absolute w-100 mt-1 ${styles.dropdownList}`}
                style={{ zIndex: 1000 }}
              >
                <div className="card shadow-sm border-0">
                  <div className="list-group list-group-flush">
                                         {cities.map((city) => (
                       <button
                         key={city.value}
                         type="button"
                         className={`list-group-item list-group-item-action d-flex align-items-center ${
                           city.value === currentSelectedCity?.value ? styles.active : ''
                         } ${styles.dropdownOption}`}
                         onClick={() => handleCityChange(city)}
                         style={{
                           border: 'none',
                           background: city.value === currentSelectedCity?.value ? city.color : city.bgColor,
                           color: city.value === currentSelectedCity?.value ? 'white' : city.color,
                           borderLeft: `4px solid ${city.color}`
                         }}
                       >
                         <span className="fw-bold">{city.name}</span>
                         {city.value === currentSelectedCity?.value && (
                           <i className="pi pi-check ms-auto"></i>
                         )}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
             {currentSelectedCity && (
         <div className="mt-2">
           <small style={{ color: currentSelectedCity.color, fontSize: '0.7rem' }}>
             <i className="pi pi-info-circle me-1"></i>
             Los precios se consultarán en {currentSelectedCity.name}
           </small>
         </div>
       )}
    </Card>
  );
}
