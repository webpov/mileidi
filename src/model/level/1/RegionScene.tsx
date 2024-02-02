import { useRef } from 'react';
import { Box } from "@react-three/drei";
import { Mesh } from 'three';
import { ZoneContainer } from './ZoneContainer';
import { POSITION_COLOR_LOOKUP, ZONES_COLOR_POSITIONS } from '../../../../script/constant';


interface RegionSceneProps {
    state: any
    calls: {
        triggerSelectChange: (color: string) => void;
    }
}

export const RegionScene = ({ state, calls }: RegionSceneProps) => {
    const $wireframeRef = useRef<Mesh>(null);

    const handleBoxSelect = (position: [number, number, number]) => {
        if (!$wireframeRef.current) return;
        $wireframeRef.current.position.set(...position);
        // console.log("position", position)
        const color = POSITION_COLOR_LOOKUP[position.join(',')];
        // console.log("color", color)
        calls.triggerSelectChange(color);
    };

    return (<>
        {ZONES_COLOR_POSITIONS.map((box, index) => (
            <ZoneContainer key={index} boxData={box} handleSelect={handleBoxSelect} 
                state={{zoneScore:state.playerScore.stats.zone[box.zone]}}
             />
        ))}
        <group position={[0, 0.76, 0]} >
            <Box ref={$wireframeRef} args={[0.5, 0.5, 0.5]} castShadow>
                <meshStandardMaterial wireframe={true} color="black" />
            </Box>
        </group>
    </>);
}

