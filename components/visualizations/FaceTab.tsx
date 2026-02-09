import React, { useState, useRef } from 'react';
import { PatientProfile, Intervention } from '../../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
}

interface HealthZones {
  skinColor: number; // 0-100
  eyeHealth: number; // 0-100
  cheekSwelling: number; // 0-100
  lipColor: number; // 0-100
}

const FaceTab: React.FC<Props> = ({ profile, intervention }) => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate health zones based on patient profile
  const calculateHealthZones = (prof: PatientProfile, _interv: Intervention): HealthZones => {
    const bmi = prof.weight / ((prof.height / 100) ** 2);
    
    return {
      skinColor: Math.max(20, 100 - (prof.hba1c * 8) - (prof.isSmoker ? 15 : 0)),
      eyeHealth: Math.max(20, 100 - (prof.hba1c * 6) - (prof.diabetesDuration * 2)),
      cheekSwelling: Math.max(20, 100 - (bmi > 30 ? (bmi - 25) * 4 : 0) - (prof.systolicBP - 120) * 0.5),
      lipColor: Math.max(20, 100 - (prof.isSmoker ? 20 : 0) - (prof.systolicBP - 120) * 0.3)
    };
  };

  const currentZones = calculateHealthZones(profile, intervention);
  const futureZones = calculateHealthZones(
    { ...profile, weight: intervention.targetWeight, glucose: intervention.targetGlucose, hba1c: intervention.targetGlucose * 1.1, isSmoker: !intervention.quitSmoking },
    intervention
  );

  const improvementScore = (profile.weight - intervention.targetWeight) + (profile.glucose - intervention.targetGlucose) * 2;
  const isInterventionBetter = improvementScore > 0 || (profile.isSmoker && intervention.quitSmoking);

  // Helper to get color based on health score
  const getHealthColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#84cc16'; // lime
    if (score >= 40) return '#eab308'; // yellow
    if (score >= 20) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // SVG Face Component
  const FaceVisualization: React.FC<{ zones: HealthZones; title: string }> = ({ zones, title }) => (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
      <svg width="200" height="280" viewBox="0 0 200 280" className="drop-shadow-lg">
        {/* Face outline */}
        <ellipse cx="100" cy="120" rx="80" ry="100" fill={getHealthColor(zones.skinColor)} stroke="#475569" strokeWidth="2" className="transition-all duration-700" />
        
        {/* Hair */}
        <path d="M 30 80 Q 20 40, 50 30 Q 80 20, 100 25 Q 120 20, 150 30 Q 180 40, 170 80 Z" fill="#1e293b" opacity="0.8" />
        
        {/* Left eye */}
        <ellipse cx="70" cy="100" rx="18" ry="22" fill="white" stroke="#475569" strokeWidth="1.5" />
        <circle cx="70" cy="100" r="10" fill={getHealthColor(zones.eyeHealth)} className="transition-all duration-700" />
        <circle cx="72" cy="98" r="4" fill="#1e293b" />
        <circle cx="74" cy="96" r="2" fill="white" opacity="0.8" />
        {/* Eye redness indicator (lower health = more red) */}
        {zones.eyeHealth < 60 && (
          <>
            <line x1="62" y1="100" x2="78" y2="100" stroke="#ef4444" strokeWidth="0.5" opacity="0.6" />
            <line x1="65" y1="103" x2="75" y2="103" stroke="#ef4444" strokeWidth="0.5" opacity="0.4" />
          </>
        )}
        
        {/* Right eye */}
        <ellipse cx="130" cy="100" rx="18" ry="22" fill="white" stroke="#475569" strokeWidth="1.5" />
        <circle cx="130" cy="100" r="10" fill={getHealthColor(zones.eyeHealth)} className="transition-all duration-700" />
        <circle cx="132" cy="98" r="4" fill="#1e293b" />
        <circle cx="134" cy="96" r="2" fill="white" opacity="0.8" />
        {zones.eyeHealth < 60 && (
          <>
            <line x1="122" y1="100" x2="138" y2="100" stroke="#ef4444" strokeWidth="0.5" opacity="0.6" />
            <line x1="125" y1="103" x2="135" y2="103" stroke="#ef4444" strokeWidth="0.5" opacity="0.4" />
          </>
        )}
        
        {/* Eyebrows */}
        <path d="M 55 85 Q 70 80, 85 85" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 115 85 Q 130 80, 145 85" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Nose */}
        <path d="M 100 110 L 95 135 L 100 140 L 105 135 Z" fill="#94a3b8" opacity="0.3" />
        <ellipse cx="92" cy="140" rx="4" ry="5" fill="#475569" opacity="0.2" />
        <ellipse cx="108" cy="140" rx="4" ry="5" fill="#475569" opacity="0.2" />
        
        {/* Cheeks - swelling indicator */}
        <ellipse 
          cx="55" 
          cy="130" 
          rx={zones.cheekSwelling < 70 ? "25" : "20"} 
          ry={zones.cheekSwelling < 70 ? "20" : "15"} 
          fill={getHealthColor(zones.cheekSwelling)} 
          opacity="0.3" 
          className="transition-all duration-700"
        />
        <ellipse 
          cx="145" 
          cy="130" 
          rx={zones.cheekSwelling < 70 ? "25" : "20"} 
          ry={zones.cheekSwelling < 70 ? "20" : "15"} 
          fill={getHealthColor(zones.cheekSwelling)} 
          opacity="0.3" 
          className="transition-all duration-700"
        />
        
        {/* Mouth */}
        <path d="M 75 165 Q 100 175, 125 165" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Lips - color indicator */}
        <ellipse cx="100" cy="165" rx="20" ry="5" fill={getHealthColor(zones.lipColor)} opacity="0.6" className="transition-all duration-700" />
        
        {/* Dark circles under eyes (if health is poor) */}
        {zones.eyeHealth < 50 && (
          <>
            <ellipse cx="70" cy="112" rx="15" ry="8" fill="#64748b" opacity="0.25" />
            <ellipse cx="130" cy="112" rx="15" ry="8" fill="#64748b" opacity="0.25" />
          </>
        )}
      </svg>
      
      {/* Health indicators */}
      <div className="mt-4 w-full max-w-[200px] space-y-2 text-xs">
        <HealthBar label="Кожа" value={zones.skinColor} />
        <HealthBar label="Глаза" value={zones.eyeHealth} />
        <HealthBar label="Отечность" value={zones.cheekSwelling} />
        <HealthBar label="Циркуляция" value={zones.lipColor} />
      </div>
    </div>
  );

  const HealthBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex items-center gap-2">
      <span className="w-20 text-slate-600">{label}:</span>
      <div className="flex-grow h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-700 ease-out rounded-full" 
          style={{ 
            width: `${value}%`, 
            backgroundColor: getHealthColor(value)
          }}
        />
      </div>
      <span className="w-8 text-right font-medium" style={{ color: getHealthColor(value) }}>
        {Math.round(value)}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <strong>Визуализация карты здоровья лица</strong> - Показывает влияние диабета на внешние признаки здоровья.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              💡 Для генерации реалистичных фото лица требуется подключение к API генерации изображений (Stable Diffusion, DALL-E и т.д.)
            </p>
          </div>
        </div>
      </div>

      {/* Face Health Map Visualization */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Карта здоровья лица</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
            <FaceVisualization zones={currentZones} title="Текущее состояние" />
            <div className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">
              <p className="text-xs font-medium text-slate-700">HbA1c: {profile.hba1c}% • Стаж: {profile.diabetesDuration} лет</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border-2 border-green-200 animate-pulse-slow">
            <FaceVisualization zones={futureZones} title="Прогноз после интервенций" />
            <div className="mt-4 px-4 py-2 bg-green-200 rounded-lg">
              <p className="text-xs font-medium text-green-800">
                {isInterventionBetter ? '✓ Улучшение показателей' : '⚠ Требуется контроль'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Health Changes */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Детальные изменения</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ChangeCard 
            label="Цвет кожи"
            icon="🎨"
            current={currentZones.skinColor} 
            future={futureZones.skinColor}
            description="Общее состояние здоровья"
          />
          <ChangeCard 
            label="Здоровье глаз"
            icon="👁️"
            current={currentZones.eyeHealth} 
            future={futureZones.eyeHealth}
            description="Риск ретинопатии"
          />
          <ChangeCard 
            label="Отечность"
            icon="💧"
            current={currentZones.cheekSwelling} 
            future={futureZones.cheekSwelling}
            description="Задержка жидкости"
          />
          <ChangeCard 
            label="Кровообращение"
            icon="💋"
            current={currentZones.lipColor} 
            future={futureZones.lipColor}
            description="Состояние сосудов"
          />
        </div>
      </div>

      {/* Optional: Photo Upload Section */}
      <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">Загрузка фото для AI-анализа (в разработке)</h4>
        <div className="flex flex-col items-center">
          {image ? (
            <div className="relative w-full max-w-xs">
              <img src={image} alt="Original" className="rounded-lg shadow-lg w-full h-auto object-cover" />
              <button 
                onClick={() => { setImage(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 px-3 text-xs hover:bg-red-600 transition"
              >
                Сброс
              </button>
            </div>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-slate-600">Загрузите фото лица для персонализированного анализа</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Выбрать файл
              </button>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              <p className="mt-2 text-xs text-slate-500">Требуется API для обработки изображений</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChangeCard: React.FC<{ label: string; icon: string; current: number; future: number; description: string }> = 
  ({ label, icon, current, future, description }) => {
  const delta = future - current;
  const deltaPercent = ((delta / current) * 100).toFixed(1);
  const isImprovement = delta > 0;
  
  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Текущее:</span>
          <span className="text-sm font-medium text-slate-700">{Math.round(current)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Прогноз:</span>
          <span className="text-sm font-medium text-slate-700">{Math.round(future)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-xs font-semibold">Изменение:</span>
          <span className={`text-sm font-bold flex items-center gap-1 ${isImprovement ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-slate-500'}`}>
            {isImprovement ? '↑' : delta < 0 ? '↓' : '='} {Math.abs(parseFloat(deltaPercent))}%
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2 italic">{description}</p>
    </div>
  );
};

export default FaceTab;
