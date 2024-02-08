"use client"
import FirstLevel from "@/model/level/0";
import { useContext, useMemo, useState } from "react";
import useGameState from "@/../script/util/hook/useGameState";
import { BaseActionButtons } from "./BaseActionButtons";
import { MainContactMenu } from "./MainContactMenu";
import { PlayerScore } from "./PlayerScore";
import { PointerFollowInit, StartScreen } from "./StartScreen";
import { SupportSection, WIP } from "@/app/lvl/1/WIP";
import { AudioContext } from "../../../../script/state/context/AudioContext";
import { DEFAULT_INITIAL_STATE, ZONE_TO_MUTECOLOR } from "../../../../script/constant";
import { WagmiContainer } from "@/dom/WagmiContainer";
import { CloseWinLoseModal } from "./CloseWinLoseModal";
import { WinLoseReloadButton } from "./WinLoseReloadButton";
import { SpentBadges } from "./SpentBadges";
import { CountryLoseMessage } from "./CountryLoseMessage";
import { StatType } from "../../../../script/constant/zones";
import { useLocalStorage } from "usehooks-ts";


// import '@rainbow-me/rainbowkit/styles.css';
// import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
// import { phantomWallet } from '@rainbow-me/rainbowkit/wallets';
// // #ts-ignore
// import {configureChains,createClient,goerli,WagmiConfig,} from 'wagmi';
// import { publicProvider } from 'wagmi/providers/public';




export default function MainStage({mainAction}:any) {
  const [isWinScreen, s__isWinScreen] = useState(null)
  const [isLoseScreen, s__isLoseScreen] = useState<any>(null)
  const [finals, s__finals] = useState<any>([])
  const [unixCount, s__unixCount] = useState<any>(0)
  const [unixCountFinal, s__unixCountFinal] = useState<any>(0)
  const [LS_lastLevelReached, s__LS_lastLevelReached] = useLocalStorage<any>("lastLevelReached",0)
  
  
  const addFinalObj = (data:any) => {
    if (isLoseScreen || isWinScreen) return
    if (!data) {
      return
    }
    let finalObjs:any = [...finals]
    finalObjs.push(data)
    if (data.win) {
      setTimeout(()=>{audioCtx.play("../sound/clap.ogg")},250)
      if (LS_lastLevelReached >= 1){
        s__LS_lastLevelReached(2)
      } else {
        s__LS_lastLevelReached(1)
      }
    } else {
      setTimeout(()=>{audioCtx.play("../sound/dead.wav")},250)
    }
    s__finals(finalObjs)
    s__unixCountFinal(Date.now())
  }
  const audioCtx = useContext(AudioContext)
    const [playerScore, s__playerScore,
      s__score, s__isGameStared, maxScores, avail, isFinished
    ]:any = useGameState(DEFAULT_INITIAL_STATE, 9, addFinalObj);
    const [mounted, s__Mounted] = useState(false);
    const [selectedZone, s__selectedZone] = useState('america')
    const selectedPlayerScore = useMemo(() => {
      return playerScore.stats.zone[selectedZone]
    }, [playerScore, playerScore.stats.zone, selectedZone]);
    const mutedColor = useMemo(() => {
      return ZONE_TO_MUTECOLOR[selectedZone]
    }, [selectedZone]);
    
    const triggerSelectChange = (zoneProp: string) => {
      const zone = zoneProp
      s__selectedZone(zone);
      if (isFinished) { return }
      audioCtx.play("../sound/click58.wav")
      s__unixCountFinal(Date.now())
    };
    const mainActionClick = () => {
      s__unixCount(Date.now())
      audioCtx.play("../sound/light.mp3")
      mainAction()
    }
    const triggerClickedAction = (statName: StatType) => {
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
            <StartScreen mainActionClick={mainActionClick} state={{ LS_lastLevelReached, isPlaying: mounted }}
              calls={{ s__isPlaying: (val:boolean)=>{
                audioCtx.play("../sound/click58.wav");
                s__unixCount(Date.now());
                s__Mounted(val);
                s__isGameStared(val)
              }
            }} 
            />
        </div>)

    return (<>
    {!!unixCount && !!unixCountFinal &&
      <div className="tx-red z-800 pos-abs bottom-0 left-50p translate-y-100 tx-sans bord-r-10 bg-w-50 border-white px-2 tx-shadow- py-1 tx-bold-6">{parseInt(`${(unixCountFinal-unixCount)/1000}`)}s</div>
    }

      {!!finals?.length && !finals[0]?.win && 
        <div className="pos-abs w-70 pt-6 px-8 Q_xs_px-2 pa-2 mt-150 ml-4 z-800 bg-glass-20 bg-w-50  border-white bord-r-50  w-50">
    <div className="pos-abs w-60 h-95 Q_lg_x">
    <PointerFollowInit counter={0} onMileiFigureClick={()=>{}} />
    </div>

          <CloseWinLoseModal {...{s__finals}} />          
          <div className="tx-m tx-bold-4 pb-2 px-8 Q_xs_px-2 tx-red opaci-50 w-50 tx-altfont-1">{"Quest Failed!"}</div>
          <CountryLoseMessage {...{finals}} />
          <hr className="" />
          <SpentBadges {...{maxScores, unixCount, unixCountFinal}} />
          <hr className="Q_xs" />
          <div className="flex-col gap-1 py-4">
            <SupportSection />
            <hr className="" />
            <div className="flex-center gap-2">
              <WinLoseReloadButton />
            </div>
          </div>
        </div>
      }
      {!!finals?.length && !!finals[0]?.win && 
        <div className="pos-abs tx-altfont-1 pa-4 mt-150 ml-4 Q_xs_px-5 z-800 bg-glass-20 bg-w-50 pa-8 border-white bord-r-50  w-50">
              <div className="pos-abs w-60  Q_lg_x" style={{height:"93%"}}>
    <PointerFollowInit counter={0} onMileiFigureClick={()=>{}} />
    </div>
          <div className="tx-lgx tx-bold-8 pt-2 pb-4  Q_xs">{"Congratulations!"}</div>
          <div className="tx-lx Q_sm_md">{"Congratulations!"} <br /> <div className="tx-shadow-5 tx-bold-8 hover-jump" style={{color:"gold"}}>You've Won!</div></div>
          <div className="tx-xl flex-justify-start flex-wrap gap-2 Q_lg_x"><div>{"Congratulations!"} </div><br /> <div className="px-2 tx-shadow-5 tx-bold-8 hover-jump" style={{color:"gold"}}>You've Won!</div></div>
          <CloseWinLoseModal {...{s__finals}} />
          <hr className="w-80 Q_sm_x" />
          <SpentBadges {...{maxScores, unixCount, unixCountFinal}} />
          <div className="flex-col gap-1">
            <SupportSection />
            <br />
            <div className="flex-center gap-2">
              <WinLoseReloadButton />
              <a href='/' className=' tx-black tx-lg bord-r-50 px-8 border-white bg-w-10 tx-bold-8 bg-glass-10 py-2 tx-altfont-1 opaci-chov--75 '>
                Continue Lvl#{LS_lastLevelReached}
              </a>
            </div>
          </div>
        </div>
      }
      <div className="pos-abs bottom-0 left-0 z-200">
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
        <FirstLevel state={{selectedPlayerScore, playerScore, selectedZone, LS_lastLevelReached}} calls={{ triggerSelectChange }} />
      {/* </WagmiContainer>} */}
    </div>
  </>)
}