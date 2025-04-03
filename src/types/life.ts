// src/types/life.ts

export type LifeTraits = {
  courage: number;
  empathy: number;
  independence: number;
  guilt: number;
  trust: number;
};

export type AdviceImpact = {
  resonanceScore: number;
  matchedTraits: (keyof LifeTraits)[];
  importanceMultiplier: number;
  emotionalEffect: Partial<LifeTraits>;
  soulShift: number;
};

export type AwarenessLevel = 'conscious' | 'vague' | 'unconscious';

export interface CultureContext {
  regionName: string;    // Вымышленное название региона
  household: string;     // Как устроен быт семьи ("бабушка — авторитет")
  values: string[];      // Культурные установки ("не показывай слабость")
  settingStyle: string;  // Визуально-эмоциональное описание окружения
}

export interface MoralCompass {
  value: string;         // Этическая установка ("никогда не лги")
  origin: 'cultural' | 'learned' | 'trauma-based';
  stability: number;     // Уверенность в компасе (0–100)
}

export interface MemoryEvent {
  quote: string;                         // Сам текст совета
  emotionalEcho: string;                // "затронуло", "отвергнуто", "осталось в голове"
  effect: Partial<LifeTraits>;          // Какие черты были затронуты
  round: number;                        // На каком этапе это произошло
}

export type LifeTone =
  | 'dramatic'
  | 'melancholic'
  | 'inspiring'
  | 'neutral'
  | 'chaotic'
  | 'tender'
  | 'cold'
  | 'oppressive'
  | 'vibrant'
  | 'eerie'
  | string; // Расширяемость

export interface LifeProfile {
  name: string;
  gender: 'male' | 'female' | 'nonbinary';
  age: number;
  culture: CultureContext;
  atmosphere: LifeTone;

  coreTraits: LifeTraits;
  hiddenDesire: string;
  coreFear: string;
  philosophy: string;
  selfNarrative: string;
  awarenessLevel: AwarenessLevel;
  moralCompass: MoralCompass;
}
