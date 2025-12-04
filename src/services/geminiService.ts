import { GoogleGenerativeAI } from '@google/generative-ai';
import { PatientProfile, Intervention, SimulationResult, HealthMetrics } from '../types';

const API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY || 'PLACEHOLDER_API_KEY';

// Fallback mock data in case API is not available
const generateMockMetrics = (profile: PatientProfile, intervention: Intervention): SimulationResult => {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const targetBMI = intervention.targetWeight / Math.pow(profile.height / 100, 2);
  
  // Current state (worse metrics)
  const baseRisk = 15 + (profile.age - 50) * 0.5 + (bmi - 25) * 2 + (profile.hba1c - 7) * 5;
  const smokingPenalty = profile.isSmoker ? 8 : 0;
  
  const current: HealthMetrics = {
    cvdRisk10Year: Math.min(Math.max(baseRisk + smokingPenalty, 5), 60),
    lifeExpectancy: Math.max(70 - profile.age - (bmi - 25) * 0.5 - profile.diabetesDuration * 0.3, 5),
    kidneyHealth: Math.max(100 - profile.hba1c * 8 - profile.diabetesDuration * 2, 30),
    visionHealth: Math.max(100 - profile.hba1c * 10 - profile.diabetesDuration * 3, 20),
    heartHealth: Math.max(100 - (profile.systolicBP - 120) * 0.5 - profile.hba1c * 5, 30),
    nerveHealth: Math.max(100 - profile.glucose * 8 - profile.diabetesDuration * 2.5, 25),
    vascularHealth: Math.max(100 - profile.hba1c * 9 - (bmi - 22) * 2, 25),
    explanation: `Текущее состояние: ИМТ ${bmi.toFixed(1)}, HbA1c ${profile.hba1c}%, систолическое АД ${profile.systolicBP} мм рт.ст. Повышенный риск сердечно-сосудистых осложнений.`
  };

  // Counterfactual (better metrics with intervention)
  const improvedRisk = 8 + (profile.age - 50) * 0.3 + (targetBMI - 23) * 1.5 + (intervention.targetGlucose - 5.5) * 3;
  const smokingBonus = intervention.quitSmoking ? 0 : 5;
  
  const counterfactual: HealthMetrics = {
    cvdRisk10Year: Math.min(Math.max(improvedRisk + smokingBonus, 3), 40),
    lifeExpectancy: Math.max(85 - profile.age - (targetBMI - 22) * 0.2, current.lifeExpectancy + 3),
    kidneyHealth: Math.min(current.kidneyHealth + 25, 95),
    visionHealth: Math.min(current.visionHealth + 30, 95),
    heartHealth: Math.min(current.heartHealth + 28, 95),
    nerveHealth: Math.min(current.nerveHealth + 32, 95),
    vascularHealth: Math.min(current.vascularHealth + 35, 95),
    explanation: `При целевых показателях: ИМТ ${targetBMI.toFixed(1)}, глюкоза ${intervention.targetGlucose} ммоль/л${intervention.quitSmoking ? ', отказ от курения' : ''}. Значительное снижение рисков и улучшение прогноза.`
  };

  return { current, counterfactual };
};

export const analyzePatientData = async (
  profile: PatientProfile, 
  intervention: Intervention
): Promise<SimulationResult> => {
  
  // If no valid API key, return mock data
  if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
    console.warn('Using mock data (no Gemini API key configured)');
    return generateMockMetrics(profile, intervention);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Вы - медицинский аналитический AI. Проанализируйте следующие данные пациента с диабетом:

**Текущие показатели:**
- Возраст: ${profile.age} лет
- Вес: ${profile.weight} кг, Рост: ${profile.height} см (ИМТ: ${(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)})
- Глюкоза: ${profile.glucose} ммоль/л
- HbA1c: ${profile.hba1c}%
- Систолическое АД: ${profile.systolicBP} мм рт.ст.
- Курение: ${profile.isSmoker ? 'Да' : 'Нет'}
- Стаж диабета: ${profile.diabetesDuration} лет
- Пол: ${profile.gender}

**Планируемые изменения:**
- Целевой вес: ${intervention.targetWeight} кг
- Целевая глюкоза: ${intervention.targetGlucose} ммоль/л
- Отказ от курения: ${intervention.quitSmoking ? 'Да' : 'Нет'}

Предоставьте JSON с двумя сценариями (current и counterfactual), содержащими:
- cvdRisk10Year (риск ССЗ за 10 лет, %)
- lifeExpectancy (ожидаемая продолжительность жизни в годах от сегодняшнего дня)
- kidneyHealth, visionHealth, heartHealth, nerveHealth, vascularHealth (шкала 0-100)
- explanation (краткое пояснение на русском)

Формат ответа: {"current": {...}, "counterfactual": {...}}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as SimulationResult;
    }
    
    // Fallback to mock data if parsing fails
    console.warn('Failed to parse Gemini response, using mock data');
    return generateMockMetrics(profile, intervention);
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return generateMockMetrics(profile, intervention);
  }
};
