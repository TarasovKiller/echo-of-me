import React from 'react';
import { isHost } from 'playroomkit'; // 👈 импортируем isHost
import { useOptimizedGameState } from '../hooks/useOptimizedGameState';
import { GamePhase } from '../constants/gamePhases';

const SetupPhase: React.FC = () => {
  const { gameState, setGameState } = useOptimizedGameState();

  const startGame = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/life');
      const life = await res.json();
      const newState = {
        ...gameState,
        phase: GamePhase.Scene,
        life,
        soulVector: 0,
        scenes: [{ dilemma: null, advices: {}, chosenAdvice: null }],
      };
      setGameState(newState);
    } catch (err) {
      console.error('Ошибка генерации жизни', err);
    }
  };

  const enoughPlayers = Object.keys(gameState.players).length >= 2;

  return (
    <div>
      <p>Ожидание подключения игроков...</p>
      <p>Подключено игроков: {Object.keys(gameState.players).length}</p>
      {enoughPlayers && isHost() && ( // 👈 проверяем, что это хост
        <button onClick={startGame}>Начать игру</button>
      )}
    </div>
  );
};

export default SetupPhase;
