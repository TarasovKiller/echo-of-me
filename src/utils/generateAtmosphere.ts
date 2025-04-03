import { ATMOSPHERE_POOL, AtmosphereTone } from '../constants/atmospheres';

export function generateAtmosphere(): AtmosphereTone {
  const totalWeight = ATMOSPHERE_POOL.reduce((sum, item) => sum + item.weight, 0);
  const roll = Math.random() * totalWeight;

  let cumulative = 0;
  for (const item of ATMOSPHERE_POOL) {
    cumulative += item.weight;
    if (roll <= cumulative) {
      return item.value;
    }
  }

  // fallback
  return 'neutral';
}
