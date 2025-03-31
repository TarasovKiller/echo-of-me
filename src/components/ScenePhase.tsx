import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../constants/gamePhases';
import { dilemmas } from '../constants/dilemmas'; // 👈 Добавь это


const ScenePhase: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  useEffect(() => {
    // Если в текущей сцене ещё нет дилеммы, устанавливаем её
    if (!gameState.scenes[gameState.currentScene].dilemma) {
      const randomDilemma =
        dilemmas[gameState.currentScene % dilemmas.length]; // 👈 Простой способ
  
      const newScenes = gameState.scenes.map((scene, index) =>
        index === gameState.currentScene
          ? { ...scene, dilemma: randomDilemma }
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
