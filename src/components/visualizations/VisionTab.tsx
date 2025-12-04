import React, { useState } from 'react';
import { PatientProfile, Intervention } from '../../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
}

const VisionTab: React.FC<Props> = ({ profile, intervention }) => {
  const [showComparison, setShowComparison] = useState(false);

  // Calculate blur intensity based on HbA1c and diabetes duration
  const currentBlur = Math.min(Math.max((profile.hba1c - 6) * 2 + profile.diabetesDuration * 0.3, 0), 15);
  const improvedBlur = Math.max(currentBlur - 8, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Влияние на зрение</h2>
        <p className="text-slate-600">Симуляция диабетической ретинопатии</p>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          {showComparison ? '👁️ Показать текущее состояние' : '✨ Сравнить с интервенцией'}
        </button>
      </div>

      {/* Vision Simulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Vision */}
        <div className="bg-slate-50 rounded-xl p-6 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            Текущее зрение
          </h3>
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 flex items-center justify-center text-6xl"
              style={{ filter: `blur(${currentBlur}px)` }}
            >
              <div className="grid grid-cols-3 gap-4 p-8">
                <div>🌳</div>
                <div>🏠</div>
                <div>🚗</div>
                <div>👤</div>
                <div>📚</div>
                <div>☀️</div>
              </div>
            </div>
            {/* Dark spots (scotomas) */}
            {currentBlur > 5 && (
              <>
                <div className="absolute top-10 right-10 w-16 h-16 bg-black/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-12 h-12 bg-black/20 rounded-full blur-lg"></div>
              </>
            )}
          </div>
          <div className="mt-4 bg-red-100 rounded-lg p-3 text-center">
            <p className="text-sm text-slate-700">
              <strong>Четкость:</strong> {Math.max(100 - currentBlur * 5, 20).toFixed(0)}%
            </p>
            <p className="text-xs text-slate-600 mt-1">
              HbA1c: {profile.hba1c.toFixed(1)}% | Стаж: {profile.diabetesDuration} лет
            </p>
          </div>
        </div>

        {/* Improved Vision */}
        {showComparison && (
          <div className="bg-slate-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              С интервенцией
            </h3>
            <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0 flex items-center justify-center text-6xl"
                style={{ filter: `blur(${improvedBlur}px)` }}
              >
                <div className="grid grid-cols-3 gap-4 p-8">
                  <div>🌳</div>
                  <div>🏠</div>
                  <div>🚗</div>
                  <div>👤</div>
                  <div>📚</div>
                  <div>☀️</div>
                </div>
              </div>
              {/* Fewer/lighter dark spots */}
              {improvedBlur > 2 && (
                <div className="absolute bottom-10 left-10 w-8 h-8 bg-black/10 rounded-full blur-md"></div>
              )}
            </div>
            <div className="mt-4 bg-green-100 rounded-lg p-3 text-center">
              <p className="text-sm text-slate-700">
                <strong>Четкость:</strong> {Math.max(100 - improvedBlur * 5, 80).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Целевая глюкоза: {intervention.targetGlucose.toFixed(1)} ммоль/л
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold text-orange-900">Диабетическая ретинопатия</h3>
          </div>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• Повреждение сосудов сетчатки</li>
            <li>• Размытие и потеря четкости</li>
            <li>• Темные пятна (скотомы)</li>
            <li>• Прогрессирует при плохом контроле глюкозы</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="font-semibold text-blue-900">Защита зрения</h3>
          </div>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• Контроль HbA1c &lt; 7%</li>
            <li>• Регулярные осмотры офтальмолога</li>
            <li>• Контроль артериального давления</li>
            <li>• Ранняя диагностика и лечение</li>
          </ul>
        </div>

      </div>

      {/* Impact Statistics */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
          Влияние контроля диабета на зрение
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">75%</div>
            <p className="text-xs text-slate-600">случаев слепоты можно предотвратить</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">50%</div>
            <p className="text-xs text-slate-600">снижение риска при HbA1c &lt; 7%</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-1">1x/год</div>
            <p className="text-xs text-slate-600">рекомендуемая частота осмотров</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-slate-600">
        <strong>⚠️ Примечание:</strong> Визуализация носит иллюстративный характер и не заменяет профессиональный офтальмологический осмотр. 
        При диабете необходимо регулярное наблюдение у специалиста.
      </div>
    </div>
  );
};

export default VisionTab;
