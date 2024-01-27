import { useRef } from 'react';
import { Box } from "@react-three/drei";
import { Mesh } from 'three';
import { COLOR_TO_COUNTRY, COUNTRIES_COLOR_POSITIONS, POSITION_COLOR_LOOKUP } from '@/dom/organ/stage/MainStage';
import { RenderBox } from './RenderBox';


interface ContinentSceneProps {
    state: any
    calls: {
        triggerSelectChange: (color: string) => void;
    }
}

export const ContinentScene = ({ state, calls }: ContinentSceneProps) => {
    const $wireframeRef = useRef<Mesh>(null);

    const handleBoxSelect = (position: [number, number, number]) => {
        if (!$wireframeRef.current) return;
        $wireframeRef.current.position.set(...position);
        console.log("position", position)
        const color = POSITION_COLOR_LOOKUP[position.join(',')];
        console.log("color", color)
        calls.triggerSelectChange(color);
    };

    return (<>
        {COUNTRIES_COLOR_POSITIONS.map((box, index) => (
            <RenderBox key={index} boxData={box} handleSelect={handleBoxSelect} 
                state={{countryScore:state.playerScore.stats.country[COLOR_TO_COUNTRY[box.color]]}}
             />
        ))}
        <group position={[0, 0.76, 0]} >
            <Box ref={$wireframeRef} args={[0.5, 0.5, 0.5]} castShadow>
                <meshStandardMaterial wireframe={true} color="black" />
            </Box>
        </group>
    </>);
}

