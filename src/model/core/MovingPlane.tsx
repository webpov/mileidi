import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';


export const MovingPlane = () => {
  const $planeRef: any = useRef();

  useFrame(() => {
    if ($planeRef.current) {
      // Increment the rotation on the y-axis
      $planeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <group
        ref={$planeRef}
      >

        <Plane
          args={[100, 100]}
          receiveShadow
          rotation={[-Math.PI / 1.95, 0, 0]}
          position={[0, 0.25, 0]}
        >
          <meshStandardMaterial color="#a0e0Ff" />
        </Plane>
      </group>
    </>
  );
};
