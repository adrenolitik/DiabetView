import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SimulationResult } from '../../types';

interface Props {
  simulation: SimulationResult | null;
}

const LongevityTab: React.FC<Props> = ({ simulation }) => {
  if (!simulation) return <div className="text-center p-10">Загрузка данных...</div>;

  const radarData = [
    { subject: 'Почки', A: simulation.current.kidneyHealth, B: simulation.counterfactual.kidneyHealth, fullMark: 100 },
    { subject: 'Зрение', A: simulation.current.visionHealth, B: simulation.counterfactual.visionHealth, fullMark: 100 },
    { subject: 'Сердце', A: simulation.current.heartHealth, B: simulation.counterfactual.heartHealth, fullMark: 100 },
    { subject: 'Нервы', A: simulation.current.nerveHealth, B: simulation.counterfactual.nerveHealth, fullMark: 100 },
    { subject: 'Сосуды', A: simulation.current.vascularHealth, B: simulation.counterfactual.vascularHealth, fullMark: 100 },
  ];

  const yearsGained = (simulation.counterfactual.lifeExpectancy - simulation.current.lifeExpectancy).toFixed(1);

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      
      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
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
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-grow min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Комплексный анализ органов</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Текущее состояние" dataKey="A" stroke="#64748b" fill="#64748b" fillOpacity={0.4} />
            <Radar name="Сценарий" dataKey="B" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <h4 className="font-bold text-yellow-800 text-sm mb-1">AI Анализ:</h4>
        <p className="text-sm text-yellow-900 leading-relaxed italic">
          "{simulation.counterfactual.explanation}"
        </p>
      </div>

    </div>
  );
};

export default LongevityTab;
