import { ZoneSats, DEFAULT_INITIAL_STATE, GameState, StatType } from '@/dom/organ/stage/MainStage';
import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

const DEFAULT_ACTION_LIST = [
  {"increment": "money", "decrement": null, "action_name": "Financial Growth Initiative"},
  {"increment": "internet", "decrement": null, "action_name": "Digital Revolution Drive"},
  {"increment": "law", "decrement": null, "action_name": "Judicial Enhancement Program"},
  {"increment": "money, internet", "decrement": null, "action_name": "Economic-Tech Synergy Project"},
  {"increment": "money, law", "decrement": null, "action_name": "Fiscal-Legal Reform Strategy"},
  {"increment": "internet, law", "decrement": null, "action_name": "Cyber-Governance Alliance"},
  {"increment": "money, internet, law", "decrement": null, "action_name": "Comprehensive Development Plan"},
  {"increment": null, "decrement": "money", "action_name": "Economic Contraction Measure"},
  {"increment": null, "decrement": "internet", "action_name": "Digital Infrastructure Setback"},
  {"increment": null, "decrement": "law", "action_name": "Legal System Deterioration"},
  {"increment": null, "decrement": "money, internet", "action_name": "Financial-Digital Decline"},
  {"increment": null, "decrement": "money, law", "action_name": "Economic-Judicial Recession"},
  {"increment": null, "decrement": "internet, law", "action_name": "Tech-Legal Setback"},
  {"increment": null, "decrement": "money, internet, law", "action_name": "Nationwide Regression"},
  {"increment": "money", "decrement": "internet", "action_name": "Asset Liquidation Focus"},
  {"increment": "money", "decrement": "internet, law", "action_name": "Fiscal Focus over Digital-Legal"},
  {"increment": "internet", "decrement": "money", "action_name": "Tech Over Economy Shift"},
  {"increment": "internet", "decrement": "money, law", "action_name": "Digital Dominance Strategy"},
  {"increment": "law", "decrement": "money", "action_name": "Regulatory Emphasis over Economy"},
  {"increment": "law", "decrement": "money, internet", "action_name": "Governance over Growth"},
  {"increment": "money, internet", "decrement": "law", "action_name": "Market-Tech Expansion at Legal Cost"},
  {"increment": "money, law", "decrement": "internet", "action_name": "Fiscal-Legal Priority over Tech"},
  {"increment": "internet, law", "decrement": "money", "action_name": "Cyber-Legal Advancement with Economic Sacrifice"},
  {"increment": "money, internet, law", "decrement": null, "action_name": "All-Inclusive Progression"}
]



const useGameState = (initialState: GameState = DEFAULT_INITIAL_STATE, thresHold = 24): [GameState, Dispatch<SetStateAction<GameState>>, (zoneId: string, field: keyof ZoneSats[string], points: number) => void] => {
  const [state, s__State] = useState<GameState>(initialState);
  const [liveThresHold, s__liveThresHold] = useState<any>(0);
  const [maxScore, s__maxScore] = useState<any>(0);

  const updateStats = useCallback((field: StatType, points: number) => {
    
    s__State(prevState => {
      const updatedZones = Object.keys(prevState.stats.zone).reduce((acc:any, zoneId) => {
        const currentStat = prevState.stats.zone[zoneId][field];
        s__maxScore(maxScore + points)
        if (currentStat + points <= 0 ) {
          alert(`You lost\n\nMax sore: ${maxScore}`)
          window.location.reload()
        }
        acc[zoneId] = {
          ...prevState.stats.zone[zoneId],
          [field]: currentStat + points >= 0 ? currentStat + points : 0
        };
        return acc;
      }, {});

      return {
        ...prevState,
        stats: {
          ...prevState.stats,
          zone: updatedZones
        }
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('money', -1)
    }, 10000);
    return () => clearInterval(interval);
  }, [updateStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('internet', -1)
    }, 20000);
    return () => clearInterval(interval);
  }, [updateStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) { return }
      updateStats('law', -1)
    }, 30000);
    return () => clearInterval(interval);
  }, [updateStats]);


  const increaseZoneFieldPoints = (zoneId: string, field: StatType, points: number) => {
    // Build the updated state object
    const updatedZoneSats = {
      ...state.stats.zone[zoneId],
      [field]: (state.stats.zone[zoneId]?.[field] ?? 0) + points
    };
    s__liveThresHold((state.stats.zone[zoneId]?.[field] ?? 0) + points);
    console.log("liveThresHold"), liveThresHold
    if (liveThresHold >= thresHold) { 
      
      window.location.reload()
    }
    const updatedState = {
      ...state,
      stats: {
        ...state.stats,
        zone: {
          ...state.stats.zone,
          [zoneId]: updatedZoneSats
        }
      }
    };

    // Set the updated state
    s__State(updatedState);
  };

  return [state, s__State, increaseZoneFieldPoints];
};

export default useGameState;
