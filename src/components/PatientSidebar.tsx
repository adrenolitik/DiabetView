import React from 'react';
import { PatientProfile, Gender } from '../types';

interface Props {
  profile: PatientProfile;
  setProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
}

const PatientSidebar: React.FC<Props> = ({ profile, setProfile }) => {
  const updateProfile = <K extends keyof PatientProfile>(key: K, value: PatientProfile[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
      <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Профиль пациента</h2>
      
      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Пол</label>
        <div className="flex gap-2">
          {Object.values(Gender).map(g => (
            <button
              key={g}
              onClick={() => updateProfile('gender', g as Gender)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                profile.gender === g
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Возраст: <span className="text-blue-600 font-semibold">{profile.age} лет</span>
        </label>
        <input
          type="range"
          min="30"
          max="85"
          value={profile.age}
          onChange={e => updateProfile('age', Number(e.target.value))}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Weight & Height */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Вес: <span className="text-blue-600 font-semibold">{profile.weight} кг</span>
          </label>
          <input
            type="range"
            min="50"
            max="150"
            value={profile.weight}
            onChange={e => updateProfile('weight', Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Рост: <span className="text-blue-600 font-semibold">{profile.height} см</span>
          </label>
          <input
            type="range"
            min="150"
            max="200"
            value={profile.height}
            onChange={e => updateProfile('height', Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-center">
        <span className="text-xs text-slate-600">ИМТ:</span>
        <span className="text-xl font-bold text-blue-700 ml-2">{bmi}</span>
      </div>

      {/* Glucose */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Глюкоза: <span className="text-blue-600 font-semibold">{profile.glucose.toFixed(1)} ммоль/л</span>
        </label>
        <input
          type="range"
          min="4"
          max="15"
          step="0.1"
          value={profile.glucose}
          onChange={e => updateProfile('glucose', Number(e.target.value))}
          className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
      </div>

      {/* HbA1c */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          HbA1c: <span className="text-blue-600 font-semibold">{profile.hba1c.toFixed(1)}%</span>
        </label>
        <input
          type="range"
          min="5"
          max="12"
          step="0.1"
          value={profile.hba1c}
          onChange={e => updateProfile('hba1c', Number(e.target.value))}
          className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
      </div>

      {/* Blood Pressure */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Систолическое АД: <span className="text-blue-600 font-semibold">{profile.systolicBP} мм рт.ст.</span>
        </label>
        <input
          type="range"
          min="100"
          max="180"
          value={profile.systolicBP}
          onChange={e => updateProfile('systolicBP', Number(e.target.value))}
          className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
      </div>

      {/* Diabetes Duration */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Стаж диабета: <span className="text-blue-600 font-semibold">{profile.diabetesDuration} лет</span>
        </label>
        <input
          type="range"
          min="0"
          max="30"
          value={profile.diabetesDuration}
          onChange={e => updateProfile('diabetesDuration', Number(e.target.value))}
          className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Smoking */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
        <span className="text-sm font-medium text-slate-700">Курение</span>
        <button
          onClick={() => updateProfile('isSmoker', !profile.isSmoker)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            profile.isSmoker ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              profile.isSmoker ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;
