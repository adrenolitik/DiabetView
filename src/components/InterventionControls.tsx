import React from 'react';
import { PatientProfile, Intervention } from '../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
  setIntervention: React.Dispatch<React.SetStateAction<Intervention>>;
}

const InterventionControls: React.FC<Props> = ({ profile, intervention, setIntervention }) => {
  const updateIntervention = <K extends keyof Intervention>(key: K, value: Intervention[K]) => {
    setIntervention(prev => ({ ...prev, [key]: value }));
  };

  const weightDiff = profile.weight - intervention.targetWeight;
  const glucoseDiff = profile.glucose - intervention.targetGlucose;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-lg font-semibold text-green-800">Сценарий интервенции</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Target Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Целевой вес: <span className="text-green-700 font-bold">{intervention.targetWeight} кг</span>
          </label>
          <input
            type="range"
            min={Math.max(50, profile.weight - 30)}
            max={profile.weight}
            value={intervention.targetWeight}
            onChange={e => updateIntervention('targetWeight', Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="mt-1 text-xs text-slate-600">
            {weightDiff > 0 ? (
              <span className="text-green-600 font-semibold">↓ Снижение на {weightDiff.toFixed(1)} кг</span>
            ) : (
              <span className="text-slate-400">Без изменений</span>
            )}
          </div>
        </div>

        {/* Target Glucose */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Целевая глюкоза: <span className="text-green-700 font-bold">{intervention.targetGlucose.toFixed(1)} ммоль/л</span>
          </label>
          <input
            type="range"
            min="4.0"
            max={Math.min(profile.glucose, 10)}
            step="0.1"
            value={intervention.targetGlucose}
            onChange={e => updateIntervention('targetGlucose', Number(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="mt-1 text-xs text-slate-600">
            {glucoseDiff > 0 ? (
              <span className="text-green-600 font-semibold">↓ Снижение на {glucoseDiff.toFixed(1)} ммоль/л</span>
            ) : (
              <span className="text-slate-400">Без изменений</span>
            )}
          </div>
        </div>

        {/* Quit Smoking */}
        <div className="flex flex-col justify-center">
          <label className="block text-sm font-medium text-slate-700 mb-2">Отказ от курения</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateIntervention('quitSmoking', !intervention.quitSmoking)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition shadow-sm ${
                intervention.quitSmoking
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              {intervention.quitSmoking ? '✓ Бросить курить' : '× Не бросать'}
            </button>
          </div>
        </div>

      </div>

      {/* Summary Box */}
      {(weightDiff > 0 || glucoseDiff > 0 || intervention.quitSmoking) && (
        <div className="mt-4 bg-white rounded-lg p-4 border border-green-300">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-green-700">План действий:</span>{' '}
            {weightDiff > 0 && `Снизить вес на ${weightDiff.toFixed(1)} кг. `}
            {glucoseDiff > 0 && `Достичь глюкозы ${intervention.targetGlucose.toFixed(1)} ммоль/л. `}
            {intervention.quitSmoking && profile.isSmoker && 'Отказаться от курения. '}
          </p>
        </div>
      )}
    </div>
  );
};

export default InterventionControls;
