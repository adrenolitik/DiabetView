import React from 'react';
import { PatientProfile, Gender } from '../types';

interface Props {
  profile: PatientProfile;
  setProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
}

const PatientSidebar: React.FC<Props> = ({ profile, setProfile }) => {
  const handleChange = (field: keyof PatientProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const calculateBMI = () => {
    const hM = profile.height / 100;
    return (profile.weight / (hM * hM)).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 h-full border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Профиль Пациента</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-600">Возраст</label>
           <input 
             type="number" 
             value={profile.age} 
             onChange={(e) => handleChange('age', Number(e.target.value))}
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 p-2"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-600">Пол</label>
           <select 
             value={profile.gender}
             onChange={(e) => handleChange('gender', e.target.value)}
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm bg-slate-50 p-2"
           >
             <option value={Gender.MALE}>М</option>
             <option value={Gender.FEMALE}>Ж</option>
           </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600">Вес (кг) / ИМТ: <span className="text-blue-600">{calculateBMI()}</span></label>
        <input 
          type="range" min="40" max="150" 
          value={profile.weight} 
          onChange={(e) => handleChange('weight', Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>40 кг</span>
          <span>{profile.weight} кг</span>
          <span>150 кг</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600">Рост (см)</label>
        <input 
             type="number" 
             value={profile.height} 
             onChange={(e) => handleChange('height', Number(e.target.value))}
             className="mt-1 block w-full rounded-md bg-slate-50 p-2"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-semibold text-slate-700">Клинические показатели</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-600">Глюкоза (mmol/L)</label>
          <input 
            type="number" step="0.1"
            value={profile.glucose} 
            onChange={(e) => handleChange('glucose', Number(e.target.value))}
            className="mt-1 block w-full rounded-md bg-slate-50 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600">HbA1c (%)</label>
           <input 
            type="range" min="4" max="15" step="0.1"
            value={profile.hba1c} 
            onChange={(e) => handleChange('hba1c', Number(e.target.value))}
            className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-right text-sm font-bold text-red-600">{profile.hba1c}%</div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-600">Систолическое АД (mmHg)</label>
           <input 
             type="number" 
             value={profile.systolicBP} 
             onChange={(e) => handleChange('systolicBP', Number(e.target.value))}
             className="mt-1 block w-full rounded-md bg-slate-50 p-2"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-600">Стаж диабета (лет)</label>
           <input 
             type="number" 
             value={profile.diabetesDuration} 
             onChange={(e) => handleChange('diabetesDuration', Number(e.target.value))}
             className="mt-1 block w-full rounded-md bg-slate-50 p-2"
           />
        </div>
      </div>

      <div className="flex items-center pt-4">
        <input 
          id="smoker" 
          type="checkbox" 
          checked={profile.isSmoker}
          onChange={(e) => handleChange('isSmoker', e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="smoker" className="ml-2 text-sm font-medium text-slate-900">Пациент курит</label>
      </div>
    </div>
  );
};

export default PatientSidebar;
