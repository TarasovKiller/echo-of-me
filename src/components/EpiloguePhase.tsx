import React from 'react';
import { useGameState } from '../hooks/useGameState';

const EpiloguePhase: React.FC = () => {
  const { gameState } = useGameState();

  const getEpilogue = (soulVector: number) => {
    if (soulVector > 3) return 'Вы прожили жизнь, полную добра.';
    if (soulVector < -3) return 'Ваша жизнь была омрачена темными решениями.';
    return 'Ваша жизнь была сбалансированной.';
  };

  return (
    <div>
      <p>Игра окончена!</p>
      {/* <p>{getEpilogue(gameState.lifeTraits)}</p> */}
      {/* <p>Вектор души: {gameState.soulVector}</p> */}
    </div>
  );
};

export default EpiloguePhase;