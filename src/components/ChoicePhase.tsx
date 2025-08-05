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

  const chooseAdvice = (playerId: string) => {
    const state = { ...gameState };
    const chosenAdviceText = state.scenes[state.currentScene].advices[playerId];

    // const impact = calculateAdviceImpact(chosenAdviceText, state.lifeTraits, dilemma.importance);

    // Обновляем выбранный совет
    state.scenes[state.currentScene].chosenAdvice = playerId;

    // Обновим черты Жизни
    if (state.life) {
      // TODO: Разкоментить если актуально
      // for (const trait in reaction.emotionalEffect) {
      //   const key = trait as keyof LifeTraits;
      //   state.life.coreTraits[key] += reaction.emotionalEffect[key]!;
      // }
      // state.soulVector += reaction.soulVectorChange;
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
