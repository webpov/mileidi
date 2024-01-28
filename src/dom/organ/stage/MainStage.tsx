"use client"

import FirstLevel from "@/model/level/0";
import { useMemo, useState } from "react";
import useGameState from "@/../script/util/hook/useGameState";
import { BaseActionButtons } from "./BaseActionButtons";
import { MainContactMenu } from "./MainContactMenu";
import { PlayerScore } from "./PlayerScore";
import { StartScreen } from "./StartScreen";

export interface ZoneSats {
    [key: string]: {
      money: number;
      internet: number;
      law: number;
    };
  }
  
  export interface GameState {
    stats: {
      zone: ZoneSats;
    };
  }
export type StatType = 'money' | 'internet' | 'law';

export const DEFAULT_INITIAL_STATE: GameState = {
  stats: {
    zone: {
      "africa": {
        "money": 3,
        "internet": 3,
        "law": 3,
      },
      "antartic": {
        "money": 3,
        "internet": 3,
        "law": 3,
      },
      "oceania": {
        "money": 3,
        "internet": 3,
        "law": 3,
      },
      "america": {
        "money": 3,
        "internet": 3,
        "law": 3,
      }
    }
  }
};
export const DEFAULT_ICON_LOOKUP:any = {
    '💰': 'money',
    '🌐': 'internet',
    '⚖️': 'law'
};

export interface BoxData {
    position: [number, number, number];
    color: string;
    zone: string;
}

export const ZONE_SHAPES:any = {
  "africa": [
      [-0.4, 0.45],
      [0, 0.55],
      [0.5, 0.5],
      [0.65, 0.25],
      [0.45, -0.1],
      [0.35, -0.5],
      [0, -0.6],
      [-0.15, -0.15],
      [-0.45, 0.15]
  ],
  "america": [
      [-0.15, 0.5],
      [0, 0.75],
      [0.45, 0.5],
      [0.35, 0.35],
      [0.4, 0.25],
      [0.2, 0],
      [0.02, -0.5],
      [-0.02, -0.5],
      [-.2, 0]
  ],
  "antartic": [
      [-0.85, 0.25],
      [0, 0.35],
      [0.85, 0.25],
      [0.9, 0],
      [0.85, -0.25],
      [0, -0.35],
      [-0.95, -0.25],
      [-1.25, -0.1]
  ],
  "oceania": [
      [-0.2, 0.2],
      [0.1, 0.25],
      [0.35, 0.1],
      [0.2, -0.2],
      [0, -0.1],
      [-0.25, -0.05]
  ],
}
export const ZONES_TO_POSITIONS:any = {
  
  "africa": [0, 0, 0],
  "antartic": [1, 0, -2.5],
  "oceania": [2.5, 0, 2],
  "america": [-3, 0, 1.25],
}
export const ZONES_COLOR_POSITIONS: BoxData[] = [
    { position: [0, 0, 0], zone: "africa",color: "orange" },
    { position: [1, 0, -2.5], zone: "antartic",color: "white" },
    { position: [2.5, 0, 2], zone: "oceania",color: "gold" },
    { position: [-3, 0, 1.25], zone: "america",color: "cyan" },
];
export const POSITION_COLOR_LOOKUP = ZONES_COLOR_POSITIONS.reduce((acc, { position, color }) => {
    acc[position.join(',')] = color;
    return acc;
}, {} as {[key: string]: string});


// New mapping from color to zone name
export const COLOR_TO_ZONE: {[color: string]: string} = {
  'orange': 'africa',
  'white': 'arctic',
  'gold': 'oceania',
  'cyan': 'america'
};
// New mapping from color to zone name
export const ZONE_TO_MUTECOLOR: {[color: string]: string} = {
  'africa': '#FF4500',  // orangered
  'arctic': '#808080',  // grey
  'oceania': '#A52A2A', // brown
  'america': '#0066FF'  // blue
};

export const REGION_LOCAL_POSITIONS: {[color: string]: any} = {
    'orange': [0, 0, 0],
    'white': [0, 0, 0],
    'gold': [0, 0, 0],
    'cyan':[0, 0, 0]
};
export default function MainStage() {
    const [playerScore, s__playerScore, s__score]:any = useGameState();
    const [mounted, s__Mounted] = useState(false);
    const [selectedZone, s__selectedZone] = useState('africa'); // Default to orange (Egypt)
    const selectedPlayerScore = useMemo(() => {
        return playerScore.stats.zone[selectedZone]
    }, [playerScore.stats.zone, selectedZone]);
    const mutedColor = useMemo(() => {
      return ZONE_TO_MUTECOLOR[selectedZone]
    }, [selectedZone]);
    // Function to update selectedZone based on color, translating it to zone name
    const triggerSelectChange = (zoneProp: string) => {
        const zone = zoneProp
        console.log("zone", zone)
        s__selectedZone(zone);
    };

    const triggerClickedAction = (statName: StatType) => {
        console.log("triggerClickedAction", statName)
        s__score(selectedZone, statName, 1)
    }

    if (!mounted) return (
        <div className="w-100 h-100 flex-col ">
            <StartScreen state={{ isPlaying: mounted }} calls={{ s__isPlaying: s__Mounted }} />
        </div>)

    return (<>
        <div className="pos-abs bottom-0 left-0 z-200">
            <div className="pa-2 flex-col flex-align-start gap-1 ">
                <PlayerScore zone={selectedZone} score={selectedPlayerScore}
                  color={mutedColor}
                />
            </div>
        </div>
        <div className="pos-abs right-0 z-200">
            <MainContactMenu />
        </div>
        <div className="pos-abs bottom-0 right-0 z-100">
            <BaseActionButtons calls={{ triggerClickedAction }} />
        </div>
        <div className="pos-abs top-0 left-0 bord-r-25 noverflow mt-2"
                style={{height: "96vh", width: "100%"}}
          >
            <FirstLevel state={{playerScore, selectedZone}} calls={{ triggerSelectChange }} />
        </div>
    </>)
}



