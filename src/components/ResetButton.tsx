import { setState } from 'playroomkit';
import { useOptimizedGameState } from '../hooks/useOptimizedGameState';

function ResetButton() {
  const { gameState } = useOptimizedGameState();

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
