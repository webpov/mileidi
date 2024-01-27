
import { useThree } from "@react-three/fiber";

import { Box } from "@react-three/drei";
import { BoxData, COUNTRY_SHAPES, REGION_LOCAL_POSITIONS } from "@/dom/organ/stage/MainStage";
import { CountriesScore } from "./CountriesScore";
import { ExtrudedShape } from "./ExtrudedShape";

export interface RenderBoxProps {
    state: any
    boxData: BoxData;
    handleSelect: any
}

export const RenderBox = ({ state, boxData, handleSelect }: RenderBoxProps) => {
    const { position, color } = boxData;
    const handleBoxSelect = (e: any) => {
        e.stopPropagation();
        handleSelect(position);
    };
    
    return (
        <group position={position} onClick={handleBoxSelect}>
            <CountryShape state={{color}} />
            
            <group position={[0,0.45,0]}>
                <group position={REGION_LOCAL_POSITIONS[color]}>
                    <CountriesScore state={{points: state.countryScore}} />
                </group>
            </group>
        </group>
    );
};


export const CountryShape = ({ state }: any) => {
    return (<>
        {state.color === 'orange' &&
            <group>
               
                <group rotation={[-Math.PI/2,0,0]} position={[-0.3,0,0.5]}>
                    <ExtrudedShape length={.5}
                        pointsArray={COUNTRY_SHAPES[state.color]} color={state.color} 
                    />
                </group>
            </group>
        }
        {state.color === 'white' &&
            <group>
            <group rotation={[-Math.PI/2,0,0]} position={[0,0,0]} >
                <ExtrudedShape length={.5}
                    pointsArray={COUNTRY_SHAPES[state.color]} color={state.color} 
                />
            </group>
            </group>
        }
        {state.color === 'gold' &&
            <group>
                <group rotation={[-Math.PI/2,0,0]} position={[-0.1,0,0.12]}>
                    <ExtrudedShape length={.5}
                        pointsArray={COUNTRY_SHAPES[state.color]} color={state.color} 
                    />
                </group>
            </group>
        }
        {state.color === 'cyan' &&
            <group >
                <group rotation={[-Math.PI/2,0,0]} position={[-0.15,0,.7]}>
                    <ExtrudedShape length={.5}
                        pointsArray={COUNTRY_SHAPES[state.color]} color={state.color} 
                    />
                </group>
            </group>
        }
        
    </>);
}


