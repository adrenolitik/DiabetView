import React, { useState, useEffect, useCallback } from 'react';
import PatientSidebar from './components/PatientSidebar';
import InterventionControls from './components/InterventionControls';
import FaceTab from './components/visualizations/FaceTab';
import VisionTab from './components/visualizations/VisionTab';
import HeartTab from './components/visualizations/HeartTab';
import LongevityTab from './components/visualizations/LongevityTab';
import { PatientProfile, Intervention, TabId, SimulationResult, Gender } from './types';
import { analyzePatientData } from './services/geminiService';

const App: React.FC = () => {
  // Initial State
  const [profile, setProfile] = useState<PatientProfile>({
    age: 55,
    weight: 95,
    height: 175,
    glucose: 8.5,
    hba1c: 7.8,
    systolicBP: 145,
    isSmoker: true,
    diabetesDuration: 5,
    gender: Gender.MALE
  });

  const [intervention, setIntervention] = useState<Intervention>({
    targetWeight: 85,
    targetGlucose: 6.0,
    quitSmoking: true
  });

  const [activeTab, setActiveTab] = useState<TabId>('longevity');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced Analysis
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const result = await analyzePatientData(profile, intervention);
      setSimulationResult(result);
      setLoading(false);
    }, 800); // 800ms debounce to avoid API spam

    return () => clearTimeout(timer);
  }, [profile, intervention]);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'face', label: 'Лицо', icon: '👤' },
    { id: 'vision', label: 'Зрение', icon: '👁️' },
    { id: 'vascular', label: 'Сосуды', icon: '❤️' },
    { id: 'longevity', label: 'Долголетие', icon: '⏳' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800">
      
      {/* Sidebar - Input */}
      <aside className="w-full md:w-80 p-4 shrink-0 h-auto md:h-screen md:sticky md:top-0 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <span className="text-3xl">🩺</span> DiabetView
        </h1>
        <PatientSidebar profile={profile} setProfile={setProfile} />
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 flex flex-col h-screen overflow-hidden">
        
        {/* Intervention Controls (Top) */}
        <InterventionControls 
          profile={profile} 
          intervention={intervention} 
          setIntervention={setIntervention} 
        />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visualization Content Area */}
        <div className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto relative">
          {loading && !simulationResult && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
               <div className="flex flex-col items-center">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                 <span className="text-sm text-slate-500">Анализ данных...</span>
               </div>
             </div>
          )}

          {activeTab === 'face' && <FaceTab profile={profile} intervention={intervention} />}
          {activeTab === 'vision' && <VisionTab profile={profile} intervention={intervention} />}
          {activeTab === 'vascular' && <HeartTab simulation={simulationResult} />}
          {activeTab === 'longevity' && <LongevityTab simulation={simulationResult} />}
        </div>
        
        {/* Footer */}
        <footer className="mt-4 text-center text-xs text-slate-400">
          DiabetView Prototype • Powered by Gemini AI • Not a medical device
        </footer>
      </main>
    </div>
  );
};

export default App;
