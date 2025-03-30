import React, { useState } from 'react';
import { myPlayer } from 'playroomkit';
import { useGameState } from '../hooks/useGameState';
import { PlayerRole } from '../constants/roles';
import { GamePhase } from '../constants/gamePhases';

interface AdvicePhaseProps {
  role: PlayerRole;
}

const AdvicePhase: React.FC<AdvicePhaseProps> = ({ role }) => {
  console.log(`Hello ${myPlayer().getProfile().name}!`);
  console.log(`Your role is ${role}`);
  const { gameState, setGameState } = useGameState();
  const [advice, setAdvice] = useState('');

  // Если роль "life", игрок только ждет советов от остальных
  if (role === PlayerRole.Life) {
    return <div>Ожидайте советы от ангелов и демонов...</div>;
  }

  const submitAdvice = () => {
    const state = { ...gameState };
    const playerId = myPlayer().id;
    state.scenes[state.currentScene].advices[playerId] = advice;

    // Проверяем, все ли игроки с ролями, отличными от Life, отправили советы
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
      <p>Напишите свой совет:</p>
      <textarea value={advice} onChange={(e) => setAdvice(e.target.value)} />
      <button onClick={submitAdvice}>Отправить</button>
    </div>
  );
};

export default AdvicePhase;
