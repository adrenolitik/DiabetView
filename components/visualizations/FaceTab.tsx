import React, { useState, useRef } from 'react';
import { PatientProfile, Intervention } from '../../types';
import { editFaceImage } from '../../services/geminiService';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
}

const FaceTab: React.FC<Props> = ({ profile, intervention }) => {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (improve: boolean) => {
    if (!image) return;
    setLoading(true);
    const result = await editFaceImage(image, improve, profile);
    setGeneratedImage(result);
    setLoading(false);
  };

  const improvementScore = (profile.weight - intervention.targetWeight) + (profile.glucose - intervention.targetGlucose) * 2;
  const isInterventionBetter = improvementScore > 0 || (profile.isSmoker && intervention.quitSmoking);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
        {image ? (
          <div className="relative w-full max-w-sm">
            <img src={image} alt="Original" className="rounded-lg shadow-lg w-full h-auto object-cover" />
            <button 
              onClick={() => { setImage(null); setGeneratedImage(null); }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 px-3 text-xs"
            >
              Сброс
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-slate-600">Загрузите фото лица</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition"
            >
              Выбрать файл
            </button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>
        )}
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-slate-700">Текущее состояние</p>
          <p className="text-xs text-slate-500">Риск: {profile.hba1c > 7 ? 'Высокий' : 'Умеренный'}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl bg-white relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {generatedImage ? (
           <img src={generatedImage} alt="Simulated" className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover" />
        ) : (
          <div className="flex flex-col items-center text-center p-10 text-slate-400">
             <span className="text-6xl mb-4">✨</span>
             <p>AI Симуляция</p>
             {!image && <p className="text-xs">Загрузите фото слева для старта</p>}
          </div>
        )}

        <div className="mt-6 w-full">
           <p className="text-center text-sm font-semibold text-slate-700 mb-3">
             {isInterventionBetter ? "Прогноз при улучшении привычек" : "Прогноз при ухудшении"}
           </p>
           <button
             disabled={!image || loading}
             onClick={() => handleGenerate(isInterventionBetter)}
             className={`w-full py-3 rounded-lg text-white font-medium transition ${!image ? 'bg-slate-300 cursor-not-allowed' : isInterventionBetter ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
           >
             {loading ? 'Генерация...' : 'Показать эффект'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default FaceTab;
