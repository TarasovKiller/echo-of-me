import React, { useEffect } from 'react';
import { useOptimizedGameState } from '../hooks/useOptimizedGameState';
import { GamePhase } from '../constants/gamePhases';
import { Dilemma } from '../types/dilemma';
import { LifeTraits } from '../types/life';

const generateDilemma = async (traits: LifeTraits): Promise<Dilemma> => {
  const response = await fetch('http://localhost:4000/api/dilemma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Аня',
      age: 15,
      traits,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate dilemma');
  }

  return response.json();
};

const ScenePhase: React.FC = () => {
  const { gameState, setGameState } = useOptimizedGameState();

  useEffect(() => {
    const load = async () => {
      if (!gameState.scenes[gameState.currentScene].dilemma) {
        const newDilemma = await generateDilemma(gameState.lifeTraits);
        const newScenes = gameState.scenes.map((scene, index) =>
          index === gameState.currentScene
            ? { ...scene, dilemma: newDilemma }
            : scene
        );

        const newState = { ...gameState, scenes: newScenes };
        setGameState(newState);

        setTimeout(() => {
          const nextState = { ...newState, phase: GamePhase.Advice };
          setGameState(nextState);
        }, 3000);
      }
    };
    load();
  }, [gameState, setGameState]);

  return (
    <div>
      <p>Текущая дилемма: {gameState.scenes[gameState.currentScene].dilemma?.text}</p>
    </div>
  );
};

export default ScenePhase;
