import React, { useState } from 'react';
import { PatientProfile, Intervention } from '../../types';

interface Props {
  profile: PatientProfile;
  intervention: Intervention;
}

const FaceTab: React.FC<Props> = ({ profile, intervention }) => {
  const [showImproved, setShowImproved] = useState(false);

  // Calculate health impact on appearance
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const targetBMI = intervention.targetWeight / Math.pow(profile.height / 100, 2);
  
  const currentHealthScore = Math.max(100 - (bmi - 22) * 5 - (profile.hba1c - 6) * 10 - (profile.isSmoker ? 15 : 0), 20);
  const improvedHealthScore = Math.min(currentHealthScore + 35, 95);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Внешние признаки здоровья</h2>
        <p className="text-slate-600">Как образ жизни отражается на внешности</p>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowImproved(!showImproved)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          {showImproved ? '👤 Показать текущее состояние' : '✨ Показать улучшенное состояние'}
        </button>
      </div>

      {/* Face Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current State */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            Текущее состояние
          </h3>
          
          <div className="relative flex items-center justify-center">
            {/* Face representation */}
            <div className="text-9xl opacity-90 relative">
              {profile.isSmoker ? '😟' : bmi > 30 ? '😐' : profile.hba1c > 8 ? '😕' : '🙂'}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-600">Общее здоровье</span>
                <span className="text-xs font-bold text-orange-600">{currentHealthScore.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentHealthScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-orange-100 rounded-lg p-3 text-sm text-slate-700 space-y-1">
              {bmi > 30 && <div>• Избыточный вес (ИМТ {bmi.toFixed(1)})</div>}
              {profile.hba1c > 7.5 && <div>• Плохой контроль глюкозы</div>}
              {profile.isSmoker && <div>• Курение влияет на кожу</div>}
              {profile.systolicBP > 140 && <div>• Повышенное давление</div>}
            </div>
          </div>
        </div>

        {/* Improved State */}
        {showImproved && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              С интервенцией
            </h3>
            
            <div className="relative flex items-center justify-center">
              {/* Improved face */}
              <div className="text-9xl relative">
                😊
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-white rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-600">Общее здоровье</span>
                  <span className="text-xs font-bold text-green-600">{improvedHealthScore.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${improvedHealthScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-green-100 rounded-lg p-3 text-sm text-slate-700 space-y-1">
                <div>✓ Нормализация веса (ИМТ {targetBMI.toFixed(1)})</div>
                <div>✓ Контроль глюкозы {intervention.targetGlucose.toFixed(1)} ммоль/л</div>
                {intervention.quitSmoking && profile.isSmoker && <div>✓ Отказ от курения</div>}
                <div>✓ Улучшение состояния кожи</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Health Markers */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Внешние признаки диабета</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl">💧</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 mb-1">Состояние кожи</h4>
              <p className="text-xs text-slate-600">Сухость, медленное заживление ран, инфекции</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl">😴</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 mb-1">Темные круги</h4>
              <p className="text-xs text-slate-600">Усталость, плохой сон из-за колебаний глюкозы</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl">🦷</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 mb-1">Здоровье зубов</h4>
              <p className="text-xs text-slate-600">Повышенный риск пародонтоза и инфекций</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl">💪</div>
            <div>
              <h4 className="font-semibold text-sm text-slate-800 mb-1">Мышечная масса</h4>
              <p className="text-xs text-slate-600">Снижение тонуса при плохом контроле</p>
            </div>
          </div>

        </div>
      </div>

      {/* Benefits Timeline */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Когда вы заметите улучшения</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0">
              2 нед
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 text-sm text-slate-700">
              Улучшение цвета кожи, повышение энергии
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0">
              1 мес
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 text-sm text-slate-700">
              Улучшение состояния кожи, снижение отечности
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0">
              3 мес
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 text-sm text-slate-700">
              Заметное улучшение тонуса, здоровый вид
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0">
              6 мес
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 text-sm text-slate-700">
              Значительное улучшение всех показателей здоровья
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-slate-600">
        <strong>⚠️ Примечание:</strong> Визуализация носит иллюстративный характер. Реальные изменения зависят от индивидуальных особенностей 
        и соблюдения рекомендаций врача.
      </div>
    </div>
  );
};

export default FaceTab;
