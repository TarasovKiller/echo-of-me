import React, { useEffect } from 'react';
import { useOptimizedGameState } from '../hooks/useOptimizedGameState';
import { GamePhase } from '../constants/gamePhases';
import { Dilemma } from '../types/dilemma';
import { LifeTraits } from '../types/life';
import { OpenAIClient } from '../../server/OpenAIClient';
import { DilemmaBuilder } from '../../server/DilemmaBuilder';

const generateDilemma = async (traits: LifeTraits): Promise<Dilemma> => {
  const llm = new OpenAIClient(process.env.REACT_APP_OPENAI_API_KEY || '');
  const builder = new DilemmaBuilder(llm);
  return builder.createDilemma({
    name: 'Аня',
    age: 15,
    lifeContext: JSON.stringify(traits),
    countryContext: '',
    settlementContext: '',
    familyContext: '',
    socialContext: '',
  });
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
