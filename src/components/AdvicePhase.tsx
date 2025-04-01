import React, { useState } from 'react';
import { myPlayer } from 'playroomkit';
import { useGameState } from '../hooks/useGameState';
import { PlayerRole } from '../constants/roles';
import { GamePhase } from '../constants/gamePhases';

const AdvicePhase: React.FC = () => {
  const { gameState, setGameState } = useGameState();
  const [advice, setAdvice] = useState('');
  const playerId = myPlayer().id;
  const role = gameState.players[playerId]?.role;
  const dilemma = gameState.scenes[gameState.currentScene].dilemma;

  const submitAdvice = () => {
    const state = { ...gameState };
    state.scenes[state.currentScene].advices[playerId] = advice;

    const nonLifePlayers = Object.keys(state.players).filter(
      (id) => state.players[id].role !== PlayerRole.Life
    );

    if (
      Object.keys(state.scenes[state.currentScene].advices).length ===
      nonLifePlayers.length
    ) {
      state.phase = GamePhase.Choice;
    }

    setGameState(state);
    setAdvice('');
  };

  return (
    <div>
      <p><strong>Дилемма:</strong> {dilemma}</p>
      {role === PlayerRole.Life ? (
        <p>Ожидание советов...</p>
      ) : (
        <div>
          <p>Введите ваш совет:</p>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
          />
          <button onClick={submitAdvice} disabled={!advice.trim()}>
            Отправить
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvicePhase;
