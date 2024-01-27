"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";


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
            <div className="pos-abs top-0 left-0 flex-col w-100vw h-100vh">
                <PointerFollowInit />
            </div>
        </div>
    </>);
};

export const PointerFollowInit = () => {
    return (<>
        <Canvas camera={{fov:50,position:[0,0,-4]}} shadows
          // onCreated={(state)=>{
          //   state.gl.setClearColor("#ccf0Ff"); state.scene.fog = new Fog("#ccf0Ff",6,12)
          // }}
        >
            <OrbitControls />
            <pointLight position={[3, 3, -3]} castShadow />
            <ambientLight intensity={0.25} />
            <QubGroup />
        </Canvas>
    </>)
}


export const QubGroup = () => {
    // const matcapTexture = useTexture('/clearhdri.jpg');

    const urlWireframe = false

    const $boxRef:any = useRef();

    useFrame((state, delta) => {
        const { mouse } = state;
        $boxRef.current.rotation.x = (mouse.y/1)+0.25
        $boxRef.current.rotation.y = (mouse.x*1.5)
    });
    // useFrame((state, delta) => {
    //     $boxRef.current.rotation.y -= 0.001; // Rotate Box
    //     $boxRef.current.rotation.x += 0.001; // Rotate Box
    //     $boxRef.current.rotation.z += 0.002; // Rotate Box
    // });
    return (
        <group position={[0,-1.35,0]}>
            
            <group ref={$boxRef}>
                {/* <RoundedBox  args={[0.5,0.5,0.5]} position={[0,0,0]} rotation={[0,0,0]} receiveShadow castShadow>
                    <meshStandardMaterial color="#F700EA" emissive={"#a70077"} metalness={0.25} roughness={0.25}  wireframe={urlWireframe} />
                </RoundedBox> */}
                <MileiHead />
            </group>

            <group scale={[1,1,1]}>
                <MileiBody />
            </group>
        </group>
    );
};


export function MileiBody({}: any) {
    const { scene: biglandscape01 } = useGLTF('../models/mileid-body.glb')
    return (<>
      <group scale={[1,1,1]} position={[0,0,0]}>
        <primitive object={biglandscape01} children-0-material-wireframe={true} 
          children-0-material-emissive={"#222222"} 
          children-0-material-color={"#000000"} 
        />
      </group>
    </>)
  }

  export function MileiHead({}: any) {
    const { scene: biglandscape01 } = useGLTF('../models/mileid-head.glb')
    return (<>
      <group scale={[1,1,1]} position={[0,0,0]}>
        <primitive object={biglandscape01} children-0-material-wireframe={true} 
          children-0-material-emissive={"#222222"} 
          children-0-material-color={"#000000"} 
        />
      </group>
    </>)
  }
    