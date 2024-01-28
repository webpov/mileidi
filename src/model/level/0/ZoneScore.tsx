import { Box } from "@react-three/drei";


export const ZoneScore = ({ state }: any) => {
    return (<>
        {!!state?.points?.money && <>
            <Box castShadow receiveShadow
                position={[-0.35, state.points.money / 20, 0]} 
                args={[0.2, state.points.money / 10, 0.2]}
            >
                <meshStandardMaterial color={"green"} />
            </Box>
        </>}
        {!!state?.points?.internet && <>
            <Box castShadow receiveShadow
                position={[0, state.points.internet / 20, 0]} 
                args={[0.2, state.points.internet / 10, 0.2]}
            >
                <meshStandardMaterial color={"blue"} />
            </Box>
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
