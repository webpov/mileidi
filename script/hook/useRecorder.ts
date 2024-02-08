// @ts-nocheck 
import * as THREE from 'three'
import * as React from 'react'
import { useRef, useCallback, useMemo, useEffect, useState } from 'react'
// import { SharedCanvasContext } from 'react-three-fiber'

// @ts-ignore
// import CCapture from '@/../script/hook/ccapture.js/src/CCapture.js'
// import { CCapture } from 'ccapture.js'
// import { CCapture } from 'ccapture.js'
// const CCapture = require('@/../script/hook/ccapture.js/src/CCapture.js');


type RecorderContext = [
  (context: any) => void, 
  () => void,
  {
    playhead: number
    duration: number
    isRecording: boolean
    stopRecording: () => void
    getProgress: () => number
    getPlayhead: () => number
  }
]

type RecorderProps = {
  format: 'webm' | 'gif' | 'jpeg'
  duration: number
  framerate: number
  fps: number
  verbose: boolean
  motionBlurFrames: number
  children: React.ReactNode
  showWidget: boolean
  filename: string
}

const state = {
  shouldRecord: false,
  prevPlayhead: 0,
  isRecording: false,
  playhead: 0,
  duration: 0,
}

const startRecording = () => {
  state.shouldRecord = true
  state.playhead = 0
}

const stopRecording = () => {
}

const getProgress = () => {
  return state.playhead / state.duration
}

const getPlayhead = () => {
  return state.playhead
}
const useScript = (url,isScriptLoaded,initConfig) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    script.onload = (data) => {

      setTimeout(()=>{
        isScriptLoaded(true)
      },1000)
    }

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};
// let CCapture:any;
export function useRecorder({
  format = 'webm',
  duration = 2,
  framerate = 24,
  fps = 24,
  verbose = false,
  motionBlurFrames = 0,
  showWidget = false,
  filename = 'MileiSol_Session',
}: RecorderProps): RecorderContext {

  const [isModuleLoaded, s__isModuleLoaded] = useState(false)
  useScript('@/../script/hook/ccapture.js/src/CCapture.js',s__isModuleLoaded,{
    format,
    framerate: fps || framerate,
    verbose,
    motionBlurFrames,
    display: showWidget,
  });

  const [isRecording, setRecording] = useState(false)

  const capturer = useMemo(() => {
    // return CCModule
    if (typeof CCapture == "undefined") { return null }
    // if (typeof window == "undefined") { return null }
    // if (typeof window.CCapture == "undefined") { return null }
    // @ts-ignore
    return new CCapture({
      format,
      framerate: fps || framerate,
      verbose,
      motionBlurFrames,
      display: showWidget,
    })
  }, [format, fps, framerate, motionBlurFrames, showWidget, verbose, isModuleLoaded])

  const [clock] = useState(new THREE.Clock())
  const gl = useRef<THREE.WebGLRenderer>()

  const bind = useCallback((context: any) => {
    context.clock.getElapsedTime = () => state.playhead % duration
    gl.current = context.gl
  }, [duration])

  const loop = useCallback(() => {
    if (!capturer) {
      console.warn('CCapture module not yet loaded.');
      return;
    }

    let currentPlayhead = clock.getElapsedTime() % duration

    if (state.isRecording && currentPlayhead < state.playhead) {
      state.shouldRecord = false
      state.isRecording = false
      setRecording(false)
      capturer.stop()
      capturer.save((blob: Blob) => {
        // @ts-ignore
        if (!window) { return }
        let _filename = prompt("Enter file name:", `${filename}${Date.now()}`)
        if (!_filename) { return }
        // @ts-ignore
        const fileURL = window?.URL.createObjectURL(blob)
        const tempLink = document.createElement('a')
        tempLink.href = fileURL
        tempLink.setAttribute('download', `${_filename}.${getExtension(format)}`)
        tempLink.click()
      })
    }

    if (!state.isRecording && state.shouldRecord && currentPlayhead < state.playhead) {
      state.isRecording = true
      capturer.start()
      setRecording(true)
    }

    if (state.isRecording) {
      if (gl.current) {
        capturer.capture(gl.current.domElement)
      } else {
        throw new Error("Missing gl")
      }
      
    }

    state.playhead = currentPlayhead

    requestAnimationFrame(loop)

  }, [capturer])

  useEffect(() => {
    requestAnimationFrame(loop)
  }, [loop])


  return [
    bind, 
    startRecording, 
    { stopRecording, getProgress, getPlayhead, ...state, isRecording }]
}

function getExtension(format: string): string {
  if (format === 'webm' || format === 'gif') return format

  return 'tar'
}