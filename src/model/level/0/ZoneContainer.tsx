
import { useThree } from "@react-three/fiber";

import { Box } from "@react-three/drei";
import { ZoneScore } from "./ZoneScore";
import { ExtrudedShape } from "../../core/ExtrudedShape";
import { REGION_LOCAL_POSITIONS, ZONE_SHAPES } from "../../../../script/constant";
import { BoxData } from "../../../../script/constant/zones";

export interface ZoneContainerProps {
    state: any
    boxData: BoxData;
    handleSelect: any
}

export const ZoneContainer = ({ state, boxData, handleSelect }: ZoneContainerProps) => {
    const { position, color, zone } = boxData;
    const handleBoxSelect = (e: any) => {
        e.stopPropagation();
        handleSelect(zone);
    };
    
    return (
        <group position={position} onClick={handleBoxSelect}>
            <ZoneShape state={{color, zone}} />
            
            <group position={[0,0.45,0]}>
                <group position={REGION_LOCAL_POSITIONS[color]} scale={[0.67,0.67,0.67]}>
                    <ZoneScore state={{points: state.zoneScore}} />
                </group>
            </group>
        </group>
    );
};


export const ZoneShape = ({ state }: any) => {
    return (<>
            <group position={[0,-0.1,0]}>
        {state.zone === 'africa' &&
            <group>
               
                <group rotation={[-Math.PI/2,0,0]} position={[-0.3,0,0.5]}>
                    <ExtrudedShape length={.5}
                        pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                    />
                </group>
            </group>
        }
        {state.zone === 'america' &&
            <group >
                <group rotation={[-Math.PI/2,0,0]} position={[-0.15,0,.7]}>
                    <ExtrudedShape length={.5}
                        pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                    />
                </group>
            </group>
        }
        {state.zone === 'antartic' &&
            <group>
            <group rotation={[-Math.PI/2,0,0]} position={[0,0,0]} >
                <ExtrudedShape length={.5}
                    pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                />
            </group>
            </group>
        }
        {state.zone === 'n.america' &&
            <group>
            <group rotation={[-Math.PI/2,0,0]} position={[0,0,0]} >
                <ExtrudedShape length={.5}
                    pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                />
            </group>
            </group>
        }
        {state.zone === 'asia' &&
            <group>
            <group rotation={[-Math.PI/2,0,0]} position={[0,0,0]} >
                <ExtrudedShape length={.5}
                    pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                />
            </group>
            </group>
        }
        {state.zone === 'europe' &&
            <group>
            <group rotation={[-Math.PI/2,0,0]} position={[0,0,0]} >
                <ExtrudedShape length={.5}
                    pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                />
            </group>
            </group>
        }
        {state.zone === 'oceania' &&
            <group>
                <group rotation={[-Math.PI/2,0,0]} position={[-0.1,0,0.12]}>
                    <ExtrudedShape length={.5}
                        pointsArray={ZONE_SHAPES[state.zone]} color={state.color} 
                    />
                </group>
            </group>
        }
            </group>
        
    </>);
}


