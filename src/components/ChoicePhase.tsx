// src/components/ChoicePhase.tsx

import React from 'react';
import { useOptimizedGameState } from '../hooks/useOptimizedGameState';
import { GamePhase } from '../constants/gamePhases';
import { PlayerRole } from '../constants/roles';
import { calculateAdviceImpact } from '../utils/calculateAdviceImpact';
import { LifeTraits } from '../types/life';

interface ChoicePhaseProps {
  role: PlayerRole;
}

const ChoicePhase: React.FC<ChoicePhaseProps> = ({ role }) => {
  const { gameState, setGameState } = useOptimizedGameState();
  const currentSceneData = gameState.scenes[gameState.currentScene];
  const advices = currentSceneData.advices;
  const dilemma = currentSceneData.dilemma;

  if (!dilemma) {
    return <div>Ошибка: дилемма не определена.</div>;
  }

  if (role !== PlayerRole.Life) {
    return <div>Жизнь выбирает совет...</div>;
  }

  const chooseAdvice = async (playerId: string) => {
    const state = { ...gameState };
    const chosenAdviceText = state.scenes[state.currentScene].advices[playerId];

    // Обновляем выбранный совет
    state.scenes[state.currentScene].chosenAdvice = playerId;

    // Анализируем влияние совета на Life
    if (state.life && dilemma) {
      try {
        const response = await fetch('http://localhost:4000/api/analyze-advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            advice: chosenAdviceText,
            lifeProfile: state.life,
            situation: dilemma.situation,
            question: dilemma.question,
            dilemmaContext: dilemma.context,
          }),
        });

        if (response.ok) {
          const analysis = await response.json();
          
          // Применяем эмоциональное влияние
          if (analysis.emotionalEffect && state.life) {
            for (const trait in analysis.emotionalEffect) {
              const key = trait as keyof LifeTraits;
              if (state.life.coreTraits[key] !== undefined) {
                state.life.coreTraits[key] += analysis.emotionalEffect[key]!;
              }
            }
          }
          
          // Обновляем вектор души
          if (analysis.soulShift) {
            state.soulVector += analysis.soulShift;
          }
        }
      } catch (error) {
        console.error('Ошибка анализа совета:', error);
      }
    }

    // Следующая сцена или эпилог
    if (state.currentScene < 2) {
      state.currentScene += 1;
      state.phase = GamePhase.Scene;

      // Добавим новую пустую сцену
      state.scenes.push({
        dilemma: null,
        advices: {},
        chosenAdvice: null,
      });
    } else {
      state.phase = GamePhase.Epilogue;
    }

    setGameState(state);
  };

  return (
    <div>
      <p>Выберите совет для дилеммы:</p>
      <p><strong>{dilemma.situation}</strong></p>
      {Object.entries(advices).map(([playerId, advice]) => (
        <button key={playerId} onClick={() => chooseAdvice(playerId)}>
          {advice}
        </button>
      ))}
    </div>
  );
};

export default ChoicePhase;
