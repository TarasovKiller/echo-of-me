import React, { useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GamePhase } from '../constants/gamePhases';
import { Dilemma } from '../types/dilemma';

const generateDilemma = (): Dilemma => ({
  id: `dilemma-${Date.now()}`,
  text: 'Ты поймала подругу на лжи. Сказать ли ей об этом?',
  importance: 0.7,
  relatedTraits: ['trust', 'courage'],
});

const ScenePhase: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  useEffect(() => {
    if (!gameState.scenes[gameState.currentScene].dilemma) {
      const newDilemma = generateDilemma();
      const newScenes = gameState.scenes.map((scene, index) =>
        index === gameState.currentScene
          ? { ...scene, dilemma: newDilemma }
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
      <p>Текущая дилемма: {gameState.scenes[gameState.currentScene].dilemma?.text}</p>
    </div>
  );
};

export default ScenePhase;
