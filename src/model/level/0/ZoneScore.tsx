import { Box, Sphere } from "@react-three/drei";


export const ZoneScore = ({ state }: any) => {
    return (<>
        {!!state?.points?.money && <>
            <Box castShadow receiveShadow
                position={[-0.35, state.points.money / 20, 0]} 
                args={[0.1, state.points.money / 10, 0.2]}
            >
                <meshStandardMaterial color={"green"} />
            </Box>
            
            <Box castShadow receiveShadow
                position={[-0.22, state.points.money / 20, 0]} 
                args={[0.1, state.points.money / 10, 0.2]}
            >
                <meshStandardMaterial color={"green"} />
            </Box>
            <Box castShadow receiveShadow
                position={[-0.08, state.points.money / 20, 0]} 
                args={[0.1, state.points.money / 10, 0.2]}
            >
                <meshStandardMaterial color={"green"} />
            </Box>
        </>}
        {!!state?.points?.internet && <>
            <Sphere castShadow receiveShadow 
                position={[0.15, state.points.internet / 40, 0]} 
                args={[state.points.internet / 20, 4, 4]}
            >
                <meshStandardMaterial wireframe={true} color={"blue"} />
            </Sphere>
        </>}
        {!!state?.points?.law && <>
            <Box castShadow receiveShadow
                position={[0.35, state.points.law / 20, 0]} 
                args={[0.2, state.points.law / 10, 0.2]}
            >
                <meshStandardMaterial color={"red"} />
            </Box>
        </>}
    </>);
};
