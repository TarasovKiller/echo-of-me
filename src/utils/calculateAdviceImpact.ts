// src/utils/calculateAdviceImpact.ts
import { LifeTraits, AdviceImpact } from '../types/life';

export function calculateAdviceImpact(advice: string, lifeTraits: LifeTraits, importance: number): AdviceImpact {
  // 🔬 Упрощённая проверка на совпадение слов с чертами
  const traitKeywords: Record<keyof LifeTraits, string[]> = {
    courage: ['смело', 'страх', 'рискуй', 'бойся'],
    empathy: ['почувствуй', 'сострадание', 'пойми', 'сожалею'],
    independence: ['сама', 'сам', 'один', 'реши', 'свобода'],
    guilt: ['вина', 'прости', 'искупление', 'наказание'],
    trust: ['доверие', 'верь', 'поддержи', 'откройся'],
  };

  const matchedTraits: (keyof LifeTraits)[] = [];

  for (const trait in traitKeywords) {
    if (traitKeywords[trait as keyof LifeTraits].some((word) => advice.toLowerCase().includes(word))) {
      matchedTraits.push(trait as keyof LifeTraits);
    }
  }

  const resonanceScore = Math.min(100, matchedTraits.length * 20); // 20 баллов за каждую совпавшую черту
  const importanceMultiplier = importance;

  // Эмоциональный эффект: +1 к каждой задетой черте
  const emotionalEffect: Partial<LifeTraits> = {};
  matchedTraits.forEach((trait) => {
    emotionalEffect[trait] = 1;
  });

  const soulShift = (resonanceScore / 100) * importanceMultiplier; // от 0 до 1

  return {
    resonanceScore,
    matchedTraits,
    importanceMultiplier,
    emotionalEffect,
    soulShift,
  };
}
