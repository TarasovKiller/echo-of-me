import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../constants/gamePhases';

const ScenePhase: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  useEffect(() => {
    // Если в текущей сцене ещё нет дилеммы, устанавливаем её
    if (!gameState.scenes[gameState.currentScene].dilemma) {
      // Создаём новую копию массива сцен, изменяя только текущую сцену
      const newScenes = gameState.scenes.map((scene, index) =>
        index === gameState.currentScene
          ? { ...scene, dilemma: 'Пример дилеммы: Вы нашли кошелек с деньгами. Что делать?' }
          : scene
      );

      // Создаём новое состояние, обновляя scenes
      const newState = { ...gameState, scenes: newScenes };

      // Обновляем состояние сразу, чтобы дилемма отобразилась
      setGameState(newState);

      // Через 3 секунды переключаем фазу на Advice
      setTimeout(() => {
        const nextState = { ...newState, phase: GamePhase.Advice };
        setGameState(nextState);
      }, 3000);
    }
  }, [gameState, setGameState]);

  return (
    <div>
      <p>Текущая дилемма: {gameState.scenes[gameState.currentScene].dilemma}</p>
    </div>
  );
};

export default ScenePhase;
