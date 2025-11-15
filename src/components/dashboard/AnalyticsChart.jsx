import React from 'react';

const AnalyticsChart = ({ data }) => {
  // Datos de ejemplo para el gráfico
  const chartData = data || [
    { name: 'Lun', visitas: 400, interacciones: 240 },
    { name: 'Mar', visitas: 300, interacciones: 139 },
    { name: 'Mié', visitas: 200, interacciones: 980 },
    { name: 'Jue', visitas: 278, interacciones: 390 },
    { name: 'Vie', visitas: 189, interacciones: 480 },
    { name: 'Sáb', visitas: 239, interacciones: 380 },
    { name: 'Dom', visitas: 349, interacciones: 430 },
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.visitas, d.interacciones)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Rendimiento de la Plataforma</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-colonial-yellow rounded-full"></div>
            <span className="text-sm text-gray-600">Visitas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-colonial-blue rounded-full"></div>
            <span className="text-sm text-gray-600">Interacciones</span>
          </div>
        </div>
      </div>

      {/* Gráfico simplificado con barras */}
      <div className="h-64 flex items-end justify-between space-x-2">
        {chartData.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1 space-y-2">
            <div className="flex flex-col items-center space-y-1 w-full">
              {/* Barra de visitas */}
              <div
                className="w-full bg-colonial-yellow rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(day.visitas / maxValue) * 80}%` }}
                title={`Visitas: ${day.visitas}`}
              ></div>
              {/* Barra de interacciones */}
              <div
                className="w-full bg-colonial-blue rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${(day.interacciones / maxValue) * 80}%` }}
                title={`Interacciones: ${day.interacciones}`}
              ></div>
            </div>
            <span className="text-xs text-gray-500 font-medium">{day.name}</span>
          </div>
        ))}
      </div>

      {/* Leyenda y métricas adicionales */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">1.2K</div>
          <div className="text-sm text-gray-500">Visitas hoy</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">84%</div>
          <div className="text-sm text-gray-500">Tasa de retención</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">4.2m</div>
          <div className="text-sm text-gray-500">Tiempo promedio</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">68%</div>
          <div className="text-sm text-gray-500">Conversión</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
