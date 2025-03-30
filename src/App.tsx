import React, { useEffect, useState } from 'react';
import { insertCoin, onPlayerJoin, myPlayer, isHost } from 'playroomkit';
import { useOptimizedGameState } from './hooks/useOptimizedGameState'; // 💡 заменили
import SetupPhase from './components/SetupPhase';
import ScenePhase from './components/ScenePhase';
import AdvicePhase from './components/AdvicePhase';
import ChoicePhase from './components/ChoicePhase';
import EpiloguePhase from './components/EpiloguePhase';
import { PlayerRole } from './constants/roles';
import { GamePhase } from './constants/gamePhases';
import { defaultGameState } from './constants/defaultGameState';
import { GameState } from './types/gameState';

// 🔁 Функция обновления только players
function assignPlayerRole(players: GameState['players'], player: any): GameState['players'] {
  if (players[player.id]) {
    console.log(`Игрок ${player.id} уже имеет роль: ${players[player.id].role}`);
    return players; // Ничего не меняем
  }

  const hasLife = Object.values(players).some((p) => p.role === PlayerRole.Life);
  const assignedRole = hasLife
    ? Math.random() < 0.5
      ? PlayerRole.Angel
      : PlayerRole.Demon
    : PlayerRole.Life;

  console.log(`Игрок ${player.id} подключился. Назначена роль: ${assignedRole}`);
  return {
    ...players,
    [player.id]: { role: assignedRole },
  };
}

const App: React.FC = () => {
  const { gameState, updatePlayers } = useOptimizedGameState(); // 💡 используем
  const [readyToRender, setReadyToRender] = useState(false);
  useEffect(() => {
    insertCoin({
      gameId: 'echo-of-me',
      defaultStates: { game: defaultGameState },
      defaultPlayerStates: { role: null },
    }, () => {
      console.log('✅ insertCoin завершён, игра запущена');
      setReadyToRender(true);
    }).catch((err) => {
      console.error('Ошибка insertCoin:', err);
    });
    
  }, []);

  useEffect(() => {
    const unsubscribe = onPlayerJoin((player) => {
      if (!isHost()) return;

      updatePlayers((currentPlayers) => assignPlayerRole(currentPlayers, player));
    });

    return () => unsubscribe();
  }, [updatePlayers]);

  const player = myPlayer();
  const playerId = player?.id;
  const role = playerId ? gameState.players[playerId]?.role : null;

  if (!readyToRender || !player || !role) return <div>Загрузка...</div>;

  switch (gameState.phase) {
    case GamePhase.Setup:
      return <SetupPhase />;
    case GamePhase.Scene:
      return <ScenePhase />;
    case GamePhase.Advice:
      return <AdvicePhase role={role} />;
    case GamePhase.Choice:
      return <ChoicePhase role={role} />;
    case GamePhase.Epilogue:
      return <EpiloguePhase />;
    default:
      console.error('Неизвестная фаза:', gameState.phase);
      return <div>Неизвестная фаза: {gameState.phase}</div>;
  }
};

export default App;
