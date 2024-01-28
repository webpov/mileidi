import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, MapControls, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'usehooks-ts';
import { RegionScene } from './RegionScene';
import { Fog } from "three";
import { MovingPlane } from '../../core/MovingPlane';
import { MileiCharacterGroup } from '@/dom/organ/stage/MileiCharacterGroup';
import { useRecorder } from '@/../script/hook/useRecorder';

const FirstLevel = ({state, calls}:any) => {
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    // @ts-ignore
  const [bind, startRecording, camRecorder2]:any = useRecorder({ verbose: true, duration: 2, fps: 20, });
  const [startedRecording, s__startedRecording] = useState(false)
  useEffect(()=>{
    if (!startedRecording) { return }
    if (!camRecorder2.isRecording) {
      setTimeout(()=>{
        window.location.reload()
      },500)
    }
  }, [camRecorder2.isRecording])
  return (<>
    <div className="pos-abs right-0 mr-100 z-200">
        <div onClick={()=>{ console.log("startRecording");startRecording(); s__startedRecording(true) }} className="tx-lx pt-1 opaci-chov--50"
          style={{textShadow: "2px 2px 0 #000000, 2px 8px 10px #003355"}}
        >
          {!camRecorder2?.isRecording ? '🎥' : '🔴'}
        </div>
    </div>
    <Canvas camera={{fov:50,position:[0,7,isSmallDevice?15:4]}} shadows
      onCreated={(state)=>{
        state.gl.setClearColor("#448899"); state.scene.fog = new Fog("#448899",6,22)
        bind(state)
      }}
      gl={{
        preserveDrawingBuffer: true,
      }}

    >
        <MapControls
        autoRotate={true}
        autoRotateSpeed={0.1}
          maxPolarAngle={Math.PI/3.3}
        rotateSpeed={0.35}
          panSpeed={0.75}
          zoomSpeed={2.5}
          maxDistance={18}
        />
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 4, -5]} angle={0.65} penumbra={1} castShadow
        color={"#FBd5b2"} intensity={2}
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
  </>);
};

export default FirstLevel;
