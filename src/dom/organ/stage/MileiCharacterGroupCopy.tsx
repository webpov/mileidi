"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Box, OrbitControls, Sparkles, useGLTF } from "@react-three/drei";
import { RoundedBox } from "@react-three/drei";


export const MileiCharacterGroupCopy = ({onClick, motionRange=[4,1]}:any) => {
    const $boxRef: any = useRef();
    const $pointer:any  = useRef();
    useFrame((state, delta) => {
        const { mouse } = state;
        $boxRef.current.rotation.x = (mouse.y / motionRange[0])
        $boxRef.current.rotation.y = (mouse.x)*motionRange[1];
        $pointer.current.position.x = -(mouse.x)*1.5
        $pointer.current.position.y = (mouse.y)+1.75
    });
    return (
        <group position={[0, -1.35, 0]} onClick={(e)=>{e.stopPropagation(); onClick()}}>
          <group  ref={$pointer} position={[0,0,-2]}>
            {/* <Box >
              <meshStandardMaterial wireframe={true} />
            </Box> */}
          </group>

            <group ref={$boxRef}>
                <MileiHeadZ />
                
            </group>

            <group scale={[1, 1, 1]}>
                <MileiBodyZ />
            </group>
        </group>
    );
};
export function MileiBody({}: any) {
    const { scene: biglandscape01 } = useGLTF('../models/milei-body.glb')
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
    const { scene: biglandscape01 } = useGLTF('../models/milei-head.glb')
    return (<>
      <group scale={[1,1,1]} position={[0,0,0]}>
        <primitive object={biglandscape01} children-0-material-wireframe={true} 
          children-0-material-emissive={"#222222"} 
          children-0-material-color={"#000000"} 
        />
      </group>
    </>)
  }
  export function MileiBodyZ({}: any) {
      const { scene: biglandscape01 } = useGLTF('../models/milei-body-copy.glb')
      return (<>
        <group scale={[1,1,1]} position={[0,0,0]}>
          <primitive object={biglandscape01} children-0-material-wireframe={true} 
            children-0-material-emissive={"#222222"} 
            children-0-material-color={"#000000"} 
          />
        </group>
      </>)
    }
  
    export function MileiHeadZ({}: any) {
      const { scene: biglandscape01 } = useGLTF('../models/milei-head-copy.glb')
      return (<>
        <group scale={[1,1,1]} position={[0,0,0]}>
          <primitive object={biglandscape01} children-0-material-wireframe={true} 
            children-0-material-emissive={"#222222"} 
            children-0-material-color={"#000000"} 
          />
        </group>
      </>)
    }