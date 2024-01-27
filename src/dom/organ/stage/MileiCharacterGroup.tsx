"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { RoundedBox } from "@react-three/drei";


export const MileiCharacterGroup = () => {
    const $boxRef: any = useRef();

    useFrame((state, delta) => {
        const { mouse } = state;
        $boxRef.current.rotation.x = (mouse.y / 1) + 0.25;
        $boxRef.current.rotation.y = (mouse.x * 1.5);
    });
    return (
        <group position={[0, -1.35, 0]}>

            <group ref={$boxRef}>
                <MileiHead />
            </group>

            <group scale={[1, 1, 1]}>
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