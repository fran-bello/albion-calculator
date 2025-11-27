'use client';

import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import FlippingDashboard from '../../components/FlippingDashboard';
import PrimeReactThemeLoader from '../../components/PrimeReactThemeLoader';
import Link from 'next/link';

export default function FlippingPage() {
    const toast = useRef(null);

    return (
        <>
            <PrimeReactThemeLoader />
            <div className="app-container">
                {/* Header de la aplicación */}
                <header className="app-header">
                    <div className="app-header-title">
                        <i className="pi pi-chart-line"></i>
                        <span>Market Flipping - Arbitraje Inteligente</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href="/" passHref>
                            <Button 
                                label="Tienda Curtidora" 
                                icon="pi pi-arrow-left" 
                                className="p-button-text"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </Link>
                    </div>
                </header>

                <div className="main-layout">
                    <Toast ref={toast} />

                    {/* Sidebar izquierdo */}
                    <aside className="left-column">
                        <div className="left-column-header">
                            <div className="left-column-title">
                                <i className="pi pi-chart-bar"></i>
                                Market Flipping
                            </div>
                            <p className="left-column-subtitle">
                                Detecta oportunidades de arbitraje entre ciudades
                            </p>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <main className="right-column">
                        <FlippingDashboard />
                    </main>
                </div>
            </div>
        </>
    );
}



