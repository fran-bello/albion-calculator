'use client';

import { Card } from 'primereact/card';

export default function FabricationAnalysis({ analisisActual }) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <Card>
          <h5 className="text-center mb-4" style={{ fontSize: '0.9rem' }}>
            <i className="pi pi-industry text-warning me-2"></i>
            Análisis de Fabricación
          </h5>
          
                     {/* Información de la receta */}
           <div className="row mb-4">
             <div className="col-12">
               <Card className="text-center">
                 <h6 className="text-info mb-2" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-info-circle me-2"></i>
                   Receta de Fabricación
                 </h6>
                 <p className="mb-2" style={{ fontSize: '0.7rem' }}>
                   <strong>10 pasteles</strong> requieren: <strong>8 carne de pollo</strong> + <strong>4 harinas</strong> + <strong>2 trigos</strong>
                 </p>
                 <small className="text-success" style={{ fontSize: '0.7rem' }}>
                   <i className="pi pi-arrow-up me-1"></i>
                   Retorno de materiales: 15.2%
                 </small>
               </Card>
             </div>
           </div>
           
           {/* Comparación de opciones para obtener carne */}
           <div className="row mb-4">
             <div className="col-12">
               <Card>
                 <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-balance-scale text-warning me-2"></i>
                   Comparación: Obtener Carne de Pollo
                 </h6>
                 <div className="row">
                   <div className="col-md-6 mb-3">
                     <div className="text-center p-3 border rounded">
                       <h6 className="text-primary mb-2" style={{ fontSize: '0.75rem' }}>
                         <i className="pi pi-shopping-cart me-2"></i>
                         Comprar Carne Directa
                       </h6>
                       <h4 className="text-primary">${analisisActual.precioCarneDirecta || 0}</h4>
                       <p className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>Precio por carne</p>
                       <small className="text-muted" style={{ fontSize: '0.7rem' }}>Del mercado</small>
                     </div>
                   </div>
                   <div className="col-md-6 mb-3">
                     <div className="text-center p-3 border rounded">
                       <h6 className="text-success mb-2" style={{ fontSize: '0.75rem' }}>
                         <i className="pi pi-cut me-2"></i>
                         Comprar Pollo + Picar
                       </h6>
                       <h4 className="text-success">${analisisActual.precioCarnePorPicar || 0}</h4>
                       <p className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>Precio por carne</p>
                       <small className="text-muted" style={{ fontSize: '0.7rem' }}>(Pollo + picar) ÷ 21</small>
                     </div>
                   </div>
                 </div>
                 <div className="text-center mt-3">
                   <h6 className="text-info" style={{ fontSize: '0.8rem' }}>
                     <i className="pi pi-star me-2"></i>
                     Opción Recomendada: 
                     <span className="ms-2 badge bg-success" style={{ fontSize: '0.7rem' }}>
                       {analisisActual.precioCarneDirecta > 0 && analisisActual.precioCarneDirecta < analisisActual.precioCarnePorPicar 
                         ? 'Comprar Carne Directa' 
                         : 'Comprar Pollo + Picar'
                       }
                     </span>
                   </h6>
                 </div>
               </Card>
             </div>
           </div>
          
                     {/* Comparación de métodos */}
           <div className="row mb-4">
             <div className="col-md-4 mb-3">
               <Card className="h-100">
                 <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-shopping-bag text-primary me-2"></i>
                   Comprar Pastel Directo
                 </h6>
                 <div className="text-center">
                   <h3 className="text-primary">${analisisActual.costoPastel || 0}</h3>
                   <p className="text-muted mb-2" style={{ fontSize: '0.7rem' }}>Precio por Pastel</p>
                   <small className="text-muted" style={{ fontSize: '0.7rem' }}>Del mercado</small>
                 </div>
               </Card>
             </div>
             <div className="col-md-4 mb-3">
               <Card className="h-100">
                 <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-industry text-info me-2"></i>
                   Fabricar con Carne Directa
                 </h6>
                 <div className="text-center">
                   <h3 className="text-info">${analisisActual.costeFabricacionCarne || 0}</h3>
                   <p className="text-muted mb-2" style={{ fontSize: '0.7rem' }}>Costo por Pastel</p>
                   <h4 className="text-success" style={{ fontSize: '1rem' }}>${analisisActual.gananciaFabricacionCarne || 0}</h4>
                   <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Ganancia por Pastel</p>
                 </div>
               </Card>
             </div>
             <div className="col-md-4 mb-3">
               <Card className="h-100">
                 <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-cut text-danger me-2"></i>
                   Fabricar Picando Pollos
                 </h6>
                 <div className="text-center">
                   <h3 className="text-danger">${analisisActual.costeFabricacionPollo || 0}</h3>
                   <p className="text-muted mb-2" style={{ fontSize: '0.7rem' }}>Costo por Pastel</p>
                   <h4 className="text-success" style={{ fontSize: '1rem' }}>${analisisActual.gananciaFabricacionPollo || 0}</h4>
                   <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Ganancia por Pastel</p>
                 </div>
               </Card>
             </div>
           </div>

                     {/* Método más barato */}
           <div className="row mb-4">
             <div className="col-12">
               <Card className="text-center">
                 <h6 className="text-primary mb-2" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-star text-warning me-2"></i>
                   Método Recomendado
                 </h6>
                 <h4 className="text-success">
                   {(() => {
                     const costoCompra = analisisActual.costoPastel || 0;
                     const costoFabricarCarne = analisisActual.costeFabricacionCarne || 0;
                     const costoFabricarPollo = analisisActual.costeFabricacionPollo || 0;
                     
                     if (costoCompra <= costoFabricarCarne && costoCompra <= costoFabricarPollo) {
                       return 'Comprar Pastel Directo';
                     } else if (costoFabricarCarne <= costoFabricarPollo) {
                       return 'Fabricar con Carne Directa';
                     } else {
                       return 'Fabricar Picando Pollos';
                     }
                   })()}
                 </h4>
                 <small className="text-muted" style={{ fontSize: '0.7rem' }}>Basado en menor costo por pastel</small>
                 
                 {/* Mostrar ahorro comparado con la opción más cara */}
                 <div className="mt-3">
                   {(() => {
                     const costoCompra = analisisActual.costoPastel || 0;
                     const costoFabricarCarne = analisisActual.costeFabricacionCarne || 0;
                     const costoFabricarPollo = analisisActual.costeFabricacionPollo || 0;
                     
                     const costos = [costoCompra, costoFabricarCarne, costoFabricarPollo].filter(c => c > 0);
                     if (costos.length > 1) {
                       const masBarato = Math.min(...costos);
                       const masCaro = Math.max(...costos);
                       const ahorro = masCaro - masBarato;
                       return (
                         <div className="alert alert-success py-2 mb-0">
                           <small style={{ fontSize: '0.7rem' }}>
                             <i className="pi pi-arrow-down me-1"></i>
                             Ahorras <strong>${ahorro}</strong> por pastel comparado con la opción más cara
                           </small>
                         </div>
                       );
                     }
                     return null;
                   })()}
                 </div>
               </Card>
             </div>
           </div>

                     {/* Tabla de comparación detallada */}
           <div className="row mb-4">
             <div className="col-12">
               <Card>
                 <h6 className="text-center mb-3" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-table text-secondary me-2"></i>
                   Comparación Detallada de Opciones
                 </h6>
                 <div className="table-responsive">
                   <table className="table table-striped">
                     <thead>
                       <tr>
                         <th style={{ fontSize: '0.75rem' }}>Opción</th>
                         <th style={{ fontSize: '0.75rem' }}>Costo por Pastel</th>
                         <th style={{ fontSize: '0.75rem' }}>Ganancia por Pastel</th>
                         <th style={{ fontSize: '0.75rem' }}>ROI</th>
                         <th style={{ fontSize: '0.75rem' }}>Estado</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr>
                         <td style={{ fontSize: '0.75rem' }}>
                           <i className="pi pi-shopping-bag text-primary me-2"></i>
                           <strong>Comprar Directo</strong>
                         </td>
                         <td className="text-primary" style={{ fontSize: '0.75rem' }}>${analisisActual.costoPastel || 0}</td>
                         <td className="text-muted" style={{ fontSize: '0.75rem' }}>-</td>
                         <td className="text-muted" style={{ fontSize: '0.75rem' }}>-</td>
                         <td style={{ fontSize: '0.75rem' }}>
                           <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>Compra</span>
                         </td>
                       </tr>
                       <tr>
                         <td style={{ fontSize: '0.75rem' }}>
                           <i className="pi pi-industry text-info me-2"></i>
                           <strong>Fabricar con Carne</strong>
                         </td>
                         <td className="text-info" style={{ fontSize: '0.75rem' }}>${analisisActual.costeFabricacionCarne || 0}</td>
                         <td className="text-success" style={{ fontSize: '0.75rem' }}>${analisisActual.gananciaFabricacionCarne || 0}</td>
                         <td className="text-info" style={{ fontSize: '0.75rem' }}>${analisisActual.roiFabricacionCarne || 0}%</td>
                         <td style={{ fontSize: '0.75rem' }}>
                           <span className="badge bg-info" style={{ fontSize: '0.7rem' }}>Fabricación</span>
                         </td>
                       </tr>
                       <tr>
                         <td style={{ fontSize: '0.75rem' }}>
                           <i className="pi pi-cut text-danger me-2"></i>
                           <strong>Fabricar Picando</strong>
                         </td>
                         <td className="text-danger" style={{ fontSize: '0.75rem' }}>${analisisActual.costeFabricacionPollo || 0}</td>
                         <td className="text-success" style={{ fontSize: '0.75rem' }}>${analisisActual.gananciaFabricacionPollo || 0}</td>
                         <td className="text-danger" style={{ fontSize: '0.75rem' }}>${analisisActual.roiFabricacionPollo || 0}%</td>
                         <td style={{ fontSize: '0.75rem' }}>
                           <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>Fabricación</span>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </Card>
             </div>
           </div>
           


                     {/* Detalles del cálculo */}
           <div className="row mt-4">
             <div className="col-12">
               <div className="alert alert-info">
                 <h6 className="alert-heading" style={{ fontSize: '0.8rem' }}>
                   <i className="pi pi-info-circle me-2"></i>
                   Detalles del Cálculo
                 </h6>
                 <ul className="mb-0" style={{ fontSize: '0.7rem' }}>
                   <li><strong>Receta por 10 pasteles:</strong> 8 carnes, 4 harinas, 2 trigos</li>
                   <li><strong>Devolución de materiales:</strong> 15.2% (no aplica a tasa de fabricación)</li>
                   <li><strong>Rendimiento del pollo:</strong> 21 carnes por pollo picado</li>
                   <li><strong>Nutrición por pastel:</strong> 156 puntos</li>

                   <li><strong>Comparación de carne:</strong> Se elige automáticamente la opción más barata</li>
                 </ul>
               </div>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
