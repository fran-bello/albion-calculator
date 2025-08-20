'use client';

import { Card } from 'primereact/card';

export default function AccumulatedAmounts({ montosAcumulados }) {
  // Solo mostrar si hay datos acumulados
  if (montosAcumulados.totalGanado <= 0 && montosAcumulados.totalPastelesUsados <= 0) {
    return null;
  }

  return (
    <div className="row mb-4">
      <div className="col-12">
        <Card>
          <h5 className="text-center mb-4" style={{ fontSize: '0.9rem' }}>
            <i className="pi pi-chart-bar text-primary me-2"></i>
            Silver Acumulado en la Tienda
          </h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <i className="pi pi-dollar text-success" style={{ fontSize: '2.5rem' }}></i>
                <h3 className="mt-2 text-success">${montosAcumulados.totalGanado || 0}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Total Silver Generado</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Acumulado histórico de la tienda</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <i className="pi pi-box text-info" style={{ fontSize: '2.5rem' }}></i>
                <h3 className="mt-2 text-info">{montosAcumulados.totalPastelesUsados || 0}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Total Pasteles Usados</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Para generar el silver acumulado</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-center">
                <i className="pi pi-chart-line text-warning" style={{ fontSize: '2.5rem' }}></i>
                <h3 className="mt-2 text-warning">${montosAcumulados.promedioGanancia || 0}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Promedio Ganancia</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Por pastel en análisis previos</small>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
