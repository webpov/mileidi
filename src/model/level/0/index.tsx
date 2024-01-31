import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Cylinder, MapControls, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'usehooks-ts';
import { RegionScene } from './RegionScene';
import { Fog } from "three";
import { MovingPlane } from '../../core/MovingPlane';
import { MileiCharacterGroup } from '@/dom/organ/stage/MileiCharacterGroup';
import { useRecorder } from '@/../script/hook/useRecorder';
import { useWeb3React } from '@web3-react/core';
import SolCard from '@/dom/organ/SolCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { phantomWallet } from '@rainbow-me/rainbowkit/wallets';
import { Web3ReactContainer } from '@/dom/Web3ReactContainer';
import { AudioContext } from "../../../../script/state/context/AudioContext";

const FirstLevel = ({state, calls}:any) => {

  // const { address } = useAccount()
  // const { connect, connectors, isLoading, pendingConnector } = useConnect()
const $solCard:any = useRef()
  const audioCtx = useContext(AudioContext)

  const [isMileiModal, s__isMileiModal] = useState(false)
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
    // @ts-ignore
  const [bind, startRecording, camRecorder2]:any = useRecorder({ verbose: true, duration: 2, fps: 20, });
  const [startedRecording, s__startedRecording] = useState(false)
  useEffect(()=>{
    if (!startedRecording) { return }
    if (!camRecorder2.isRecording) {
      setTimeout(()=>{
        window?.location.reload()
      },500)
    }
  }, [camRecorder2.isRecording])
  const onMileiClick = () => {
    // alert("asd")
    audioCtx.play("../sound/magic.wav")
    s__isMileiModal(!isMileiModal)
  }
  const solBal = useMemo(()=>{
    if (!$solCard.current) return null
    // console.log("$solCard.current.solBal", $solCard.current.solBal)
    $solCard.current.solBal
  },[$solCard?.current?.solBal])
  return (<>
          <Web3ReactContainer>
          {isMileiModal && (<div className='  pos-abs top-0 z-600 mt-100 ml-2   left-0'>
                <div className=' bg-glass-10  box-shadow-i-5-b tx-altfont-1 border-white bg-b-50 tx-white px-1 bord-r-100'>
                  <button onClick={()=>{s__isMileiModal(false)}} className='box-shadow-5-b bord-r-100 mr-8 mt-8 tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
                  <div className='tx-shadow-5 px-8 pt-8 ml- '>
                    <div className='Q_xs pt-4 tx-lgx'>
                      <div>Milei</div>
                      <div>DiChan</div>
                    </div>
                    <div className='Q_sm_x  tx-xl'>MileiDiChan</div>
                  </div>
                  <div className='tx-shadow-5 pb-4  ' style={{maxHeight:"60vh",width:"60vw"}}>
                  <div className='pos-abs bottom-0 w-100 '>
                        <div className='flex translate-y-50 w-100 flex-justify-center gap-2 '>
                          {!!$solCard.current && $solCard.current.solBal &&
                            <div className='opaci-chov--50 border-w-10 bg-b-50 bg-glass-10 border-white bord-r-100 tx-lx pa-1 '>☀️</div>
                          }
                          {/* <div className='opaci-chov--50 border-w-10 bg-b-50 bg-glass-10 border-white bord-r-100 tx-lx pa-1 '>d</div> */}
                          {/* <div className='opaci-chov--50 border-w-10 bg-b-50 bg-glass-10 border-white bord-r-100 tx-lx pa-1 '>f</div> */}
                        </div>
                      </div>
                    <div className='autoverflow-y pos-rel' style={{maxHeight:"50vh"}}>
                      
                      {/* <div><h2 className='mb-0 pb-0  pl-8'>Game Description</h2></div> */}
                      
                      <div className='flex-col Q_md_x  pl-8'>
                        <p className='tx-lgx pr-8 flex-wrap'>
                          <div className='Q_xs_lg'>Strategy and resource management browser game inspired by Javier Milei.</div>
                          <div className='Q_lg_x'>Strategy and resource management browser game inspired by the libertarian ideologies and economic principles of
                          Javier Milei. </div> 
                        </p>
                        <p className='tx-mdl px-8 mt-0 flex-col gap-2'>
                          <li>Set in a fictional world on the brink of economic collapse due
                          to excessive law intervention and fiscal irresponsibility </li>
                          <div className='Q_xl_x'> players take on the role
                          of a reformist leader, tasked with transforming the nation through free-market policies,
                          deregulation, and the defense of individual liberties</div>
                        </p>
                      </div>
                      <div className='flex-col Q_xs_md  pl-3'>
                        <p className='tx-mdl pr-2'>
                          Strategy & resource management game inspired by the libertarian ideologies and economic principles of
                          <h2 className='pa-0 ma-0'>Javier Milei.</h2>
                        </p>
                        
                      </div>
                      <div className='flex gap-5 px-8 Q_xl_x opaci-30 '>
                        <hr className='w-80' />
                        <div>o</div>
                        <hr className='w-80' />
                      </div>
                      {/* <div><h2>asdasd</h2></div> */}
                      <div className='flex-col '>
                        <div className='w-100'>
                          <h2 className='Q_sm_x px-4'>Important Links</h2>
                          <a className='tx-white px-8 pb-4 block' href="/">Go Home</a>
                        </div>
                        <div className='w-100 tx-end '>
                          <a className='tx-white px-8 pb-4 block' href="/">Go Home</a>
                        </div>
                      </div>
                      
                      <div className='Q_lg_x flex-col'>
                        <div className='px-8 mx-8 py-4 bord-r-25 bg-b-50'><p>
                         <div className='tx-lg'>We aim on achieving this through expanding our growing list of integrations across our open source web3 community</div>
                         <div className='tx-lg'>Free airdrop to the Solana dev community until April 1st</div>
                        </p></div>
                        <div className='flex flex-justify-around tx-altfont-1'>
                          <a href='/' className='tx-white'>
                            <h2 className='px-4 opaci-chov--50'>Faucet</h2>
                          </a>
                          <a href='/' className='tx-white'>
                            <h2 className='px-4 opaci-chov--50'>Airdrops</h2>
                          </a>
                          <a href='/' className='tx-white'>
                            <h2 className='px-4 opaci-chov--50'>Claim</h2>
                          </a>
                          <a href='/' className='tx-white'>
                            <h2 className='px-4 opaci-chov--50'>Staking</h2>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className='Q_sm_x pb-8'></div>
                    {/* <div className='h-300px Q_xs'></div> */}
                    {/* <div className='h-400px Q_sm_x'></div> */}
                  </div>
                </div>

            </div>)}
        <div className="pos-abs right-0 top-0 mt-2 z-200 mt-100 pt-8 pr-2">
            
        <SolCard ref={$solCard}  name='phantom' />
        {/* <hr className='w-100' /> */}
        {/* <ConnectButton />  */}
         {/* {connectors.map((connector) => (
  <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector, chainId: polygon.id })}>
    Connect to {connector.name}
    {isLoading && pendingConnector?.id === connector.id && ' (connecting)'}
  </button>
 ))}
 <p>Connected to: {address ? address : 'not connected yet'}</p> */}
        </div>
        </Web3ReactContainer>

    <div className="Q_xs pos-abs left-0 mt-8 pa-4 z-200">
        <div onClick={()=>{ if(!window.confirm("Stop Recording?")){return};startRecording(); s__startedRecording(true) }} className="tx-lx pt-1 opaci-chov--50"
          style={{textShadow: "2px 2px 2px #000000, 2px 8px 10px #003355"}}
        >
          {!camRecorder2?.isRecording ? '🎥' : '🔴'}
        </div>
    </div>
    <div className="Q_sm_x pos-abs right-0 mr-100 z-200">
        <div onClick={()=>{ if(!window.confirm("Start Recording?")){return};startRecording(); s__startedRecording(true) }} className="tx-lx pt-1 opaci-chov--50"
          style={{textShadow: "2px 2px 2px #000000, 2px 8px 10px #003355"}}
        >
          {!camRecorder2?.isRecording ? '🎥' : '🔴'}
        </div>
    </div>
    <Canvas camera={{fov:50,position:[0,isSmallDevice?16:7,isSmallDevice?15:4]}} shadows
      onCreated={(state)=>{
        state.gl.setClearColor("#448899");
        state.scene.fog = new Fog("#448899",isSmallDevice?20:6,isSmallDevice?40:22)
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
        <MileiCharacterGroup onClick={onMileiClick} motionRange={[1.5,1.2]} />
      </group>

      <RegionScene 
        state={{
          selectedPlayerScore: state.selectedPlayerScore,
          playerScore: state.playerScore,
          selectedZone: state.selectedZone
        }}
        calls={{triggerSelectChange: calls.triggerSelectChange}}
      />

    </Canvas>
  </>);
};

export default FirstLevel;
