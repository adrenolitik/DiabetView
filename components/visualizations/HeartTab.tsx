import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

const HeartTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Загрузка данных...</p>
      </div>
    </div>
  );

  // Calculate deltas
  const cvdRiskDelta = simulation.counterfactual.cvdRisk10Year - simulation.current.cvdRisk10Year;
  const cvdRiskDeltaPercent = ((cvdRiskDelta / simulation.current.cvdRisk10Year) * 100).toFixed(1);
  const vascularDelta = simulation.counterfactual.vascularHealth - simulation.current.vascularHealth;
  const vascularDeltaPercent = ((vascularDelta / simulation.current.vascularHealth) * 100).toFixed(1);

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
    <div className="flex flex-col gap-6 h-full overflow-y-auto animate-fadeIn">
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CVD Risk Card */}
        <div className={`p-5 rounded-xl border-2 shadow-md transition-smooth ${
          cvdRiskDelta < 0 ? 'bg-green-50 border-green-200 glow-improvement' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Риск ССЗ (10 лет)</h4>
            <span className="text-2xl">💔</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Текущий</p>
              <p className="text-3xl font-bold text-slate-800">{simulation.current.cvdRisk10Year}%</p>
            </div>
            <div className={`text-3xl font-bold mx-4 ${
              cvdRiskDelta < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {cvdRiskDelta < 0 ? '↓' : '↑'}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Прогноз</p>
              <p className={`text-3xl font-bold ${
                cvdRiskDelta < 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {simulation.counterfactual.cvdRisk10Year}%
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Изменение:</span>
              <span className={`text-sm font-bold ${
                cvdRiskDelta < 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {cvdRiskDelta > 0 ? '+' : ''}{cvdRiskDelta.toFixed(1)}% ({cvdRiskDelta > 0 ? '+' : ''}{cvdRiskDeltaPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Vascular Health Card */}
        <div className={`p-5 rounded-xl border-2 shadow-md transition-smooth ${
          vascularDelta > 0 ? 'bg-green-50 border-green-200 glow-improvement' : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Здоровье сосудов</h4>
            <span className="text-2xl">🩸</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Текущее</p>
              <p className="text-3xl font-bold text-slate-800">{simulation.current.vascularHealth}</p>
            </div>
            <div className={`text-3xl font-bold mx-4 ${
              vascularDelta > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {vascularDelta > 0 ? '↑' : '↓'}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Прогноз</p>
              <p className={`text-3xl font-bold ${
                vascularDelta > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {simulation.counterfactual.vascularHealth}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Изменение:</span>
              <span className={`text-sm font-bold ${
                vascularDelta > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {vascularDelta > 0 ? '+' : ''}{vascularDelta.toFixed(1)} ({vascularDelta > 0 ? '+' : ''}{vascularDeltaPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-smooth">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Сравнительная диаграмма</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 11}} />
                <YAxis tick={{fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Текущий" fill="#94a3b8" radius={[8, 8, 0, 0]} className="transition-smooth" />
                <Bar dataKey="Сценарий" fill="#22c55e" radius={[8, 8, 0, 0]} className="transition-smooth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-4 italic">
            * Оценка риска SCORE/ASCVD. Снижение показателя риска означает уменьшение вероятности инфаркта или инсульта.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center transition-smooth">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Состояние Артерий (Атеросклероз)</h3>
          
          <div className="flex justify-around w-full mb-8">
            <div className="flex flex-col items-center animate-fadeIn">
              <span className="mb-2 font-medium text-slate-600">Текущее</span>
              <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-md">
                <circle cx="50" cy="50" r="45" fill="#fecaca" stroke="#ef4444" strokeWidth="2" className="transition-smooth" />
                <circle cx="50" cy="50" r={currentLumen} fill="#7f1d1d" className="transition-smooth" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth={40 - currentLumen} strokeOpacity="0.6" className="transition-smooth" />
              </svg>
              <div className="mt-3 px-3 py-1 bg-red-100 rounded-full">
                <span className="text-xs font-semibold text-red-700">Бляшки: {100 - simulation.current.vascularHealth}%</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className={`text-4xl font-bold animate-pulse ${
                vascularDelta > 0 ? 'text-green-600' : 'text-slate-400'
              }`}>
                →
              </div>
            </div>

            <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <span className="mb-2 font-medium text-green-700">Прогноз</span>
              <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-md">
                <circle cx="50" cy="50" r="45" fill="#fecaca" stroke="#ef4444" strokeWidth="2" className="transition-smooth" />
                <circle cx="50" cy="50" r={futureLumen} fill="#7f1d1d" className="transition-smooth" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#fbbf24" strokeWidth={Math.max(0, 40 - futureLumen)} strokeOpacity="0.6" className="transition-smooth" />
              </svg>
              <div className="mt-3 px-3 py-1 bg-green-100 rounded-full">
                <span className="text-xs font-semibold text-green-700">Бляшки: {100 - simulation.counterfactual.vascularHealth}%</span>
              </div>
            </div>
          </div>
          
          {/* Change indicator */}
          <div className={`w-full p-4 rounded-lg mb-4 ${
            vascularDelta > 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Изменение просвета:</span>
              <span className={`text-lg font-bold ${
                vascularDelta > 0 ? 'text-green-700' : 'text-orange-700'
              }`}>
                {vascularDelta > 0 ? '↑ Улучшение' : '↓ Ухудшение'} {Math.abs(vascularDelta).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 w-full border border-blue-200">
            <strong>💡 Интерпретация:</strong> Желтая область показывает накопление холестериновых бляшек. При улучшении показателей (вес, глюкоза), прогрессирование атеросклероза замедляется, сохраняя просвет сосуда широким для кровотока.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartTab;
