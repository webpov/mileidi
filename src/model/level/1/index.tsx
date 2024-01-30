import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, MapControls, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'usehooks-ts';
import { RegionScene } from './RegionScene';
import { Fog } from "three";
import { MovingPlane } from '../../core/MovingPlane';

const FirstLevel = ({state, calls}:any) => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    
  
  return (
    <>
    <Canvas camera={{fov:50,position:[0,7,isSmallDevice?13:4]}} shadows
      // onCreated={(state)=>{
      //   state.gl.setClearColor("#ccf0Ff"); state.scene.fog = new Fog("#ccf0Ff",6,12)
      // }}
    >
        <MapControls
        autoRotate={true}
        autoRotateSpeed={0.1}
          maxPolarAngle={Math.PI/3.3}
        rotateSpeed={0.15}
          panSpeed={0.35}
          zoomSpeed={2.5}
          maxDistance={13}
        />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 4, -5]} angle={0.5} penumbra={1} castShadow
        color={"#FBd5b2"}
      />
      {/* <pointLight position={[0, 2, 0]} castShadow  /> */}
      <MovingPlane />

      <RegionScene 
        state={{
          playerScore: state.playerScore,
        }}
        calls={{triggerSelectChange: calls.triggerSelectChange}}
      />

    </Canvas>
    </>
  );
};

export default FirstLevel;
