import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

interface MetricChange {
  label: string;
  current: number;
  future: number;
  delta: number;
  deltaPercent: number;
  isImprovement: boolean;
}

const LongevityTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Загрузка данных...</p>
      </div>
    </div>
  );

  // Calculate all metric changes
  const metricChanges: MetricChange[] = useMemo(() => [
    {
      label: 'Здоровье почек',
      current: simulation.current.kidneyHealth,
      future: simulation.counterfactual.kidneyHealth,
      delta: simulation.counterfactual.kidneyHealth - simulation.current.kidneyHealth,
      deltaPercent: ((simulation.counterfactual.kidneyHealth - simulation.current.kidneyHealth) / simulation.current.kidneyHealth) * 100,
      isImprovement: simulation.counterfactual.kidneyHealth > simulation.current.kidneyHealth
    },
    {
      label: 'Зрение',
      current: simulation.current.visionHealth,
      future: simulation.counterfactual.visionHealth,
      delta: simulation.counterfactual.visionHealth - simulation.current.visionHealth,
      deltaPercent: ((simulation.counterfactual.visionHealth - simulation.current.visionHealth) / simulation.current.visionHealth) * 100,
      isImprovement: simulation.counterfactual.visionHealth > simulation.current.visionHealth
    },
    {
      label: 'Здоровье сердца',
      current: simulation.current.heartHealth,
      future: simulation.counterfactual.heartHealth,
      delta: simulation.counterfactual.heartHealth - simulation.current.heartHealth,
      deltaPercent: ((simulation.counterfactual.heartHealth - simulation.current.heartHealth) / simulation.current.heartHealth) * 100,
      isImprovement: simulation.counterfactual.heartHealth > simulation.current.heartHealth
    },
    {
      label: 'Здоровье нервов',
      current: simulation.current.nerveHealth,
      future: simulation.counterfactual.nerveHealth,
      delta: simulation.counterfactual.nerveHealth - simulation.current.nerveHealth,
      deltaPercent: ((simulation.counterfactual.nerveHealth - simulation.current.nerveHealth) / simulation.current.nerveHealth) * 100,
      isImprovement: simulation.counterfactual.nerveHealth > simulation.current.nerveHealth
    },
    {
      label: 'Здоровье сосудов',
      current: simulation.current.vascularHealth,
      future: simulation.counterfactual.vascularHealth,
      delta: simulation.counterfactual.vascularHealth - simulation.current.vascularHealth,
      deltaPercent: ((simulation.counterfactual.vascularHealth - simulation.current.vascularHealth) / simulation.current.vascularHealth) * 100,
      isImprovement: simulation.counterfactual.vascularHealth > simulation.current.vascularHealth
    },
    {
      label: 'Риск ССЗ (обратный)',
      current: 100 - simulation.current.cvdRisk10Year,
      future: 100 - simulation.counterfactual.cvdRisk10Year,
      delta: (100 - simulation.counterfactual.cvdRisk10Year) - (100 - simulation.current.cvdRisk10Year),
      deltaPercent: (((100 - simulation.counterfactual.cvdRisk10Year) - (100 - simulation.current.cvdRisk10Year)) / (100 - simulation.current.cvdRisk10Year)) * 100,
      isImprovement: simulation.counterfactual.cvdRisk10Year < simulation.current.cvdRisk10Year
    }
  ], [simulation]);

  // Get top 3 improvements and deteriorations
  const sortedByImprovement = useMemo(() => {
    return [...metricChanges].sort((a, b) => b.delta - a.delta);
  }, [metricChanges]);

  const topImprovements = sortedByImprovement.filter(m => m.delta > 0).slice(0, 3);
  const topDeteriorations = sortedByImprovement.filter(m => m.delta < 0).slice(-3).reverse();

  const radarData = [
    { subject: 'Почки', A: simulation.current.kidneyHealth, B: simulation.counterfactual.kidneyHealth, fullMark: 100 },
    { subject: 'Зрение', A: simulation.current.visionHealth, B: simulation.counterfactual.visionHealth, fullMark: 100 },
    { subject: 'Сердце', A: simulation.current.heartHealth, B: simulation.counterfactual.heartHealth, fullMark: 100 },
    { subject: 'Нервы', A: simulation.current.nerveHealth, B: simulation.counterfactual.nerveHealth, fullMark: 100 },
    { subject: 'Сосуды', A: simulation.current.vascularHealth, B: simulation.counterfactual.vascularHealth, fullMark: 100 },
  ];

  const yearsGained = (simulation.counterfactual.lifeExpectancy - simulation.current.lifeExpectancy).toFixed(1);

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto animate-fadeIn">
      
      {/* Top Improvements/Deteriorations */}
      {(topImprovements.length > 0 || topDeteriorations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Improvements */}
          {topImprovements.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200 shadow-md glow-improvement">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-bold text-green-800">Топ-3 улучшения</h3>
              </div>
              <div className="space-y-3">
                {topImprovements.map((metric, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-green-100 animate-slideInRight" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">#{idx + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold text-lg">↑</span>
                        <span className="text-green-700 font-bold text-sm">
                          +{Math.abs(metric.deltaPercent).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                      <span>{Math.round(metric.current)} → {Math.round(metric.future)}</span>
                      <span className="text-green-600 font-medium">(+{Math.round(metric.delta)} пунктов)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Deteriorations */}
          {topDeteriorations.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border-2 border-red-200 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-bold text-red-800">Требуют внимания</h3>
              </div>
              <div className="space-y-3">
                {topDeteriorations.map((metric, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-red-100 animate-shake" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-red-600">#{idx + 1}</span>
                        <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold text-lg">↓</span>
                        <span className="text-red-700 font-bold text-sm">
                          {Math.abs(metric.deltaPercent).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                      <span>{Math.round(metric.current)} → {Math.round(metric.future)}</span>
                      <span className="text-red-600 font-medium">({Math.round(metric.delta)} пунктов)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-smooth">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Ожидаемая продолжительность жизни</h3>
        
        <div className="relative pt-8 pb-4">
          <div className="h-4 bg-gray-200 rounded-full w-full relative">
            {/* Base */}
            <div 
              className="absolute top-0 left-0 h-4 bg-slate-500 rounded-l-full transition-all duration-1000"
              style={{ width: `${(simulation.current.lifeExpectancy / 100) * 100}%` }}
            >
              <div className="absolute -top-8 right-0 text-slate-700 font-bold transform translate-x-1/2">
                {simulation.current.lifeExpectancy} лет
              </div>
            </div>

            {/* Gain */}
            <div 
              className="absolute top-0 h-4 bg-green-500 rounded-r-full transition-all duration-1000"
              style={{ 
                left: `${(simulation.current.lifeExpectancy / 100) * 100}%`,
                width: `${((simulation.counterfactual.lifeExpectancy - simulation.current.lifeExpectancy) / 100) * 100}%` 
              }}
            >
               <div className="absolute -top-8 right-0 text-green-700 font-bold transform translate-x-1/2">
                {simulation.counterfactual.lifeExpectancy} лет
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            {Number(yearsGained) > 0 ? (
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-lg border border-green-200">
                +{yearsGained} лет жизни
              </span>
            ) : (
              <span className="text-slate-500">Нет значимых изменений</span>
            )}
          </div>
        </div>
      </div>

      {/* Radar Chart Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-grow min-h-[300px] transition-smooth">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Комплексный анализ органов</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#cbd5e1" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Radar 
              name="Текущее состояние" 
              dataKey="A" 
              stroke="#64748b" 
              fill="#64748b" 
              fillOpacity={0.4}
              strokeWidth={2}
              className="transition-smooth"
            />
            <Radar 
              name="Прогноз" 
              dataKey="B" 
              stroke="#22c55e" 
              fill="#22c55e" 
              fillOpacity={0.5}
              strokeWidth={3}
              className="transition-smooth"
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Comparison Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Сравнительная таблица показателей</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Показатель</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Текущее</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Прогноз</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Изменение</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Дельта %</th>
              </tr>
            </thead>
            <tbody>
              {metricChanges.slice(0, 5).map((metric, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors animate-fadeIn`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <td className="py-3 px-4 font-medium text-slate-700">{metric.label}</td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 rounded-full font-medium text-slate-700">
                      {Math.round(metric.current)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full font-medium ${
                      metric.isImprovement ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {Math.round(metric.future)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-xl ${
                        metric.delta > 0 ? 'text-green-600' : metric.delta < 0 ? 'text-red-600' : 'text-slate-400'
                      }`}>
                        {metric.delta > 0 ? '↑' : metric.delta < 0 ? '↓' : '='}
                      </span>
                      <span className={`font-semibold ${
                        metric.delta > 0 ? 'text-green-700' : metric.delta < 0 ? 'text-red-700' : 'text-slate-500'
                      }`}>
                        {Math.abs(Math.round(metric.delta))}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm ${
                      metric.deltaPercent > 0 
                        ? 'bg-green-100 text-green-700' 
                        : metric.deltaPercent < 0 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {metric.deltaPercent > 0 ? '+' : ''}{metric.deltaPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* CVD Risk Special Row */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">10-летний риск сердечно-сосудистых заболеваний</h4>
              <p className="text-xs text-blue-700 mt-1">Снижение риска означает меньшую вероятность инфаркта/инсульта</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Текущий</p>
                <span className="text-2xl font-bold text-red-600">{simulation.current.cvdRisk10Year}%</span>
              </div>
              <span className="text-3xl text-green-600 font-bold">→</span>
              <div className="text-center">
                <p className="text-xs text-slate-600 mb-1">Прогноз</p>
                <span className="text-2xl font-bold text-green-600">{simulation.counterfactual.cvdRisk10Year}%</span>
              </div>
              <div className="text-center ml-4">
                <p className="text-xs text-slate-600 mb-1">Снижение</p>
                <span className={`text-xl font-bold ${
                  simulation.current.cvdRisk10Year > simulation.counterfactual.cvdRisk10Year 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {simulation.current.cvdRisk10Year > simulation.counterfactual.cvdRisk10Year ? '-' : '+'}
                  {Math.abs(simulation.current.cvdRisk10Year - simulation.counterfactual.cvdRisk10Year).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-xl border-l-4 border-yellow-400 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-yellow-900 text-base mb-2">AI Анализ и рекомендации:</h4>
            <p className="text-sm text-yellow-900 leading-relaxed italic">
              "{simulation.counterfactual.explanation}"
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LongevityTab;
