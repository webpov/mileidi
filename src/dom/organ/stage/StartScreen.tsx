"use client";
import Image from 'next/image'
import { Canvas } from "@react-three/fiber";
import { MileiCharacterGroup } from "./MileiCharacterGroup";
import { Box, OrbitControls, Plane, Sparkles, useTexture } from "@react-three/drei";
import { MainContactMenu } from "./MainContactMenu";
import { Suspense, useEffect, useState } from "react";
import { UnrealBloomPass } from 'three-stdlib'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSearchParams } from 'next/navigation';


export const StartScreen = ({ state, calls, showStart=true, mainActionClick }: any) => {
    const [counter, s__counter] = useState(0)
    const onMileiFigureClick = () => {
        // alert("asd")
        s__counter(counter+1)
        if (!!mainActionClick) {
            mainActionClick()
        }
      }
    return (<>
        <div className="">
            {showStart && <>
        <button className="noborder noselect bg-trans z-300 pos-rel tx-xxxl opaci-chov--50 tx-altfont-1 tx-bold-8 tx-white tx-shadow-5 hover-4 mt-100"
        // title={!!counter?`${counter}`:"Start"}
        style={{textShadow: "2px 2px 0 #000000, 0 8px 20px #00336677"}}
                onClick={() => {
                    if (state.isPlaying) { return; }
                    calls.s__isPlaying(true);
                }}
            >
                Start
            </button>
            <div className="z-300 pos-abs bottom-0 right-0 px-4 pos-rel flex-col tx-bold-6 opaci-chov--50 tx-altfont-1 tx-white tx-shadow-5  mt-8"
        style={{textShadow: "2px 2px 0 #000000, 0 15px 20px #00336677"}}
        onClick={() => {
                    if (state.isPlaying) { return; }
                    calls.s__isPlaying(true);
                }}
            >
                <div className="noselect Q_sm_x tx-lx"> Continue </div>
                <div className="noselect Q_xs tx-lgx"> Continue </div>
                <div className="noselect tx-lg"> Level {state.LS_lastLevelReached} </div>
            </div>
            </>}
            <div className="pos-abs top-0 left-0 flex-col "
                style={{height: "94vh", width: "96vw", left:"0vw"}}
            >
                <PointerFollowInit counter={counter} onMileiFigureClick={onMileiFigureClick} />
            </div>
        </div>
    </>);
};

export const PointerFollowInit = ({onMileiFigureClick, counter}:any) => {
  const searchParams = useSearchParams()
  const bloom = searchParams.has("hd")
  const wef = searchParams.has("wef")
    const [isReadyOnClient, s__isReadyOnClient] = useState(false)
    useEffect(()=>{
        s__isReadyOnClient(true)
    },[])

    const onMileiClick = () => {
        // alert("asd")
        onMileiFigureClick()
      }
    return (<>
    
    
     
        <div className="pos-abs top-0 mt-2 right-0 z-200">
            <MainContactMenu />
        </div>
        
        {!isReadyOnClient && <>
            <div className="pos-abs bottom-0">
                <Image alt="milei" width={298} height={360} src="/img/mileidithumb.png" style={{transform:"translateY(20px)"}} />
            </div>
        </>}
        {!!isReadyOnClient && <>

            <Canvas camera={{fov:50,position:[-2,0,-4]}} shadows>
                         
          {!!bloom &&
            <EffectComposer multisampling={4}>
              <Bloom kernelSize={2} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
            </EffectComposer>
          }
                <OrbitControls autoRotateSpeed={0.3} autoRotate={true} enablePan={false} enableZoom={false} maxPolarAngle={Math.PI/2+.4} minPolarAngle={Math.PI/2} 
                    maxAzimuthAngle={Math.PI+0.5}
                    minAzimuthAngle={Math.PI-0.5}
                />
                <pointLight position={[3, 3, -3]} castShadow />
                <ambientLight intensity={0.25} />
                
            <Sparkles
    color="white"
    size={2}
    scale={7}
    count={100+(counter*2)}
    noise={1}
    opacity={1}
    
    speed={0.3}
  />    
  <group position={[0,-2.3,-0.2]}>
    {wef && <WefBG />}
  <Box args={[1.5,1,0.3]}>
    <meshStandardMaterial color="white" />
  </Box>
  <Box args={[1.4,0.2,0.29]} position={[0,.35,-0.01]}>
    <meshStandardMaterial color="blue" />
  </Box>
  </group>
                <MileiCharacterGroup onClick={onMileiClick} motionRange={[4,1]} />
            </Canvas>
            </>}
    </>)
}



    export const WefBG = () => {
        const $wefBg:any = useTexture("../img/wefbg.jpg")
        return (<>
            <Plane rotation={[0,Math.PI,0]} args={[6.73,4.11]} position={[0,1.6,2]}>
        <meshStandardMaterial map={$wefBg}  />
    </Plane>
        </>)
    }