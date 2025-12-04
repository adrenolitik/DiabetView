import React from 'react';
import { SimulationResult } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  simulation: SimulationResult | null;
}

const LongevityTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">⏳</div>
          <p>Загрузка прогноза...</p>
        </div>
      </div>
    );
  }

  const { current, counterfactual } = simulation;

  const chartData = [
    {
      name: 'Ожидаемая продолжительность жизни',
      'Текущий путь': current.lifeExpectancy,
      'С интервенцией': counterfactual.lifeExpectancy,
    }
  ];

  const gainedYears = counterfactual.lifeExpectancy - current.lifeExpectancy;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Прогноз продолжительности жизни</h2>
        <p className="text-slate-600">Сравнение двух сценариев</p>
      </div>

      {/* Main Chart */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
            <YAxis label={{ value: 'Годы', angle: -90, position: 'insideLeft', fill: '#475569' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: any) => [`${value.toFixed(1)} лет`, '']}
            />
            <Legend />
            <Bar dataKey="Текущий путь" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="С интервенцией" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Scenario */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
              😟
            </div>
            <h3 className="text-lg font-semibold text-red-800">Текущий путь</h3>
          </div>
          <div className="text-4xl font-bold text-red-600 mb-2">
            +{current.lifeExpectancy.toFixed(1)} лет
          </div>
          <p className="text-sm text-slate-700">{current.explanation}</p>
        </div>

        {/* Counterfactual Scenario */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl">
              😊
            </div>
            <h3 className="text-lg font-semibold text-green-800">С интервенцией</h3>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">
            +{counterfactual.lifeExpectancy.toFixed(1)} лет
          </div>
          <p className="text-sm text-slate-700">{counterfactual.explanation}</p>
        </div>

      </div>

      {/* Gained Years Highlight */}
      {gainedYears > 0 && (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-xl p-6 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-amber-800 mb-2">
            Вы можете получить до +{gainedYears.toFixed(1)} лет жизни!
          </h3>
          <p className="text-slate-700">
            Придерживаясь целевых показателей и здорового образа жизни
          </p>
        </div>
      )}

      {/* Health Metrics Comparison */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Показатели здоровья</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Почки', current: current.kidneyHealth, cf: counterfactual.kidneyHealth, icon: '🫘' },
            { label: 'Зрение', current: current.visionHealth, cf: counterfactual.visionHealth, icon: '👁️' },
            { label: 'Сердце', current: current.heartHealth, cf: counterfactual.heartHealth, icon: '❤️' },
            { label: 'Нервы', current: current.nerveHealth, cf: counterfactual.nerveHealth, icon: '🧠' },
          ].map(metric => (
            <div key={metric.label} className="bg-white rounded-lg p-4 text-center border border-slate-200">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className="text-xs text-slate-600 mb-2">{metric.label}</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-red-600 font-semibold">{metric.current.toFixed(0)}</span>
                <span className="text-xs text-slate-400">→</span>
                <span className="text-sm text-green-600 font-semibold">{metric.cf.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LongevityTab;
