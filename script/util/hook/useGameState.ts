import { CountryStats, DEFAULT_INITIAL_STATE, GameState, StatType } from '@/dom/organ/stage/MainStage';
import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';



const useGameState = (initialState: GameState = DEFAULT_INITIAL_STATE): [GameState, Dispatch<SetStateAction<GameState>>, (countryId: string, field: keyof CountryStats[string], points: number) => void] => {
  const [state, setState] = useState<GameState>(initialState);

  const updateStats = useCallback((field: StatType, points: number) => {
    setState(prevState => {
      const updatedCountries = Object.keys(prevState.stats.country).reduce((acc:any, countryId) => {
        const currentStat = prevState.stats.country[countryId][field];
        acc[countryId] = {
          ...prevState.stats.country[countryId],
          [field]: currentStat + points >= 0 ? currentStat + points : 0
        };
        return acc;
      }, {});

      return {
        ...prevState,
        stats: {
          ...prevState.stats,
          country: updatedCountries
        }
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('money', -1)
    }, 5000);
    return () => clearInterval(interval);
  }, [updateStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('internet', -1)
    }, 10000);
    return () => clearInterval(interval);
  }, [updateStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('law', -1)
    }, 15000);
    return () => clearInterval(interval);
  }, [updateStats]);


  const increaseCountryFieldPoints = (countryId: string, field: StatType, points: number) => {
    // Build the updated state object
    const updatedCountryStats = {
      ...state.stats.country[countryId],
      [field]: (state.stats.country[countryId]?.[field] ?? 0) + points
    };

    const updatedState = {
      ...state,
      stats: {
        ...state.stats,
        country: {
          ...state.stats.country,
          [countryId]: updatedCountryStats
        }
      }
    };

    // Set the updated state
    setState(updatedState);
  };

  return [state, setState, increaseCountryFieldPoints];
};

export default useGameState;
