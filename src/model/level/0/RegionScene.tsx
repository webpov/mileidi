import { useRef } from 'react';
import { Box, RoundedBox, useTexture } from "@react-three/drei";
import { Mesh } from 'three';
import { COLOR_TO_ZONE, ZONES_COLOR_POSITIONS,ZONES_TO_POSITIONS, POSITION_COLOR_LOOKUP } from '@/dom/organ/stage/MainStage';
import { ZoneContainer } from './ZoneContainer';


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
        <group position={[0, 0.74, 0]} >
            <group ref={$wireframeRef} >
                <Box  args={[0.8, 0.5, 0.25]} castShadow>
                    <meshStandardMaterial wireframe={true} color="black" />
                </Box>
                <RoundedBox args={[1.2, 0.2, 0.5]} castShadow position={[0, -0.33, 0]} >
                    {/* <meshStandardMaterial  color="silver" /> */}
                <meshMatcapMaterial matcap={matcapTexture}  color="#ffffff"  />

                </RoundedBox>
            </group>
            </group>
    </>);
}

