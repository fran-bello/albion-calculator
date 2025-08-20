'use client';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';

export default function HistoryChart({ historial }) {
  // Solo mostrar si hay historial
  if (historial.length === 0) {
    return null;
  }

  // Datos para el gráfico
  const chartData = {
    labels: historial.slice(0, 10).map(h => h.fecha.split(',')[0]),
    datasets: [
      {
        label: 'Ganancia Cliente General',
        data: historial.slice(0, 10).map(h => h.gananciaClienteGeneral),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Ganancia Socio',
        data: historial.slice(0, 10).map(h => h.gananciaSocio),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Rentabilidad - Tienda Curtidora Marlock',
        font: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <>
      {/* Historial */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <h5 style={{ fontSize: '0.9rem' }}>Historial de Análisis</h5>
            <DataTable value={historial} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                       className="p-datatable-sm">
              <Column field="fecha" header="Fecha y Hora" sortable></Column>
              <Column field="costoPastel" header="Costo Pastel" sortable body={(rowData) => `$${rowData.costoPastel}`}></Column>
              <Column field="precioClienteGeneral" header="Precio General" sortable body={(rowData) => `$${rowData.precioClienteGeneral}`}></Column>
              <Column field="precioSocio" header="Precio Socio" sortable body={(rowData) => `$${rowData.precioSocio}`}></Column>
              <Column field="gananciaClienteGeneral" header="Ganancia General" sortable body={(rowData) => `$${rowData.gananciaClienteGeneral}`}></Column>
              <Column field="gananciaSocio" header="Ganancia Socio" sortable body={(rowData) => `$${rowData.gananciaSocio}`}></Column>
              <Column field="roiClienteGeneral" header="ROI General" sortable body={(rowData) => `${rowData.roiClienteGeneral}%`}></Column>
              <Column field="roiSocio" header="ROI Socio" sortable body={(rowData) => `${rowData.roiSocio}%`}></Column>
            </DataTable>
          </Card>
        </div>
      </div>

      {/* Gráfico */}
      <div className="row">
        <div className="col-12">
          <Card>
            <Chart type="line" data={chartData} options={chartOptions} />
          </Card>
        </div>
      </div>
    </>
  );
}
