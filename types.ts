export enum Gender {
  MALE = 'Мужской',
  FEMALE = 'Женский'
}

export interface PatientProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  glucose: number; // mmol/L
  hba1c: number; // %
  systolicBP: number; // mmHg
  isSmoker: boolean;
  diabetesDuration: number; // years
  gender: Gender;
}

export interface Intervention {
  targetWeight: number;
  targetGlucose: number;
  quitSmoking: boolean;
}

export interface HealthMetrics {
  cvdRisk10Year: number; // %
  lifeExpectancy: number; // years
  kidneyHealth: number; // 0-100
  visionHealth: number; // 0-100
  heartHealth: number; // 0-100
  nerveHealth: number; // 0-100
  vascularHealth: number; // 0-100
  explanation: string;
}

export interface SimulationResult {
  current: HealthMetrics;
  counterfactual: HealthMetrics;
}

export type TabId = 'face' | 'vision' | 'vascular' | 'longevity';