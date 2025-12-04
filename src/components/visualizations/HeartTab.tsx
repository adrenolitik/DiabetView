import React from 'react';
import { SimulationResult } from '../../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Props {
  simulation: SimulationResult | null;
}

const HeartTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">❤️</div>
          <p>Загрузка анализа сосудов...</p>
        </div>
      </div>
    );
  }

  const { current, counterfactual } = simulation;

  // CVD Risk over time projection (mock timeline)
  const timelineData = [
    { year: 'Сейчас', current: current.cvdRisk10Year, intervention: current.cvdRisk10Year },
    { year: '2 года', current: current.cvdRisk10Year * 1.15, intervention: counterfactual.cvdRisk10Year * 0.85 },
    { year: '5 лет', current: current.cvdRisk10Year * 1.35, intervention: counterfactual.cvdRisk10Year * 0.75 },
    { year: '10 лет', current: current.cvdRisk10Year * 1.6, intervention: counterfactual.cvdRisk10Year },
  ];

  const riskReduction = ((current.cvdRisk10Year - counterfactual.cvdRisk10Year) / current.cvdRisk10Year * 100);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Сердечно-сосудистая система</h2>
        <p className="text-slate-600">Риски и прогноз здоровья сосудов</p>
      </div>

      {/* CVD Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-600">Риск ССЗ (10 лет)</h3>
              <p className="text-xs text-slate-500">Текущие показатели</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-red-600 mb-2">
            {current.cvdRisk10Year.toFixed(1)}%
          </div>
          <div className="bg-red-100 rounded-lg p-3 mt-4">
            <div className="text-xs text-slate-700">
              <strong>Здоровье сосудов:</strong> {current.vascularHealth.toFixed(0)}/100
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-600">Риск ССЗ (10 лет)</h3>
              <p className="text-xs text-slate-500">С интервенцией</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-green-600 mb-2">
            {counterfactual.cvdRisk10Year.toFixed(1)}%
          </div>
          <div className="bg-green-100 rounded-lg p-3 mt-4">
            <div className="text-xs text-slate-700">
              <strong>Здоровье сосудов:</strong> {counterfactual.vascularHealth.toFixed(0)}/100
            </div>
          </div>
        </div>

      </div>

      {/* Risk Reduction Badge */}
      {riskReduction > 0 && (
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-xl font-bold text-blue-800 mb-1">
            Снижение риска на {riskReduction.toFixed(0)}%
          </h3>
          <p className="text-sm text-slate-700">
            Благодаря контролю веса, глюкозы и отказу от курения
          </p>
        </div>
      )}

      {/* Timeline Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Прогноз риска во времени</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIntervention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#475569' }} />
            <YAxis label={{ value: 'Риск (%)', angle: -90, position: 'insideLeft', fill: '#475569' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value.toFixed(1)}%`, '']}
            />
            <Legend />
            <Area type="monotone" dataKey="current" stroke="#ef4444" fillOpacity={1} fill="url(#colorCurrent)" name="Без изменений" />
            <Area type="monotone" dataKey="intervention" stroke="#10b981" fillOpacity={1} fill="url(#colorIntervention)" name="С интервенцией" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Vascular Health Visualization */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Визуализация сосудов</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Current State */}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600 mb-3">Текущее состояние</p>
            <div className="relative w-full h-40 bg-gradient-to-r from-red-200 to-red-300 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <path 
                  d="M10,40 Q50,30 100,40 T190,40" 
                  stroke="#991b1b" 
                  strokeWidth="20" 
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Plaques */}
                <circle cx="70" cy="40" r="8" fill="#7f1d1d" opacity="0.8" />
                <circle cx="130" cy="40" r="10" fill="#7f1d1d" opacity="0.8" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-red-900 bg-white/70 px-2 py-1 rounded">
                  Атеросклероз
                </span>
              </div>
            </div>
          </div>

          {/* Improved State */}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600 mb-3">С интервенцией</p>
            <div className="relative w-full h-40 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <path 
                  d="M10,40 Q50,38 100,40 T190,40" 
                  stroke="#15803d" 
                  strokeWidth="25" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-green-900 bg-white/70 px-2 py-1 rounded">
                  Здоровые сосуды
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-slate-600">
        <strong>⚠️ Примечание:</strong> Прогнозы основаны на статистических моделях и носят иллюстративный характер. 
        Для точной оценки рисков обратитесь к кардиологу.
      </div>
    </div>
  );
};

export default HeartTab;
