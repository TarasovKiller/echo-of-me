import { useMultiplayerState } from 'playroomkit';
import { useCallback, useRef, useEffect } from 'react';
import { GameState } from '../types/gameState';
import { defaultGameState } from '../constants/defaultGameState';

export const useGameState = () => {
  const [gameState, setGameStateBase] = useMultiplayerState<GameState>(
    'game',
    defaultGameState
  );

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const setGameState = useCallback((
    value: GameState | ((prev: GameState) => GameState),
    reliable: boolean = true
  ) => {
    const nextState = typeof value === 'function'
      ? value(gameStateRef.current)
      : value;

    setGameStateBase(nextState, reliable);
  }, [setGameStateBase]);

  return { gameState, setGameState };
};
