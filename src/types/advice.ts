// src/types/advice.ts
import { LifeTraits } from './life';

/**
 * Результат анализа одного совета от LLM
 */
export interface AdviceAnalysisResult {
  resonanceScore: number;
  matchedTraits: (keyof LifeTraits)[];
  importanceMultiplier: number;
  emotionalEffect: Partial<LifeTraits>;
  soulShift: number;
  internalReaction: {
    immediateThought: string;
    emotionalResponse: string;
    conflictWithValues: string;
  };
  memoryFormation: {
    memorability: number;
    emotionalCharge: number;
    integrationPotential: number;
  };
}

/**
 * Детали реакции на совет
 */
export interface AdviceReactionDetail {
  adviceIndex: number;
  emotionalImpact: string;
  alignmentWithValues: number;
  potentialGrowth: string;
  risks: string[];
}

/**
 * Финальное решение после анализа всех советов
 */
export interface FinalDecision {
  chosenAdviceIndex: number;
  confidence: number;
  reasoning: string;
  expectedOutcome: string;
  alternativeConsiderations: string[];
}

/**
 * Результат сравнения и выбора лучшего совета от LLM
 */
export interface AdviceComparisonResult {
  chosenAdviceIndex: number;
  reasoning: string;
  reactions: AdviceReactionDetail[];
  finalDecision: FinalDecision;
} 