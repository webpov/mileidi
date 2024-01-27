"use client";

import { Canvas } from "@react-three/fiber";
import { MileiCharacterGroup } from "./MileiCharacterGroup";
import { OrbitControls } from "@react-three/drei";


export const StartScreen = ({ state, calls }: any) => {
    return (<>
        <div className="">
            <div className="z-300 pos-rel tx-xxxl opaci-chov--50 tx-altfont-1 tx-white tx-shadow-5 hover-4"
                onClick={() => {
                    if (state.isPlaying) { return; }
                    calls.s__isPlaying(true);
                }}
            >
                Start
            </div>
            <div className="pos-abs top-0 left-0 flex-col "
                style={{height: "100vh", width: "96vw", left:"0vw"}}
            >
                <PointerFollowInit />
            </div>
        </div>
    </>);
};

export const PointerFollowInit = () => {
    return (<>
        <Canvas camera={{fov:50,position:[0,0,-4]}} shadows>
            <OrbitControls enableRotate={false} enablePan={false} enableZoom={false} />
            <pointLight position={[3, 3, -3]} castShadow />
            <ambientLight intensity={0.25} />
            <MileiCharacterGroup />
        </Canvas>
    </>)
}



    