export type Gender = 'male' | 'female';

export const MIN_LIFE_AGE = 8;
export const MAX_LIFE_AGE = 14;

export function generateAge(): number {
  return Math.floor(Math.random() * (MAX_LIFE_AGE - MIN_LIFE_AGE + 1)) + MIN_LIFE_AGE;
}

export function generateGender(): Gender {
  return Math.random() < 0.5 ? 'male' : 'female';
}

