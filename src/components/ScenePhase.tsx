import React, { useEffect, useRef, useState } from 'react';
import { isHost } from 'playroomkit';
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
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      if (
        isHost() &&
        !fetchedRef.current &&
        !gameState.scenes[gameState.currentScene].dilemma
      ) {
        try {
          const newDilemma = await generateDilemma(gameState.lifeTraits);
          const newScenes = gameState.scenes.map((scene, index) =>
            index === gameState.currentScene
              ? { ...scene, dilemma: newDilemma }
              : scene
          );
          console.log(newDilemma);
          const newState = { ...gameState, scenes: newScenes };
          setGameState(newState);
          fetchedRef.current = true;

          setTimeout(() => {
            const nextState = { ...newState, phase: GamePhase.Advice };
            setGameState(nextState);
          }, 3000);
        }  catch (err) {
            console.error('Ошибка генерации дилеммы', err);
            setError('Не удалось загрузить дилемму');
        }
      }
    };
    load();
  }, [gameState.currentScene]);

  const currentDilemma = gameState.scenes[gameState.currentScene].dilemma
  
  return (
    <div>
      {error && <p>{error}</p>}
        {currentDilemma ? (
        <>
          <p>Текущаsя дилемма: {currentDilemma.situation}</p>
          <p>Важность: {currentDilemma.importance}</p>
          <p>
            Связанные черты: {currentDilemma.relatedTraits.join(', ')}
          </p>
        </>
      ) : (
        <p>Загрузка дилеммы...</p>
      )}
    </div>
  );
};

export default ScenePhase;
