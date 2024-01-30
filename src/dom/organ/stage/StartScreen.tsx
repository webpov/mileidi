"use client";
import Image from 'next/image'
import { Canvas } from "@react-three/fiber";
import { MileiCharacterGroup } from "./MileiCharacterGroup";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { MainContactMenu } from "./MainContactMenu";
import { Suspense, useEffect, useState } from "react";
import { UnrealBloomPass } from 'three-stdlib'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSearchParams } from 'next/navigation';


export const StartScreen = ({ state, calls, showStart=true }: any) => {
    return (<>
        <div className="">
            {showStart && <>
        <div className="z-300 pos-rel tx-xxxl opaci-chov--50 tx-altfont-1 tx-bold-8 tx-white tx-shadow-5 hover-4 mt-100"
        style={{textShadow: "2px 2px 0 #000000, 0 8px 20px #00336677"}}
                onClick={() => {
                    if (state.isPlaying) { return; }
                    calls.s__isPlaying(true);
                }}
            >
                Start
            </div>
            <div className="z-300 pos-abs bottom-0 right-0 px-4 pos-rel tx-lx tx-bold-6 opaci-chov--50 tx-altfont-1 tx-white tx-shadow-5 hover-3 mt-8"
        style={{textShadow: "2px 2px 0 #000000, 0 15px 20px #00336677"}}
        onClick={() => {
                    if (state.isPlaying) { return; }
                    calls.s__isPlaying(true);
                }}
            >
                Continue
            </div>
            </>}
            <div className="pos-abs top-0 left-0 flex-col "
                style={{height: "94vh", width: "96vw", left:"0vw"}}
            >
                <PointerFollowInit />
            </div>
        </div>
    </>);
};

export const PointerFollowInit = () => {
    const [currentSpeech, s__currentSpeech] = useState<any>()
    const [currentSpeechBg, s__currentSpeechBg] = useState<any>()

  const audioBgNotification = (src = "", ) => {
    if (!!currentSpeechBg) {
        currentSpeechBg.pause()
        s__currentSpeechBg(null)
        return
    }
    const audioBg = new Audio(src);
    audioBg.volume = 0.15
    audioBg.play();
    s__currentSpeechBg(audioBg)
}
    const audioNotification = (src = "") => {
    if (!!currentSpeech) {
        currentSpeech.pause()
        s__currentSpeech(null)
        return
    }
    const audio = new Audio(src);
    audio.play();
    s__currentSpeech(audio)
  };
  const searchParams = useSearchParams()
  const bloom = searchParams.has("hd")
    const [isReadyOnClient, s__isReadyOnClient] = useState(false)
    useEffect(()=>{
        s__isReadyOnClient(true)
    },[])
    return (<>
    
    
        
    <div className="pos-abs top-50p  mt-6 tx-shadow-5 bord-r-100 bg-w-50 border-white right-25p hover-6 z-200 " onClick={
        ()=>{
            
        }}>
            
            <details className='pos-rel'>
                <summary className='flex opaci-chov--50 tx-xl '
                onClick={()=>{
                    if (!currentSpeech && !currentSpeechBg) {
                        audioNotification("../sound/speech.mp3", )
                        audioBgNotification("../sound/bg.mp3", )
                    }
                }}
                ><div>🔊</div></summary>
                <div className='pos-abs right-0 mt-2'>
                    <div className='flex-col gap-2 flex-align-end'>
                    
                        <button className='nowrap opaci-chov--50 py-2  px-3 bg-b-50 bord-r-10 tx-white border-white ' onClick={()=>{
                            audioNotification("../sound/speech.mp3", )}}>
                                Speech
                            {!!currentSpeech ? "🔊" : "🔇" }
                        </button>
                        <button className='nowrap opaci-chov--50 py-2  px-3 bg-b-50 bord-r-10 tx-white border-white ' onClick={()=>{
                            audioBgNotification("../sound/bg.mp3", )}}>
                                Background
                            {!!currentSpeechBg ? "🔊" : "🔇" }
                        </button>
                    </div>
                </div>
            </details>
        </div>
        <div className="pos-abs top-0 mt-2 right-0 z-200">
            <MainContactMenu />
        </div>
        
        {!isReadyOnClient && <>
            <div className="pos-abs bottom-0">
                <Image alt="milei" width={298} height={360} src="/img/mileidithumb.png" style={{transform:"translateY(20px)"}} />
            </div>
        </>}
        {!!isReadyOnClient && <>

            <Canvas camera={{fov:50,position:[0,0,-4]}} shadows>
                         
          {!!bloom &&
            <EffectComposer multisampling={4}>
              <Bloom kernelSize={2} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
            </EffectComposer>
          }
                <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
                <pointLight position={[3, 3, -3]} castShadow />
                <ambientLight intensity={0.25} />
                
            <Sparkles
    color="white"
    size={2}
    scale={7}
    count={100}
    noise={1}
    opacity={1}
    
    speed={0.3}
  />
                <MileiCharacterGroup />
            </Canvas>
            </>}
    </>)
}



    