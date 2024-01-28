import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, MapControls, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'usehooks-ts';
import { RegionScene } from './RegionScene';
import { Fog } from "three";
import { MovingPlane } from '../../core/MovingPlane';
import { MileiCharacterGroup } from '@/dom/organ/stage/MileiCharacterGroup';

const FirstLevel = ({state, calls}:any) => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    
  
  return (
    <Canvas camera={{fov:50,position:[0,7,isSmallDevice?15:4]}} shadows
      // onCreated={(state)=>{
      //   state.gl.setClearColor("#ccf0Ff"); state.scene.fog = new Fog("#ccf0Ff",6,12)
      // }}
    >
        <MapControls
        autoRotate={true}
        autoRotateSpeed={0.1}
          maxPolarAngle={Math.PI/3.3}
        rotateSpeed={0.35}
          panSpeed={0.75}
          zoomSpeed={2.5}
          maxDistance={15}
        />
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 4, -5]} angle={0.65} penumbra={1} castShadow
        color={"#FBd5b2"}
      />
      {/* <pointLight position={[0, 2, 0]} castShadow  /> */}
      <group position={[0,-0.1,0]}>
        <MovingPlane />
      </group>
      <group position={[-2.5,1.3,-2]} rotation={[0,Math.PI,0]} scale={[0.5,0.5,0.5]}>
        <Cylinder position={[0,-2.6,0]} castShadow receiveShadow args={[1,1.5, 1.3]}>
          <meshStandardMaterial color="#bbbbee" />
        </Cylinder>
        <pointLight position={[0, 2, -1]} castShadow  distance={2} intensity={0.7} />
        <MileiCharacterGroup />
      </group>

      <RegionScene 
        state={{
          playerScore: state.playerScore,
        }}
        calls={{triggerSelectChange: calls.triggerSelectChange}}
      />

    </Canvas>
  );
};

export default FirstLevel;
