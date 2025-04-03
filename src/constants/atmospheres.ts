export type AtmosphereTone =
  | 'tender'
  | 'chaotic'
  | 'cold'
  | 'neutral'
  | 'melancholic'
  | 'oppressive'
  | 'inspiring'
  | 'eerie'
  | 'vibrant';

// Атмосферы с весами для генерации
export const ATMOSPHERE_POOL: { value: AtmosphereTone; weight: number }[] = [
  { value: 'tender', weight: 3 },
  { value: 'chaotic', weight: 2 },
  { value: 'cold', weight: 2 },
  { value: 'neutral', weight: 2 },
  { value: 'melancholic', weight: 2 },
  { value: 'oppressive', weight: 1 },
  { value: 'inspiring', weight: 2 },
  { value: 'eerie', weight: 1 },
  { value: 'vibrant', weight: 1 },
];

// Человеческие переводы для UI / LLM
export const ATMOSPHERE_LABELS: Record<AtmosphereTone, string> = {
  tender: 'нежная',
  chaotic: 'хаотичная',
  cold: 'холодная',
  neutral: 'нейтральная',
  melancholic: 'меланхоличная',
  oppressive: 'угнетающая',
  inspiring: 'вдохновляющая',
  eerie: 'тревожная',
  vibrant: 'яркая',
};
