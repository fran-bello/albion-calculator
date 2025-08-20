'use client';

import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export default function ConfigurationForm({ configuracion, setConfiguracion, analizarRentabilidad }) {
  return (
    <>
      {/* Inputs organizados verticalmente */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <h5 className="text-center mb-4" style={{ fontSize: '0.9rem' }}>
              <i className="pi pi-cog text-primary me-2"></i>
              Configuración de la Tienda
            </h5>
            
            {/* Input 1: Costo del Pastel */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <img 
                  src="https://render.albiononline.com/v1/item/T3_MEAL_PIE.png?quality=1&size=32" 
                  alt="Chicken Pie" 
                  className="input-icon"
                />
                <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Costo del Pastel de Pollo</label>
              </div>
              <InputNumber 
                value={configuracion.costoPastel} 
                onValueChange={(e) => setConfiguracion({...configuracion, costoPastel: e.value || 0})}
                mode="currency" 
                currency="USD" 
                locale="en-US"
                className="w-100"
                placeholder="Ingresa el costo del pastel"
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Precio actual del mercado</small>
            </div>

            {/* Input 2: Precio Cliente General */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <img 
                  src="https://render.albiononline.com/v1/item/T4_SILVERBAG_NONTRADABLE.png?quality=1&size=32" 
                  alt="Silver" 
                  className="input-icon"
                />
                <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio Cliente General</label>
              </div>
              <InputNumber 
                value={configuracion.precioClienteGeneral} 
                onValueChange={(e) => setConfiguracion({...configuracion, precioClienteGeneral: e.value || 0})}
                mode="currency" 
                currency="USD" 
                locale="en-US"
                className="w-100"
                placeholder="Precio por 100 nutrición"
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Por cada 100 puntos de nutrición</small>
            </div>

            {/* Input 3: Precio Socio */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <img 
                  src="https://render.albiononline.com/v1/item/T4_SILVERBAG_NONTRADABLE.png?quality=1&size=32" 
                  alt="Silver" 
                  className="input-icon"
                />
                <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio Socio</label>
              </div>
              <InputNumber 
                value={configuracion.precioSocio} 
                onValueChange={(e) => setConfiguracion({...configuracion, precioSocio: e.value || 0})}
                mode="currency" 
                currency="USD" 
                locale="en-US"
                className="w-100"
                placeholder="Precio por 100 nutrición"
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Precio especial para socios</small>
            </div>

            {/* Input 4: Silver Acumulado */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <img 
                  src="https://render.albiononline.com/v1/item/T4_SILVERBAG_NONTRADABLE.png?quality=1&size=32" 
                  alt="Silver" 
                  className="input-icon"
                />
                <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Silver Acumulado</label>
              </div>
              <InputNumber 
                value={configuracion.silverAcumulado} 
                onValueChange={(e) => setConfiguracion({...configuracion, silverAcumulado: e.value || 0})}
                mode="currency" 
                currency="USD" 
                locale="en-US"
                className="w-100"
                placeholder="Silver en la tienda"
              />
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>Total acumulado en la tienda</small>
            </div>
          </Card>
        </div>
      </div>

      {/* Inputs para Fabricación */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <h5 className="text-center mb-4" style={{ fontSize: '0.9rem' }}>
              <i className="pi pi-industry text-warning me-2"></i>
              Configuración de Fabricación
            </h5>
            
            <div className="row">
              {/* Columna izquierda */}
              <div className="col-md-6">
                {/* Precio del Pollo */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T3_FARM_CHICKEN_GROWN.png?quality=1&size=24" 
                        alt="Pollo" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio del Pollo</label>
                  </div>
                  <InputNumber 
                    value={configuracion.precioPollo} 
                    onValueChange={(e) => setConfiguracion({...configuracion, precioPollo: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Precio por pollo"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Precio por pollo vivo</small>
                </div>

                {/* Costo de Picar Pollo */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T4_SILVERBAG_NONTRADABLE.png?quality=1&size=24" 
                        alt="Silver" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Costo de Picar Pollo</label>
                  </div>
                  <InputNumber 
                    value={configuracion.costoPicarPollo} 
                    onValueChange={(e) => setConfiguracion({...configuracion, costoPicarPollo: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Costo por picar un pollo"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Costo por picar un pollo (713 actual)</small>
                </div>

                {/* Precio de la Carne de Pollo */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T3_MEAT.png?quality=1&size=24" 
                        alt="Carne de Pollo" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio Carne de Pollo (Opcional)</label>
                  </div>
                  <InputNumber 
                    value={configuracion.precioCarnePollo} 
                    onValueChange={(e) => setConfiguracion({...configuracion, precioCarnePollo: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Precio por carne (0 = no usar)"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Si compras carne directa (0 = usar pollos)</small>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="col-md-6">
                {/* Precio del Trigo */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T3_WHEAT.png?quality=1&size=24" 
                        alt="Trigo" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio del Trigo</label>
                  </div>
                  <InputNumber 
                    value={configuracion.precioTrigo} 
                    onValueChange={(e) => setConfiguracion({...configuracion, precioTrigo: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Precio por trigo"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Precio por unidad de trigo</small>
                </div>

                {/* Precio de la Harina */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T3_FLOUR.png?quality=1&size=24" 
                        alt="Harina" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Precio de la Harina</label>
                  </div>
                  <InputNumber 
                    value={configuracion.precioHarina} 
                    onValueChange={(e) => setConfiguracion({...configuracion, precioHarina: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Precio por harina"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Precio por unidad de harina</small>
                </div>

                {/* Costo de Cocina */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <div className="icon-container me-2" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="https://render.albiononline.com/v1/item/T4_SILVERBAG_NONTRADABLE.png?quality=1&size=24" 
                        alt="Silver" 
                        className="input-icon"
                        style={{ width: '24px', height: '24px' }}
                      />
                    </div>
                    <label className="form-label mb-0 fw-bold" style={{ fontSize: '0.8rem' }}>Costo de Cocina</label>
                  </div>
                  <InputNumber 
                    value={configuracion.costoFabricacion} 
                    onValueChange={(e) => setConfiguracion({...configuracion, costoFabricacion: e.value || 0})}
                    mode="currency" 
                    currency="USD" 
                    locale="en-US"
                    className="w-100"
                    placeholder="Costo por 10 pasteles"
                  />
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Costo por cocinar 10 pasteles (409 actual)</small>
                </div>

              </div>
            </div>
            
            {/* Botón para guardar y analizar - Centrado en toda la sección */}
            <div className="text-center mt-4">
              <Button 
                label="Analizar Rentabilidad" 
                icon="pi pi-calculator" 
                className="p-button-success p-button-lg"
                onClick={analizarRentabilidad}
                style={{ color: 'white' }}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
