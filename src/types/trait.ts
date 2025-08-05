import { LifeTraits } from "./life";

// src/types/traitModel.ts
export enum TraitCategory {
    Emotional = 'emotional',
    Cognitive = 'cognitive',
    Social = 'social',
    Temperamental = 'temperamental',
    Motivational = 'motivational',
  }
  
export enum TraitPolarity {
  Positive = 'positive',
  Negative = 'negative',
  Ambivalent = 'ambivalent',
}

export interface TraitMeta {
  id: keyof LifeTraits;
  label: string;
  description: string;
  category: TraitCategory;
  polarity: TraitPolarity;
  min?: number;
  max?: number;
}
  
export enum TraitName {
  Courage = 'courage',
  Empathy = 'empathy',
  Independence = 'independence',
  Guilt = 'guilt',
  Trust = 'trust',
  Impulsivity = 'impulsivity',
  Manipulativeness = 'manipulativeness',
  Shame = 'shame',
  Resilience = 'resilience',
}








