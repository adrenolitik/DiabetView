import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

const HeartTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) return <div className="text-center p-10">Загрузка данных...</div>;

  const data = [
    {
      name: '10-летний риск ССЗ (%)',
      Текущий: simulation.current.cvdRisk10Year,
      Сценарий: simulation.counterfactual.cvdRisk10Year,
    },
    {
      name: 'Здоровье сосудов (0-100)',
      Текущий: simulation.current.vascularHealth,
      Сценарий: simulation.counterfactual.vascularHealth,
    }
  ];

  // Calculate artery stenosis visualization
  // Lower vascular health = narrower artery lumen
  const currentLumen = Math.max(2, simulation.current.vascularHealth / 2); // Radius
  const futureLumen = Math.max(2, simulation.counterfactual.vascularHealth / 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Риск Сердечно-Сосудистых Событий</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Текущий" fill="#94a3b8" />
              <Bar dataKey="Сценарий" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          * Оценка риска SCORE/ASCVD. Снижение показателя риска означает уменьшение вероятности инфаркта или инсульта.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Состояние Артерий (Атеросклероз)</h3>
        
        <div className="flex justify-around w-full mb-8">
          <div className="flex flex-col items-center">
            <span className="mb-2 font-medium text-slate-600">Текущее</span>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
              <circle cx="50" cy="50" r={currentLumen} fill="#7f1d1d" />
              {/* Plaque visual */}
              <path d={`M 50 5 L 50 95`} stroke="transparent" /> 
              <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth={40 - currentLumen} strokeOpacity="0.5" />
            </svg>
            <span className="text-xs text-red-600 mt-2">Бляшки: {100 - simulation.current.vascularHealth}%</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="mb-2 font-medium text-green-700">Прогноз</span>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
              <circle cx="50" cy="50" r={futureLumen} fill="#7f1d1d" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth={Math.max(0, 40 - futureLumen)} strokeOpacity="0.5" />
            </svg>
            <span className="text-xs text-green-600 mt-2">Бляшки: {100 - simulation.counterfactual.vascularHealth}%</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 w-full">
          <strong>Интерпретация:</strong> Желтая область показывает накопление холестериновых бляшек. При улучшении показателей (вес, глюкоза), прогрессирование атеросклероза замедляется, сохраняя просвет сосуда широким для кровотока.
        </div>
      </div>
    </div>
  );
};

export default HeartTab;
