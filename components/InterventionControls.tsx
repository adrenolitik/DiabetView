import React from 'react';
import { Intervention, PatientProfile } from '../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
  setIntervention: React.Dispatch<React.SetStateAction<Intervention>>;
}

const InterventionControls: React.FC<Props> = ({ profile, intervention, setIntervention }) => {
  const handleChange = (field: keyof Intervention, value: any) => {
    setIntervention(prev => ({ ...prev, [field]: value }));
  };

  const weightDiff = (intervention.targetWeight - profile.weight).toFixed(1);
  const weightColor = Number(weightDiff) <= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 shadow-sm">
      <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
        <span className="bg-blue-200 text-blue-800 p-1 px-2 rounded mr-2 text-sm">WHAT-IF</span>
        Сценарии изменений
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight Control */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            Целевой вес: <span className="font-bold">{intervention.targetWeight} кг</span>
            <span className={`ml-2 text-xs ${weightColor}`}>({weightDiff} кг)</span>
          </label>
          <input 
            type="range" 
            min="40" max="150" 
            value={intervention.targetWeight}
            onChange={(e) => handleChange('targetWeight', Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Glucose Control */}
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            Цель по глюкозе: <span className="font-bold">{intervention.targetGlucose} mmol/L</span>
          </label>
          <input 
            type="range" 
            min="3.5" max="15" step="0.1"
            value={intervention.targetGlucose}
            onChange={(e) => handleChange('targetGlucose', Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Smoking Control */}
        <div className="flex items-center justify-start md:justify-center">
           <label className="flex items-center cursor-pointer relative">
            <input 
              type="checkbox" 
              checked={intervention.quitSmoking}
              onChange={(e) => handleChange('quitSmoking', e.target.checked)}
              className="sr-only peer"
              disabled={!profile.isSmoker}
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${!profile.isSmoker ? 'opacity-50 cursor-not-allowed' : 'peer-checked:bg-green-600'}`}></div>
            <span className="ml-3 text-sm font-medium text-blue-900">
              {profile.isSmoker ? 'Отказ от курения' : 'Не курит'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default InterventionControls;
