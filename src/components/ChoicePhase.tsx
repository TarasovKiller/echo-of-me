import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../constants/gamePhases';
import { PlayerRole } from '../constants/roles';

interface ChoicePhaseProps {
  role: PlayerRole;
}

const ChoicePhase: React.FC<ChoicePhaseProps> = ({ role }) => {
  const { gameState, setGameState } = useGameState();
  const advices = gameState.scenes[gameState.currentScene].advices;

  if (role !== PlayerRole.Life) {
    return <div>Жизнь выбирает совет...</div>;
  }

  const chooseAdvice = (playerId: string) => {
    const state = { ...gameState };
    state.scenes[state.currentScene].chosenAdvice = playerId;

    // Обновляем soulVector
    const adviceAuthor = state.players[playerId];
    if (adviceAuthor.role === PlayerRole.Angel) {
      state.soulVector += 1;
    } else if (adviceAuthor.role === PlayerRole.Demon) {
      state.soulVector -= 1;
    }

    // Переход к следующей сцене или эпилогу
    if (state.currentScene < 4) {
      state.currentScene += 1;
      state.phase = GamePhase.Scene;
      state.scenes.push({ dilemma: '', advices: {}, chosenAdvice: null });
    } else {
      state.phase = GamePhase.Epilogue;
    }
    setGameState(state); // Передаем полное состояние
  };

  return (
    <div>
      <p>Выберите совет:</p>
      {Object.entries(advices).map(([playerId, advice]) => (
        <button key={playerId} onClick={() => chooseAdvice(playerId)}>
          {advice}
        </button>
      ))}
    </div>
  );
};

export default ChoicePhase;
