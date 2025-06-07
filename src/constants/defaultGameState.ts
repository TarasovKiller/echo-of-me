import { GamePhase } from './gamePhases';
import { GameState } from '../types/gameState';

export const defaultGameState: GameState = {
  phase: GamePhase.Setup,
  players: {},
  currentScene: 0,
  scenes: [{
    dilemma: null,
    advices: {},
    chosenAdvice: null,
  }],
  lifeTraits: {
    courage: 50,
    empathy: 50,
    independence: 50,
    guilt: 50,
    trust: 50,
  },

};
