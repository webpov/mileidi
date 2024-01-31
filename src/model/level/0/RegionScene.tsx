import { useRef } from 'react';
import { Box, Plane, RoundedBox, useTexture } from "@react-three/drei";
import { Mesh } from 'three';
import {  ZONES_COLOR_POSITIONS,ZONES_TO_POSITIONS, POSITION_COLOR_LOOKUP } from '@/dom/organ/stage/MainStage';
import { ZoneContainer } from './ZoneContainer';
import DynaText from '@/model/text/DynaText';


interface RegionSceneProps {
    state: any
    calls: {
        triggerSelectChange: (color: string) => void;
    }
}

export const RegionScene = ({ state, calls }: RegionSceneProps) => {
    const matcapTexture = useTexture('/img/insta360blurtiny.jpg');
    const $wireframeRef:any = useRef<Mesh>(null);
                // <meshMatcapMaterial matcap={matcapTexture}  color="#E58800"  />

    const handleBoxSelect = (zone: string) => {
        if (!$wireframeRef.current) { return }
        const position = ZONES_TO_POSITIONS[zone]
        console.log("zone", zone, ZONES_TO_POSITIONS[zone])
        console.log("position", ZONES_TO_POSITIONS, $wireframeRef.current)
        $wireframeRef.current.position.set(...position);
        console.log("position", position)
        // const color = POSITION_COLOR_LOOKUP[position.join(',')];
        // console.log("color", color)
        calls.triggerSelectChange(zone);
    };


    return (<>
        {ZONES_COLOR_POSITIONS.map((box, index) => (
            <ZoneContainer key={index} boxData={box} handleSelect={handleBoxSelect} 
                state={{zoneScore:state.playerScore.stats.zone[box.zone]}}
             />
        ))}
        <group position={[0, 0.74, 0]}  >
            <group ref={$wireframeRef} position={[-3, 0, 1.25]} scale={[0.67,0.67,0.67]}>
                <Box position={[0.2,0.6,0]} args={[0.01,4.3,0.01]}
                    rotation={[0,0,-.44]}
                ></Box>
                <group position={[1.5, 2, 1]} rotation={[-1,0,0]}>
                    <Plane position={[0,0.6,-0.01]} args={[1,1.2]}>
                        <meshStandardMaterial opacity={0.6} transparent  />
                    </Plane>
            <DynaText  onClick={()=>{}}
           text={`${state.selectedZone.toUpperCase()}`} color="#000000" font={0.2}
          position={[-0.0, 1, 0]} rotation={[0, 0, 0]}
        >
        </DynaText>
            <DynaText  onClick={()=>{}}
           text={`m = ${state.selectedPlayerScore["money"]}`} color="#118822" font={0.3}
          position={[-0.0, 0.75, 0]} rotation={[0, 0, 0]}
        >
        </DynaText>
        
        <DynaText  onClick={()=>{}}
           text={`i = ${state.selectedPlayerScore["internet"]}`} color="#0022aa" font={0.3}
          position={[0, 0.5, 0]} rotation={[0, 0, 0]}
        >
        </DynaText>
        
        <DynaText  onClick={()=>{}}
           text={`L = ${state.selectedPlayerScore["law"]}`} color="#aa2200" font={0.3}
          position={[0, 0.25, 0]} rotation={[0, 0, 0]}
        >
        </DynaText>
        </group>
            <Box  args={[0.8, 0.5, 0.25]} castShadow position={[0,-.2,0]}>
                    <meshStandardMaterial wireframe={true} color="#555555" />
                </Box>
                <Box  args={[0.22, 1, 0.22]} castShadow position={[0.3,0,0]} rotation={[0,Math.PI/4,0]}>
                    <meshStandardMaterial wireframe={true} color="#888888" />
                </Box>
                <RoundedBox args={[1, 0.2, 0.4]} castShadow position={[0, -0.33-.2, 0]} >
                    {/* <meshStandardMaterial  color="silver" /> */}
                <meshMatcapMaterial opacity={.6} transparent={true} matcap={matcapTexture}  color="#ffffff"  />

                </RoundedBox>
            </group>
            </group>
    </>);
}

