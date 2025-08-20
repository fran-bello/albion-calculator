'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function AnalysisResults({ analisisActual, guardarAnalisis, limpiarStorage }) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <Card>
          <h5 className="text-center mb-4" style={{ fontSize: '0.9rem' }}>
            <i className="pi pi-chart-line text-success me-2"></i>
            Resultados del Análisis
          </h5>
          
          {/* Análisis por tipo de cliente */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <Card className="h-100">
                <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                  <i className="pi pi-users text-info me-2"></i>
                  Cliente General
                </h6>
                <div className="text-center">
                  <h3 className="text-success" style={{ fontSize: '1.2rem' }}>${analisisActual.gananciaClienteGeneral}</h3>
                  <p className="text-muted mb-2" style={{ fontSize: '0.7rem' }}>Ganancia por Pastel</p>
                  <h4 className="text-info" style={{ fontSize: '1rem' }}>{analisisActual.roiClienteGeneral}%</h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>ROI</p>
                </div>
              </Card>
            </div>
            <div className="col-md-6 mb-3">
              <Card className="h-100">
                <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                  <i className="pi pi-star text-warning me-2"></i>
                  Socio
                </h6>
                <div className="text-center">
                  <h3 className="text-warning" style={{ fontSize: '1.2rem' }}>${analisisActual.gananciaSocio}</h3>
                  <p className="text-muted mb-2" style={{ fontSize: '0.7rem' }}>Ganancia por Pastel</p>
                  <h4 className="text-info" style={{ fontSize: '1rem' }}>{analisisActual.roiSocio}%</h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>ROI</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Métricas detalladas */}
          <div className="row">
            <div className="col-md-2 mb-3">
              <div className="text-center">
                <i className="pi pi-heart text-success" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="mt-2 text-success">{analisisActual.nutricionPorPastel || 156}</h6>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>Nutrición por Pastel</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="text-center">
                <i className="pi pi-dollar text-info" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="mt-2 text-info">${analisisActual.costoPastel || 0}</h6>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>Costo del Pastel</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="text-center">
                <i className="pi pi-calculator text-warning" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="mt-2 text-warning">${analisisActual.costoPor100Nutricion?.toFixed(2) || '0.00'}</h6>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>Costo por 100 Nutrición</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="text-center">
                <i className="pi pi-box text-success" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="mt-2 text-success">{analisisActual.pastelesUsados || 0}</h6>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>Pasteles Usados</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="text-center">
                <i className="pi pi-dollar text-success" style={{ fontSize: '1.5rem' }}></i>
                <h6 className="mt-2 text-success">${analisisActual.silverGenerado || 0}</h6>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>Silver Generado</p>
              </div>
            </div>
          </div>

          {/* Explicación del cálculo */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="alert alert-info">
                <h6 className="alert-heading" style={{ fontSize: '0.8rem' }}>
                  <i className="pi pi-info-circle me-2"></i>
                  ¿Cómo se calcula la ganancia?
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2" style={{ fontSize: '0.7rem' }}>
                      <strong>Fórmula:</strong> Costo por 100 nutrición = (Costo del Pastel ÷ 156) × 100
                    </p>
                    <p className="mb-2" style={{ fontSize: '0.7rem' }}>
                      <strong>Ganancia:</strong> Precio Cliente - Costo por 100 nutrición
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2" style={{ fontSize: '0.7rem' }}>
                      <strong>Ejemplo:</strong> Si el pastel cuesta 450 silver:
                    </p>
                    <ul className="mb-0 small" style={{ fontSize: '0.7rem' }}>
                      <li>Costo por 100 nutrición: (450 ÷ 156) × 100 = 288.46 silver</li>
                      <li>Ganancia cliente general: Precio - 288.46</li>
                      <li>Ganancia socio: Precio - 288.46</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="text-center mt-4">
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 gap-md-3">
              <Button 
                label="Guardar Análisis" 
                icon="pi pi-save" 
                className="p-button-primary"
                onClick={guardarAnalisis}
              />
              <Button 
                label="Limpiar Historial" 
                icon="pi pi-trash" 
                className="p-button-warning"
                onClick={limpiarStorage}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
