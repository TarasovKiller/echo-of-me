// src/constants/traitList.ts
import { TraitMeta, TraitCategory, TraitPolarity, TraitName } from '../types/trait';

export const TRAIT_LIST: TraitMeta[] = [
  {
    id: TraitName.Courage,
    label: 'Мужество',
    description: 'Способность действовать, несмотря на страх.',
    category: TraitCategory.Emotional,
    polarity: TraitPolarity.Positive,
  },
  {
    id: TraitName.Empathy,
    label: 'Эмпатия', 
    description: 'Способность чувствовать чужие эмоции.',
    category: TraitCategory.Social,
    polarity: TraitPolarity.Positive,
  },
  {
    id: TraitName.Independence,
    label: 'Независимость',
    description: 'Стремление полагаться на себя, а не на других.',
    category: TraitCategory.Motivational,
    polarity: TraitPolarity.Ambivalent,
  },
  {
    id: TraitName.Guilt,
    label: 'Вина',
    description: 'Склонность испытывать раскаяние за свои действия.',
    category: TraitCategory.Emotional,
    polarity: TraitPolarity.Ambivalent,
  },
  {
    id: TraitName.Trust,
    label: 'Доверие',
    description: 'Готовность полагаться на других.',
    category: TraitCategory.Social,
    polarity: TraitPolarity.Positive,
  },
  {
    id: TraitName.Impulsivity,
    label: 'Импульсивность',
    description: 'Трудности с контролем своих побуждений.',
    category: TraitCategory.Temperamental,
    polarity: TraitPolarity.Negative,
  },
  {
    id: TraitName.Manipulativeness,
    label: 'Манипулятивность',
    description: 'Склонность влиять на других ради своей выгоды.',
    category: TraitCategory.Social,
    polarity: TraitPolarity.Negative,
  },
  {
    id: TraitName.Shame,
    label: 'Стыд',
    description: 'Чувство, связанное с самоуничижением и страхом быть отвергнутым.',
    category: TraitCategory.Emotional,
    polarity: TraitPolarity.Negative,
  },
  {
    id: TraitName.Resilience,
    label: 'Психическая устойчивость',
    description: 'Способность восстанавливаться после трудностей.',
    category: TraitCategory.Temperamental,
    polarity: TraitPolarity.Positive,
  },
];
