// src/types/dilemma.ts

import { LifeTraits } from './life';

export type Dilemma = {
  id: string;
  situation: string;
  importance: number; // 0.0 – 1.0
  relatedTraits: (keyof LifeTraits)[];
};