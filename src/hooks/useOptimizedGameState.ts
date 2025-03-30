import { useMultiplayerState } from 'playroomkit';
import { useCallback, useRef, useEffect } from 'react';
import { GameState } from '../types/gameState';
import { defaultGameState } from '../constants/defaultGameState';

export const useOptimizedGameState = () => {
  const [gameState, setGameStateBase] = useMultiplayerState<GameState>(
    'game',
    defaultGameState
  );

  const stateRef = useRef(gameState);
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  // Локальный shallowEqual для players
  const shallowEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) return false;
    }

    return true;
  };

  // Обновление только если players действительно изменились
  const updatePlayers = useCallback(
    (modifier: (currentPlayers: GameState['players']) => GameState['players']) => {
      const current = stateRef.current;
      const newPlayers = modifier(current.players);

      const didChange = !shallowEqual(current.players, newPlayers);

      if (!didChange) return; // Ничего не меняем

      const newState: GameState = {
        ...current,
        players: newPlayers,
      };

      setGameStateBase(newState, true);
    },
    [setGameStateBase]
  );

  const setGameState = useCallback((
    value: GameState | ((prev: GameState) => GameState),
    reliable: boolean = true
  ) => {
    const nextState =
      typeof value === 'function'
        ? value(stateRef.current)
        : value;

    setGameStateBase(nextState, reliable);
  }, [setGameStateBase]);

  return { gameState, setGameState, updatePlayers };
};
