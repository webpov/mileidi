"use client"

import FirstLevel from "@/model/level/0";
import { useMemo, useState } from "react";
import useGameState from "@/../script/util/hook/useGameState";
import { BaseActionButtons } from "./BaseActionButtons";
import { MainGameMenu } from "./MainGameMenu";
import { PlayerScore } from "./PlayerScore";
import { StartScreen } from "./StartScreen";

export interface CountryStats {
    [key: string]: {
      money: number;
      internet: number;
      law: number;
    };
  }
  
  export interface GameState {
    stats: {
      country: CountryStats;
    };
  }
export type StatType = 'money' | 'internet' | 'law';

export const DEFAULT_INITIAL_STATE: GameState = {
  stats: {
    country: {
      "africa": {
        "money": 0,
        "internet": 0,
        "law": 0,
      },
      "arctic": {
        "money": 0,
        "internet": 0,
        "law": 0,
      },
      "oceania": {
        "money": 0,
        "internet": 0,
        "law": 0,
      },
      "america": {
        "money": 0,
        "internet": 0,
        "law": 0,
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
}

export const COUNTRY_SHAPES:any = {
  "orange": [
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
  "cyan": [
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
  "white": [
      [-0.85, 0.25],
      [0, 0.35],
      [0.85, 0.25],
      [0.9, 0],
      [0.85, -0.25],
      [0, -0.35],
      [-0.95, -0.25],
      [-1.25, -0.1]
  ],
  "gold": [
      [-0.2, 0.2],
      [0.1, 0.25],
      [0.35, 0.1],
      [0.2, -0.2],
      [0, -0.1],
      [-0.25, -0.05]
  ],
}
export const COUNTRIES_COLOR_POSITIONS: BoxData[] = [
    { position: [0, 0, 0], color: "orange" },
    { position: [1, 0, -2.5], color: "white" },
    { position: [2.5, 0, 2], color: "gold" },
    { position: [-3, 0, 1.25], color: "cyan" },
];
export const POSITION_COLOR_LOOKUP = COUNTRIES_COLOR_POSITIONS.reduce((acc, { position, color }) => {
    acc[position.join(',')] = color;
    return acc;
}, {} as {[key: string]: string});


// New mapping from color to country name
export const COLOR_TO_COUNTRY: {[color: string]: string} = {
  'orange': 'africa',
  'white': 'arctic',
  'gold': 'oceania',
  'cyan': 'america'
};
// New mapping from color to country name
export const COUNTRY_TO_MUTECOLOR: {[color: string]: string} = {
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
    const [selectedCountry, s__selectedCountry] = useState('africa'); // Default to orange (Egypt)
    const selectedPlayerScore = useMemo(() => {
        return playerScore.stats.country[selectedCountry]
    }, [playerScore.stats.country, selectedCountry]);
    const mutedColor = useMemo(() => {
      return COUNTRY_TO_MUTECOLOR[selectedCountry]
    }, [selectedCountry]);
    // Function to update selectedCountry based on color, translating it to country name
    const triggerSelectChange = (color: string) => {
        const country = COLOR_TO_COUNTRY[color] || color; // Fallback to the color if no country match
        s__selectedCountry(country);
    };

    const triggerClickedAction = (statName: StatType) => {
        console.log("triggerClickedAction", statName)
        s__score(selectedCountry, statName, 1)
    }

    if (!mounted) return (
        <div className="w-100 h-100 flex-col pt-100">
            <StartScreen state={{ isPlaying: mounted }} calls={{ s__isPlaying: s__Mounted }} />
        </div>)

    return (<>
        <div className="pos-abs bottom-0 left-0 z-200">
            <div className="pa-2 flex-col flex-align-start gap-1 ">
                <PlayerScore country={selectedCountry} score={selectedPlayerScore}
                  color={mutedColor}
                />
            </div>
        </div>
        <div className="pos-abs right-0 z-200">
            <MainGameMenu />
        </div>
        <div className="pos-abs bottom-0 right-0 z-100">
            <BaseActionButtons calls={{ triggerClickedAction }} />
        </div>
        <div className="pos-abs top-0 left-0 bord-r-25 noverflow mt-2"
                style={{height: "96vh", width: "100%"}}
          >
            <FirstLevel state={{playerScore, selectedCountry}} calls={{ triggerSelectChange }} />
        </div>
    </>)
}



