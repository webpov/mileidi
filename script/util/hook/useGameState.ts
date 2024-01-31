import { AudioContext } from "@/../script/state/context/AudioContext";
import { ZoneSats, DEFAULT_INITIAL_STATE, GameState, StatType, STATS_SFX_MAIN } from '@/dom/organ/stage/MainStage';
import { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';


const useGameState = (
  initialState: GameState = DEFAULT_INITIAL_STATE, thresHold = 12, addFinalObj: any,):
  [GameState, Dispatch<SetStateAction<GameState>>, (zoneId: string, field: keyof ZoneSats[string], points: number) => void, s__isStarted: any, maxScores: any, avail: any, isFinished: any] => {
  const [avail, s__avail] = useState<any>(initialState.stats.available);
  const [state, s__State] = useState<GameState>(initialState);
  const [liveThresHold, s__liveThresHold] = useState<any>(0);
  const [maxScore1, s__maxScore1] = useState<any>(0);
  const [maxScore2, s__maxScore2] = useState<any>(0);
  const [maxScore3, s__maxScore3] = useState<any>(0);
  const [isStarted, s__isStarted] = useState<number>(0);
  const [isFinished, s__isFinished] = useState<number>(0);
  const audioCtx = useContext(AudioContext)
  const triggerFinish = (zoneId: any, field: any) => {
    if (isFinished) { return }
    s__isFinished((prev: number) => prev + 1)
    s__isStarted(0)
    let alertmsg: any = `You lost!\n\n ${zoneId.toUpperCase()} failed, ${field} was not found!`
    if (!!addFinalObj) {
      addFinalObj({
        win: false,
        alertmsg
      })
    }
  }
  function updateStats(zoneIds: string[], field: StatType, points: number): void {
    if (isFinished) { return; }
    if (!isStarted) { return; }
    const prevState = { ...state };
    let finishTriggered = false

    zoneIds.forEach(zoneId => {
      if (!prevState.stats.zone.hasOwnProperty(zoneId)) { return; }
      const currentStat = prevState.stats.zone[zoneId][field];

      if (currentStat + points <= 0 && !finishTriggered) {
        triggerFinish(zoneId, field);
        finishTriggered = true
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


  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isStarted) return;
    if (!!isFinished) return;

    const interval = setInterval(() => {
      const prevCounter = counter
      const newCounter = prevCounter + 1;
      let oldAvail = { ...avail }

      const prevState = { ...state }
      if (newCounter % 1 === 0) {
        if (!oldAvail["money"]) {
          oldAvail["money"] = oldAvail["money"] + 1
          s__avail(oldAvail)
        }

        const toChange = Object.keys(prevState.stats.zone).filter(zoneId => {
          return prevState.stats.zone[zoneId]['money'] > 0 && Math.random() > 0.5
        })
        if (toChange.length) {
          audioCtx.play("../sound/bridge.wav")
          updateStats(toChange, 'money', -1)
        }
      }
      if (newCounter % 2 === 0) {

        if (!oldAvail["internet"] && Math.random() > 0.75) {
          oldAvail["internet"] += 1
          s__avail(oldAvail)
        }
        const toChange = Object.keys(prevState.stats.zone).filter(zoneId => {
          return prevState.stats.zone[zoneId]['internet'] > 0 && Math.random() > 0.5
        })
        if (toChange.length) {
          audioCtx.play("../sound/bridge.wav")
          updateStats(toChange, 'internet', -1)
        }
      }
      if (newCounter % 3 === 0) {

        if (!oldAvail["law"] && Math.random() > 0.9) {
          oldAvail["law"] += 1
          s__avail(oldAvail)
        }
        const toChange = Object.keys(prevState.stats.zone).filter(zoneId => {
          return prevState.stats.zone[zoneId]['law'] > 0 && Math.random() > 0.5
        })
        if (toChange.length) {
          audioCtx.play("../sound/bridge.wav")
          updateStats(toChange, 'law', -1)
        }
      }

      setCounter(newCounter)
    }, 10000);

    return () => clearInterval(interval);
  }, [updateStats, isStarted, isFinished, counter]);



  const increaseZoneFieldPoints = (zoneId: string, field: StatType, points: number) => {

    if (!isStarted) return;
    if (!!isFinished) return;
    const oldAvail = { ...avail }
    if (!oldAvail[field]) {
      audioCtx.play("../sound/404.wav")

      return
    }
    let maxOfMax = 0
    switch (field) {
      case ("money"):
        s__maxScore1(maxScore1 + 1);
        maxOfMax = maxScore1 + 1
        break;
      case ("internet"):
        s__maxScore2(maxScore2 + 1);
        maxOfMax = maxScore2 + 1
        break;
      case ("law"):
        s__maxScore3(maxScore3 + 1);
        maxOfMax = maxScore3 + 1
        break;
    }
    audioCtx.play(STATS_SFX_MAIN[field])

    oldAvail[field] -= 1
    s__avail(oldAvail)
    const updatedZoneSats = {
      ...state.stats.zone[zoneId],
      [field]: (state.stats.zone[zoneId]?.[field] ?? 0) + points
    };
    s__liveThresHold((state.stats.zone[zoneId]?.[field] ?? 0) + points);
    
    if (maxOfMax >= thresHold) {
      let msg = (`You've won!\n\n ${zoneId.toUpperCase()} overdelivered, ${field} was very productive!`)
      const lvlBaseURL = process.env.NODE_ENV == "production" ? "https://mileidi.vercel.app" : "http://localhost:1234"
      let nextLevel = 0
      let window_location_href = ""
      triggerFinish(zoneId, field);
      if (thresHold < 25 && !!window?.location) {
        window_location_href = `${lvlBaseURL}/lvl/1`
      }
      if (thresHold < 50 && !!window?.location) {
        window_location_href = `${lvlBaseURL}/lvl/2`
      }
      if (thresHold < 75 && !!window?.location) {
        window_location_href = `${lvlBaseURL}/lvl/3`
      }
      if (!nextLevel) {
        if (!!addFinalObj) {
          addFinalObj({
            win: true,
            points: 1,
            msg,
            window_location_href
          })
        }
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

    s__State(updatedState);
  };

  return [state, s__State, increaseZoneFieldPoints, s__isStarted, {
    maxScore1,
    maxScore2,
    maxScore3
  }, avail, isFinished];
};

export default useGameState;

export const DEFAULT_ACTION_LIST = [
  { "increment": "money", "decrement": null, "action_name": "Financial Growth Initiative" },
  { "increment": "internet", "decrement": null, "action_name": "Digital Revolution Drive" },
  { "increment": "law", "decrement": null, "action_name": "Judicial Enhancement Program" },
  { "increment": "money, internet", "decrement": null, "action_name": "Economic-Tech Synergy Project" },
  { "increment": "money, law", "decrement": null, "action_name": "Fiscal-Legal Reform Strategy" },
  { "increment": "internet, law", "decrement": null, "action_name": "Cyber-Governance Alliance" },
  { "increment": "money, internet, law", "decrement": null, "action_name": "Comprehensive Development Plan" },
  { "increment": null, "decrement": "money", "action_name": "Economic Contraction Measure" },
  { "increment": null, "decrement": "internet", "action_name": "Digital Infrastructure Setback" },
  { "increment": null, "decrement": "law", "action_name": "Legal System Deterioration" },
  { "increment": null, "decrement": "money, internet", "action_name": "Financial-Digital Decline" },
  { "increment": null, "decrement": "money, law", "action_name": "Economic-Judicial Recession" },
  { "increment": null, "decrement": "internet, law", "action_name": "Tech-Legal Setback" },
  { "increment": null, "decrement": "money, internet, law", "action_name": "Nationwide Regression" },
  { "increment": "money", "decrement": "internet", "action_name": "Asset Liquidation Focus" },
  { "increment": "money", "decrement": "internet, law", "action_name": "Fiscal Focus over Digital-Legal" },
  { "increment": "internet", "decrement": "money", "action_name": "Tech Over Economy Shift" },
  { "increment": "internet", "decrement": "money, law", "action_name": "Digital Dominance Strategy" },
  { "increment": "law", "decrement": "money", "action_name": "Regulatory Emphasis over Economy" },
  { "increment": "law", "decrement": "money, internet", "action_name": "Governance over Growth" },
  { "increment": "money, internet", "decrement": "law", "action_name": "Market-Tech Expansion at Legal Cost" },
  { "increment": "money, law", "decrement": "internet", "action_name": "Fiscal-Legal Priority over Tech" },
  { "increment": "internet, law", "decrement": "money", "action_name": "Cyber-Legal Advancement with Economic Sacrifice" },
  { "increment": "money, internet, law", "decrement": null, "action_name": "All-Inclusive Progression" }
]