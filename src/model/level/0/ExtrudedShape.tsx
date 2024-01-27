import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";


export function ExtrudedShape({
    pointsArray = [[0, 0], // Bottom-left corner
    [0.1, 0], // Bottom-right corner
    [0.1, 0.2], // Top-right corner
    [0, 0.2]], color = "#afaaaa", position = [0, 0, 0], points = null, length = 0.1,
} = {}) {
    const shapePoints = useMemo(() => {
        let mult = 2;
        return points ? points : pointsArray.map(([x, y]) => [x * mult, y * mult]);
    }, [points, pointsArray]);

    const shape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(shapePoints[0][0], shapePoints[0][1]);
        for (let i = 1; i < shapePoints.length; i++) {
            shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
        }
        return shape;
    }, [shapePoints]);

    const extrudeSettings = useMemo(() => ({
        curveSegments: 1,
        steps: 1,
        depth: length,
        bevelEnabled: false
    }), [length]);

    const meshRef = useRef<any>();

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.set(...position);
        }
    }, [position]);

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <extrudeBufferGeometry attach="geometry" args={[shape, extrudeSettings]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
    );
}
