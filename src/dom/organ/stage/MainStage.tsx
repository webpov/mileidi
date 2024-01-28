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

export const BASE_ZONE_LIST = ["africa", "america", "antartic", "oceania"];
export const GLOBAL_SUPER_STATE: any = {
  "africa": {
    "POSITION": [0, 0, 0],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#FF4500',
    "BASE_COLOR": "orange",
    "MODEL_SHAPE": [
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
  },
  "america": {
    "POSITION": [-3, 0, 1.25],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#008000',
    "BASE_COLOR": "#22dd77",
    "MODEL_SHAPE": [
      [-0.15, 0.5],
      [0, 0.75],
      [0.45, 0.5],
      [0.35, 0.35],
      [0.4, 0.25],
      [0.2, 0],
      [0.02, -0.5],
      [-0.02, -0.5],
      [-.2, 0]
  ]
  },
  "antartic": {
    "POSITION": [1, 0, -2.5],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#808080',
    "BASE_COLOR": "white",
    "MODEL_SHAPE": [
      [-0.85, 0.25],
      [0, 0.35],
      [0.85, 0.25],
      [0.9, 0],
      [0.85, -0.25],
      [0, -0.35],
      [-0.95, -0.25],
      [-1.25, -0.1]
  ],
  },
  
  "atlantis": {
    "POSITION": [-3.5, 0, -0.5],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#0066FF',
    "BASE_COLOR": "#33bb33",
    "MODEL_SHAPE": [
      [-0.35, 0.25],
      [0, 0.22],
      [0.5, 0.25],
      [0.6, 0],
      [0.5, -0.25],
      [0.25, -0.5],
      [-0.45, -0.25],
      [-0.65, -0.1]
  ],
  },
  
  
  "eurasia": {
    "POSITION": [2.25, 0, -0.75],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#884400',
    "BASE_COLOR": "#997766",
    "MODEL_SHAPE": [
      [-0.45, 0.27],
      [0, 0.42],
      [0.7, 0.35],
      [0.8, 0],
      [0.5, -0.15],
      [0.25, -0.45],
      [-0.45, -0.35],
      [-0.65, -0.1]
  ],
  },
  "europe": {
    "POSITION":  [0.2, 0, -1],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#25aA7A',
    "BASE_COLOR": "#44cc99",
    "MODEL_SHAPE":  [
      [-0.42, 0.2],
      [0.1, 0.25],
      [0.55, 0.1],
      [0.35, -0.2],
      [0, -0.12],
      [-0.5, -0.18]
  ],
  },
  "oceania": {
    "POSITION":  [2.5, 0, 2],
    "INITIAL_STATS_ZONE": {
      "money": 3,
      "internet": 3,
      "law": 3,
    },
    "LOCAL_POSITION": [0, 0, 0],
    "MUTED_COLOR": '#A57A2A',
    "BASE_COLOR": "gold",
    "MODEL_SHAPE":  [
      [-0.2, 0.2],
      [0.1, 0.25],
      [0.35, 0.1],
      [0.2, -0.2],
      [0, -0.1],
      [-0.25, -0.05]
  ],
  },

}
const ZONES = Object.keys(GLOBAL_SUPER_STATE)

export const DEFAULT_INITIAL_STATE: GameState = {
  stats: {
    zone: ZONES.reduce((acc:any, zone) => {
      acc[zone] = GLOBAL_SUPER_STATE[zone].INITIAL_STATS_ZONE;
      return acc;
    }, {})
  }
};

export const ZONE_SHAPES = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].MODEL_SHAPE;
  return acc;
}, {});

export const ZONES_TO_POSITIONS = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].POSITION;
  return acc;
}, {});

export const ZONES_COLOR_POSITIONS: BoxData[] = ZONES.map(zone => ({
  position: GLOBAL_SUPER_STATE[zone].POSITION,
  zone: zone,
  color: GLOBAL_SUPER_STATE[zone].BASE_COLOR, // Assuming getColorForZone is a function that returns a color based on the zone
}));


export const POSITION_COLOR_LOOKUP = ZONES_COLOR_POSITIONS.reduce((acc:any, { position, color }:any) => {
    acc[position.join(',')] = color;
    return acc;
}, {} as {[key: string]: string});

export const ZONE_TO_MUTECOLOR = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].MUTED_COLOR;
  return acc;
}, {});


export const REGION_LOCAL_POSITIONS = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].LOCAL_POSITION;
  return acc;
}, {});
// New mapping from color to zone name
export default function MainStage() {
    const [playerScore, s__playerScore, s__score]:any = useGameState();
    const [mounted, s__Mounted] = useState(false);
    const [selectedZone, s__selectedZone] = useState('america'); // Default to orange (Egypt)
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



