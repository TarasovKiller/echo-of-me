// src/constants/atmosphereTraitMap.ts
import { TraitName } from '../types/trait';
import { LifeTone } from '../types/life';

type TraitShiftMap = Partial<Record<TraitName, number>>;

export const ATMOSPHERE_TRAIT_SHIFT_MAP: Record<LifeTone, TraitShiftMap> = {
  tender: {
    [TraitName.Empathy]: 10,
    [TraitName.Trust]: 8,
    [TraitName.Shame]: -5,
    [TraitName.Manipulativeness]: -7,
    [TraitName.Resilience]: 5,
  },
  chaotic: {
    [TraitName.Impulsivity]: 12,
    [TraitName.Trust]: -10,
    [TraitName.Resilience]: -5,
    [TraitName.Manipulativeness]: 7,
    [TraitName.Guilt]: 5,
  },
  cold: {
    [TraitName.Empathy]: -10,
    [TraitName.Trust]: -10,
    [TraitName.Shame]: 8,
    [TraitName.Manipulativeness]: 5,
  },
  neutral: {},
  melancholic: {
    [TraitName.Guilt]: 10,
    [TraitName.Shame]: 10,
    [TraitName.Resilience]: -5,
    [TraitName.Empathy]: 5,
  },
  oppressive: {
    [TraitName.Shame]: 15,
    [TraitName.Guilt]: 10,
    [TraitName.Independence]: -10,
    [TraitName.Trust]: -5,
    [TraitName.Resilience]: -5,
  },
  inspiring: {
    [TraitName.Courage]: 15,
    [TraitName.Resilience]: 10,
    [TraitName.Independence]: 5,
  },
  eerie: {
    [TraitName.Impulsivity]: 5,
    [TraitName.Guilt]: 5,
    [TraitName.Trust]: -10,
    [TraitName.Courage]: -5,
  },
  vibrant: {
    [TraitName.Courage]: 10,
    [TraitName.Impulsivity]: 8,
    [TraitName.Empathy]: 5,
    [TraitName.Independence]: 5,
  },
  dramatic: {
    [TraitName.Courage]: 10,
    [TraitName.Impulsivity]: 5,
    [TraitName.Guilt]: 5,
    [TraitName.Resilience]: -5,
  },
};
