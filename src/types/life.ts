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

export interface LifeProfile {
    name: string; // Имя, сгенерированное вместе с культурой
    gender: 'male' | 'female' | 'nonbinary';
    age: number; // Предлагаю фиксировать в диапазоне 8–14
    culture: CultureContext; // см. ниже
    atmosphere: LifeTone; // эмоциональная окраска рождения Жизни (вдохновляющая, мрачная и т.д.)
    coreTraits: LifeTraits; // базовые психологические черты
    hiddenDesire: string; // строка, а не enum — чтобы была гибкость
    selfNarrative: string; // как Жизнь воспринимает саму себя
    coreFear: string; // глубинный страх (может быть неосознан)
    philosophy: string; // кредо, внутренний девиз (может быть осознан или нет)
    awarenessLevel: 'conscious' | 'vague' | 'unconscious'; // насколько Жизнь осознаёт своё желание
  }
  
export interface CultureContext {
regionName: string; // вымышленное название
household: string;  // описание быта семьи ("строгий отец", "бабушка — главный авторитет")
values: string[];   // ['уважение к старшим', 'подавление эмоций', ...]
settingStyle: string; // визуально-эмоциональное описание окружения (тёплый, холодный, хаотичный)
}

export type LifeTone =
  | 'dramatic'
  | 'melancholic'
  | 'inspiring'
  | 'neutral'
  | 'chaotic'
  | 'tender'
  | string;
  