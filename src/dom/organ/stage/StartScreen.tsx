"use client";

import { Canvas } from "@react-three/fiber";
import { MileiCharacterGroup } from "./MileiCharacterGroup";
import { OrbitControls } from "@react-three/drei";
import { MainContactMenu } from "./MainContactMenu";


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
    return (<>
    
        <div className="pos-abs top-0 mt-2 right-0 z-200">
            <MainContactMenu />
        </div>
        <Canvas camera={{fov:50,position:[0,0,-4]}} shadows>
            <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
            <pointLight position={[3, 3, -3]} castShadow />
            <ambientLight intensity={0.25} />
            <MileiCharacterGroup />
        </Canvas>
    </>)
}



    