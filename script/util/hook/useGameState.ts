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



const useGameState = (
  initialState: GameState = DEFAULT_INITIAL_STATE, thresHold = 24, reloadGame:VoidFunction):
  [GameState, Dispatch<SetStateAction<GameState>>, (zoneId: string, field: keyof ZoneSats[string], points: number) => void, s__isStarted:any] => {
  const [state, s__State] = useState<GameState>(initialState);
  const [liveThresHold, s__liveThresHold] = useState<any>(0);
  const [maxScore, s__maxScore] = useState<any>(0);
  const [isStarted, s__isStarted] = useState<number>(0);
  const [isFinished, s__isFinished] = useState<number>(0);
  const triggerFinish = (zoneId:any, field:any) => {
    if (isFinished) { return } 
    s__isFinished((prev:number)=>prev+1)
    s__isStarted(0)
    const zones:any = state.stats.zone
    const currentStat = zones[zoneId][field]
    alert(`You lost!\n\n ${zoneId.toUpperCase()} failed, ${field} was not found!`)
    if (!!reloadGame) { reloadGame() }
    else { return window?.location.reload() }
  }
  function updateStats(zoneIds: string[], field: StatType, points: number): void {
    if (isFinished) { return; }
    if (!isStarted) { return; }
    const prevState = { ...state };
    let finishTriggered = false; // Flag to ensure triggerFinish is called only once
  
    zoneIds.forEach(zoneId => {
      if (!prevState.stats.zone.hasOwnProperty(zoneId)) { return; }
      console.log("updateStats", zoneId, field, points);
      const currentStat = prevState.stats.zone[zoneId][field];
  
      if (currentStat + points <= 0 && !finishTriggered) {
        triggerFinish(zoneId, field);
        finishTriggered = true; // Set the flag after the first call
      }
      const updatedStat = currentStat + points >= 0 ? currentStat + points : 0;
  
      prevState.stats.zone[zoneId] = {
        ...prevState.stats.zone[zoneId],
        [field]: updatedStat
      };
    });
  
    s__State({
      ...prevState,
      stats: {
        ...prevState.stats
      }
    });
  }
  
  
  const [counter, setCounter] = useState(0); // Initialize the counter state

useEffect(() => {
  if (!isStarted) return;
  if (!!isFinished) return;

  const interval = setInterval(() => {
    // console.log("interval spin")
    const prevCounter = counter
      const newCounter = prevCounter + 1;
      console.log("*************prevCounter", prevCounter)

    const prevState = {...state}
        // Object.keys(prevState.stats.zone).forEach(zoneId => {
          // // Update money every 10 seconds
          if (newCounter % 1 === 0) {
            // console.log("zoneId", zoneId , "10s")
            const toChange = Object.keys(prevState.stats.zone).filter(zoneId => {
              return prevState.stats.zone[zoneId]['money'] > 0 && Math.random() > 0.5
            })
            if (toChange.length) {
              updateStats(toChange, 'money', -1)
            }
          }
          // if (newCounter % 1 === 0 && Math.random() > 0.5) {
          //   updateStats(zoneId, 'money', -1);
          // }
          // // Update internet every 20 seconds (every 2 ticks of the 10-second interval)
          // if (newCounter % 2 === 0 && Math.random() > 0.5) {
          //   updateStats(zoneId, 'internet', -1);
          // }
          // // Update law every 30 seconds (every 3 ticks of the 10-second interval)
          // if (newCounter % 3 === 0 && Math.random() > 0.5) {
          //   updateStats(zoneId, 'law', -1);
          // }
        // })
        // s__State( { ...prevState })

      setCounter(newCounter)
  }, 10000); // Set the interval to 10 seconds, the base unit

  return () => clearInterval(interval);
}, [updateStats, isStarted, isFinished, counter]); // Include counter in the dependency array



  const increaseZoneFieldPoints = (zoneId: string, field: StatType, points: number) => {
    
  if (!isStarted) return;
  if (!!isFinished) return;
    // Build the updated state object
    const updatedZoneSats = {
      ...state.stats.zone[zoneId],
      [field]: (state.stats.zone[zoneId]?.[field] ?? 0) + points
    };
    s__liveThresHold((state.stats.zone[zoneId]?.[field] ?? 0) + points);
    console.log("liveThresHold"), liveThresHold
    if (liveThresHold >= thresHold) { 
      alert(`You've won!\n\n ${zoneId.toUpperCase()} overdelivered, ${field} was very productive!`)
      const lvlBaseURL = process.env.NODE_ENV == "production" ? "https://mileidi.vercel.app" : "http://localhost:1234"
      let nextLevel = 0
      if (thresHold < 25 && !!window?.location) {
        // do window open
        return window.location.href = `${lvlBaseURL}/lvl/1`
      }
      if (thresHold < 50 && !!window?.location) {
        // do window open
        return window.location.href = `${lvlBaseURL}/lvl/2`
      }
      if (thresHold < 75 && !!window?.location) {
        // do window open
        return window.location.href = `${lvlBaseURL}/lvl/3`
      }
      if (!nextLevel) {
        if (!!reloadGame) { reloadGame() }
        else { return window?.location.reload() }
      }
      
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

  return [state, s__State, increaseZoneFieldPoints, s__isStarted];
};

export default useGameState;
