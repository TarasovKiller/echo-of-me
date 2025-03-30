import { PlayerRole } from '../constants/roles';
import { GamePhase } from '../constants/gamePhases';

export interface GameState {
    phase: GamePhase; // Текущая фаза игры
    players: {
      [playerId: string]: {
        role: PlayerRole // Роль игрока
      };
    };
    currentScene: number; // Номер текущей сцены
    scenes: Array<{
      dilemma: string; // Текст дилеммы
      advices: {
        [playerId: string]: string; // Советы от ангелов и демонов
      };
      chosenAdvice: string | null; // Выбранный совет (ID игрока)
    }>;
    soulVector: number; // Вектор души (от -5 до +5)
  }