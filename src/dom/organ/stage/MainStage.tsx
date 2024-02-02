"use client"

import FirstLevel from "@/model/level/0";
import { useContext, useMemo, useState } from "react";
import useGameState from "@/../script/util/hook/useGameState";
import { BaseActionButtons } from "./BaseActionButtons";
import { MainContactMenu } from "./MainContactMenu";
import { PlayerScore } from "./PlayerScore";
import { StartScreen } from "./StartScreen";
import { WagmiContainer } from "@/dom/WagmiContainer";
import { SupportSection, WIP } from "@/app/lvl/1/WIP";
import { AudioContext } from "../../../../script/state/context/AudioContext";






export const STATS_SFX_MAIN = {
  "money": "../sound/cash2.wav",
  "internet": "../sound/ping.wav",
  "law": "../sound/info.wav",
}



// import '@rainbow-me/rainbowkit/styles.css';
// import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
// import { phantomWallet } from '@rainbow-me/rainbowkit/wallets';
// // #ts-ignore
// import {configureChains,createClient,goerli,WagmiConfig,} from 'wagmi';
// import { publicProvider } from 'wagmi/providers/public';








export interface ZoneSats {
    [key: string]: {
      money: number;
      internet: number;
      law: number;
    };
  }
  
  export interface GameState {
    stats: {
      available: {
        money: number
        internet: number
        law: number
      };
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

export const BASE_ZONE_LIST = ["africa", "america", "antartic", "n.america", "oceania",];
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
  
  "n.america": {
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
  
  
  "asia": {
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
    available: {
      money: 5,
      internet: 5,
      law: 5,
    },
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
export default function MainStage({mainAction}:any) {
  const [isWinScreen, s__isWinScreen] = useState(null)
  const [isLoseScreen, s__isLoseScreen] = useState<any>(null)
  const [finals, s__finals] = useState<any>([])
  const [unixCount, s__unixCount] = useState<any>(0)
  const [unixCountFinal, s__unixCountFinal] = useState<any>(0)
  // @ts-ignore
  // const isSolana = !!window ? window?.solana : null
  const addFinalObj = (data) => {

    if (isLoseScreen || isWinScreen) return
    if (!data) {
      // s__isLoseScreen("you lose")
      // // if (!!window && window.confirm(msg+"\n\n\n Do you wish to reload the page?")) {
      // //   window?.location.reload()
      // // }
      return
    }
    let finalObjs:any = [...finals]
    finalObjs.push(data)
    if (data.win) {
      setTimeout(()=>{audioCtx.play("../sound/clap.ogg")},250)
    } else {
      setTimeout(()=>{audioCtx.play("../sound/dead.wav")},250)
    }
    
    s__finals(finalObjs)
    s__unixCountFinal(Date.now())
    // s__isWinScreen(data)

  }
  const audioCtx = useContext(AudioContext)
    const [playerScore, s__playerScore, s__score, s__isGameStared, maxScores, avail, isFinished]:any = useGameState(DEFAULT_INITIAL_STATE, 9, addFinalObj);
    const [mounted, s__Mounted] = useState(false);
    const [selectedZone, s__selectedZone] = useState('america'); // Default to orange (Egypt)
    const selectedPlayerScore = useMemo(() => {
        return playerScore.stats.zone[selectedZone]
    }, [playerScore, playerScore.stats.zone, selectedZone]);
    const mutedColor = useMemo(() => {
      return ZONE_TO_MUTECOLOR[selectedZone]
    }, [selectedZone]);
    // Function to update selectedZone based on color, translating it to zone name
    const triggerSelectChange = (zoneProp: string) => {
        const zone = zoneProp
        // console.log("zone", zone)
        s__selectedZone(zone);
        if (isFinished) {return}
          // console.log("../sound/click58.wav")
        // audioCtx.s__playingTrack("../sound/click47.wav")
        // if (Math.random() > 0.5) {
          audioCtx.play("../sound/click58.wav")
        // } else {
          // audioCtx.play("../sound/click47.wav")
        // }
        s__unixCountFinal(Date.now())
    };
    const mainActionClick = () => {
      // console.log("s__unixCount(Date.now()); ", Date.now())
    s__unixCount(Date.now())
    audioCtx.play("../sound/light.mp3")
    mainAction()
      // s__Mounted(true);
      // s__isGameStared(true)      
    }
    const triggerClickedAction = (statName: StatType) => {
        // console.log("triggerClickedAction", statName, STATS_SFX_MAIN[statName])

          
          
          s__score(selectedZone, statName, 1)
    }
    
// =============================================================================
// Rainbowkit Configuration
// =============================================================================
// initalize which chains your dapp will use, and set up a provider
// if (!publicProvider()) return (<></>)
try {
  // configureChains([goerli], [publicProvider()])
} catch (error) {
  return (<></>)
}
// // #ts-ignore
// const { chains, provider } = configureChains([goerli], [publicProvider()]);
// const connectors = connectorsForWallets([
//   {
//     groupName: 'Phantom',
//     wallets: [phantomWallet({ chains })],
//   },
// ]);

// const wagmiClient = createClient({
//   connectors,
//   provider,
// });

    if (!mounted) return (
        <div className="w-100 h-100 flex-col ">
            <StartScreen mainActionClick={mainActionClick} state={{ isPlaying: mounted }} calls={{ s__isPlaying: (val:boolean)=>{audioCtx.play("../sound/click58.wav");s__unixCount(Date.now()); s__Mounted(val);s__isGameStared(val)} }} />
        </div>)

    return (<>
    {!!unixCount && !!unixCountFinal &&
      <div className="tx-red z-800 pos-abs bottom-0 left-50p translate-y-100 tx-sans bord-r-10 bg-w-50 border-white px-2 tx-shadow- py-1 tx-bold-6">{parseInt(`${(unixCountFinal-unixCount)/1000}`)}s</div>
    }

      {!!finals?.length && !finals[0]?.win && 
        <div className="pos-abs w-70 pt-6 px-8 Q_xs_px-2 pa-2 mt-150 ml-4 z-800 bg-glass-20 bg-w-50  border-white bord-r-50  w-50">
          {/* <div>You've LOSS</div> */}
          <button onClick={()=>{s__finals([])}} 
          className='Q_xs box-shadow-5-b bord-r-100 mr- mt- tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
          <button onClick={()=>{s__finals([])}} 
          className='Q_sm_x box-shadow-5-b bord-r-100 mr-8 mt-8 tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
          
          <div className="tx-m tx-bold-4 pb-2 px-8 Q_xs_px-2 tx-red opaci-50 tx-altfont-1">{"Quest Failed!"}</div>
          <div className="tx-lx  tx-bold-6  tx-altfont-1  px-6 Q_sm_x">{JSON.stringify(finals[0].alertmsg.replace("\n\n",""))}</div>
          <div className="tx-lg  tx-bold-6  tx-altfont-1 px-2 Q_xs">{JSON.stringify(finals[0].alertmsg.replace("\n\n",""))}</div>
          {/* <div className="tx-lgx Q_xs">{isLoseScreen}</div> */}
          {/* <div className="tx-xl Q_sm_x">{isLoseScreen}</div> */}
      <hr className="" />
          <div className="flex gap-1 flex-wrap flex-justify-start px-8 Q_xs_px-2">
            <div className="tx-altfont-1 tx-bold-8 opaci-40">Spent:</div>
            <div className="flex gap-1">
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>💰</div> {maxScores.maxScore1}</div>
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>🌐</div> {maxScores.maxScore2}</div>
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>⚖️</div> {maxScores.maxScore3}</div>
          
          </div>
          <div className="border-white px-2 py-1 bord-r-10 bg-b-10 tx-altfont-1 tx-bold-8">{parseInt(`${(unixCountFinal-unixCount)/1000}`)}s</div>
          </div>
      <hr className="Q_xs" />
          <div className="flex-col gap-1 py-4">
          {/* <SupportSection /> */}
      <hr className="" />
      <a href='/' className='tx-black tx-lg bord-r-50 px-8 border-white bg-w-10 tx-bold-8 bg-glass-10 py-2 tx-altfont-1 opaci-chov--50 '>
        Reload
      </a>
          </div>
        </div>
      }
      {!!finals?.length && !!finals[0]?.win && 
        <div className="pos-abs tx-altfont-1 pa-4 mt-150 ml-4 Q_xs_px-5 z-800 bg-glass-20 bg-w-50 pa-8 border-white bord-r-50  w-50">
          {/* <div>You've LOSS</div> */}
          <div className="tx-lg pt-4 Q_xs">{"Congratulations!"}</div>
          <div className="tx-xl Q_sm_x">{"Congratulations!"}</div>
          <button onClick={()=>{s__finals([])}} className='Q_xs box-shadow-5-b bord-r-100 mr- mt- tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
          <button onClick={()=>{s__finals([])}} className='Q_sm_x box-shadow-5-b bord-r-100 mr-8 mt-8 tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
      <hr className="w-80 Q_sm_x" />
      <div className="flex-wrap my-2 gap-1 ">
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>💰</div> {maxScores.maxScore1}</div>
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>🌐</div> {maxScores.maxScore2}</div>
          <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>⚖️</div> {maxScores.maxScore3}</div>
          <div className=" tx-center border-white px-2 py-1 bord-r-10 bg-b-10 tx-altfont-1 tx-bold-8">Time: {parseInt(`${(unixCountFinal-unixCount)/1000}`)}s</div>
          
          </div>
      {/* <hr className="w-80" /> */}
          <div className="flex-col gap-1">
          <SupportSection />
          {/* <WIP /> */}
      <hr />
      <a href='/' className='tx-black tx-lg bord-r-50 px-8 border-white bg-w-10 tx-bold-8 bg-glass-10 py-2 tx-altfont-1 opaci-chov--50 '>
        Reload
      </a>
          </div>
        </div>
      }


        <div className="pos-abs bottom-0 left-0 z-200">
          {/* {JSON.stringify(avail)} */}
            <div className="pa-2 flex-col flex-align-start gap-1 ">
                <PlayerScore zone={selectedZone} score={selectedPlayerScore}
                  color={mutedColor} available={avail} maxScores={maxScores}
                />
            </div>
        </div>
        <div className="pos-abs right-0 z-200">
            <MainContactMenu />
        </div>
        <div className="pos-abs bottom-0 right-0 z-100">
            <BaseActionButtons calls={{ triggerClickedAction }} />
        </div>
        <div className="pos-abs top-0 left-0 bord-r-25 noverflow  mt-2"
                style={{height: "96vh", width: "100%"}}
          >
{/* {isSolana && <WagmiContainer > */}
            <FirstLevel state={{selectedPlayerScore, playerScore, selectedZone}} calls={{ triggerSelectChange }} />
        {/* </WagmiContainer>} */}
        </div>



    </>)
}



