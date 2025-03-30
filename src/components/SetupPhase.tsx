import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../constants/gamePhases';

const SetupPhase: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  const startGame = () => {
    const newState = {
        ...gameState,
        phase: GamePhase.Scene as GamePhase.Scene,
        scenes: [{ dilemma: "", advices: {}, chosenAdvice: null }],
      };
      setGameState(newState);
  };

  return (
    <div>
      <p>Ожидание подключения игроков...</p>
      <p>Подключено игроков: {Object.keys(gameState.players).length}</p>
      {Object.keys(gameState.players).length >= 2 && (
        <button onClick={startGame}>Начать игру</button>
      )}
    </div>
  );
};

export default SetupPhase;