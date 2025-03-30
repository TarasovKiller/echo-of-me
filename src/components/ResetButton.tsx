import { setState } from 'playroomkit';
import { useGameState } from '../hooks/useGameState';

function ResetButton() {
  const { gameState } = useGameState();

  const resetGameState = () => {
    const newState = {
      ...gameState,
      players: {}, // сбрасываем всех игроков
      phase: 'setup',
      currentScene: 0,
      scenes: [],
      soulVector: 0,
    };
    setState('game', newState);
  };

  return (
    <button onClick={resetGameState}>
      Сбросить игру и очистить игроков
    </button>
  );
}

export default ResetButton;
