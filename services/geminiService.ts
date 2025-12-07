import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PatientProfile, Intervention, SimulationResult } from "../types";

// NOTE: Ideally, the API key should be in process.env.API_KEY.
// The code assumes the environment is set up correctly.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    current: {
      type: Type.OBJECT,
      properties: {
        cvdRisk10Year: { type: Type.NUMBER, description: "Estimated 10-year Cardiovascular Disease risk percentage (0-100)" },
        lifeExpectancy: { type: Type.NUMBER, description: "Estimated life expectancy in years based on current stats" },
        kidneyHealth: { type: Type.NUMBER, description: "Score 0-100 (100 is perfect)" },
        visionHealth: { type: Type.NUMBER, description: "Score 0-100 (100 is perfect)" },
        heartHealth: { type: Type.NUMBER, description: "Score 0-100 (100 is perfect)" },
        nerveHealth: { type: Type.NUMBER, description: "Score 0-100 (100 is perfect)" },
        vascularHealth: { type: Type.NUMBER, description: "Score 0-100 (100 is perfect)" },
        explanation: { type: Type.STRING, description: "Short medical explanation of the current state" }
      },
      required: ["cvdRisk10Year", "lifeExpectancy", "kidneyHealth", "visionHealth", "heartHealth", "nerveHealth", "vascularHealth", "explanation"]
    },
    counterfactual: {
      type: Type.OBJECT,
      properties: {
        cvdRisk10Year: { type: Type.NUMBER },
        lifeExpectancy: { type: Type.NUMBER },
        kidneyHealth: { type: Type.NUMBER },
        visionHealth: { type: Type.NUMBER },
        heartHealth: { type: Type.NUMBER },
        nerveHealth: { type: Type.NUMBER },
        vascularHealth: { type: Type.NUMBER },
        explanation: { type: Type.STRING, description: "Explanation of how the interventions improved the outcome" }
      },
      required: ["cvdRisk10Year", "lifeExpectancy", "kidneyHealth", "visionHealth", "heartHealth", "nerveHealth", "vascularHealth", "explanation"]
    }
  }
};

export const analyzePatientData = async (
  profile: PatientProfile, 
  intervention: Intervention
): Promise<SimulationResult> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    return getMockData(profile, intervention);
  }

  const prompt = `
    Act as a medical expert in endocrinology and cardiology. 
    Analyze the following patient data and perform a counterfactual analysis based on the proposed interventions.
    
    Current Patient Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}kg (Height: ${profile.height}cm)
    - Fasting Glucose: ${profile.glucose} mmol/L
    - HbA1c: ${profile.hba1c}%
    - Systolic BP: ${profile.systolicBP} mmHg
    - Smoker: ${profile.isSmoker ? 'Yes' : 'No'}
    - Diabetes Duration: ${profile.diabetesDuration} years

    Proposed Interventions (Counterfactual):
    - Target Weight: ${intervention.targetWeight}kg
    - Target Glucose: ${intervention.targetGlucose} mmol/L
    - Quit Smoking: ${intervention.quitSmoking ? 'Yes' : 'No (Unchanged)'}

    Return a JSON object comparing the 'current' status vs the 'counterfactual' status. 
    Be realistic about medical risks associated with diabetes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as SimulationResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return getMockData(profile, intervention);
  }
};

// Fallback if API key is missing or error
const getMockData = (profile: PatientProfile, intervention: Intervention): SimulationResult => {
  const bmi = profile.weight / ((profile.height/100) ** 2);
  const riskFactor = (profile.hba1c * 2) + (profile.isSmoker ? 10 : 0) + (bmi > 30 ? 5 : 0);
  
  const improvedRiskFactor = (intervention.targetGlucose * 2) + (intervention.quitSmoking ? 0 : (profile.isSmoker ? 10 : 0)) + (intervention.targetWeight / ((profile.height/100) ** 2) > 30 ? 5 : 0);

  return {
    current: {
      cvdRisk10Year: Math.min(Math.round(riskFactor * 1.5), 99),
      lifeExpectancy: Math.max(60, 90 - riskFactor),
      kidneyHealth: Math.max(20, 100 - riskFactor),
      visionHealth: Math.max(20, 100 - (profile.hba1c * 5)),
      heartHealth: Math.max(20, 100 - (riskFactor * 1.2)),
      nerveHealth: Math.max(20, 100 - (profile.hba1c * 4)),
      vascularHealth: Math.max(20, 100 - (profile.systolicBP - 110)),
      explanation: "Высокий уровень HbA1c и факторы риска значительно снижают показатели здоровья."
    },
    counterfactual: {
      cvdRisk10Year: Math.min(Math.round(improvedRiskFactor * 1.5), 99),
      lifeExpectancy: Math.max(60, 90 - improvedRiskFactor),
      kidneyHealth: Math.max(20, 100 - improvedRiskFactor),
      visionHealth: Math.max(20, 100 - (intervention.targetGlucose * 5)),
      heartHealth: Math.max(20, 100 - (improvedRiskFactor * 1.2)),
      nerveHealth: Math.max(20, 100 - (intervention.targetGlucose * 4)),
      vascularHealth: Math.max(20, 100 - (profile.systolicBP - 120)), // Assuming BP improves with weight
      explanation: "Снижение веса и контроль глюкозы могут продлить жизнь и улучшить состояние органов."
    }
  };
};

export const editFaceImage = async (base64Image: string, isImprovement: boolean, profile: PatientProfile): Promise<string | null> => {
  if (!apiKey) return null;

  // We trim the data:image/png;base64 part if present
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const prompt = isImprovement 
    ? "Make the person in the photo look healthier, more vibrant, with clearer skin and a slight smile. High quality, photorealistic."
    : `Make the person look like they are suffering from complications of chronic diabetes. Add signs of slight puffiness, fatigue, paler skin, and subtle aging. Maintain identity. High quality, photorealistic.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using flash-image for editing/generation as per instructions for general tasks
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Gemini 2.5 flash image text prompt with image input generates a description usually, 
    // unless used with generateImages or specific config. 
    // However, the instructions for 'Edit Images' use generateContent with image + text.
    // We need to parse the response to see if it returned an image.
    // The instruction examples show checking inlineData.

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
