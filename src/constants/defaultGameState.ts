import { GamePhase } from './gamePhases';
import { GameState } from '../types/gameState';

export const defaultGameState: GameState = {
  phase: GamePhase.Setup,
  players: {},
  currentScene: 0,
  scenes: [],
  soulVector: 0,
};
