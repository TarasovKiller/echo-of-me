// src/types/dilemma.ts

import { LifeTraits } from './life';

export interface DilemmaChoice {
  description: string;
  pros: string[];
  cons: string[];
  alignedTraits: (keyof LifeTraits)[];
  conflictingTraits: (keyof LifeTraits)[];
}

export interface DilemmaStakes {
  immediate: string;
  longTerm: string;
  emotional: string;
}

export interface DilemmaParticipant {
  name: string;
  role: string;
  influence: string;
  expectations: string;
}

export interface DilemmaConsequences {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface Dilemma {
  id?: string;
  situation: string;
  question: string;
  importance: number; // 1-10
  relatedTraits: (keyof LifeTraits)[];
  context: string;
  stakes: DilemmaStakes;
  choices: DilemmaChoice[];
  participants: DilemmaParticipant[];
  externalPressure: string[];
  timeline: string;
  consequences: DilemmaConsequences;
}