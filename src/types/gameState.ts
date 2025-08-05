import { PlayerRole } from '../constants/roles';
import { GamePhase } from '../constants/gamePhases';
import { LifeProfile } from './life';
import { Dilemma } from './dilemma'; // создадим тип отдельно

export interface GameState {
    phase: GamePhase; // Текущая фаза игры
    players: {
      [playerId: string]: {
        role: PlayerRole // Роль игрока
      };
    };
    currentScene: number; // Номер текущей сцены
    scenes: Array<{
      dilemma: Dilemma | null; // Текст дилеммы
      advices: {
        [playerId: string]: string; // Советы от ангелов и демонов
      };
      chosenAdvice: string | null; // Выбранный совет (ID игрока)
    }>;
    life: LifeProfile | null; // Профиль Жизни
    soulVector: number; // Вектор души

  }