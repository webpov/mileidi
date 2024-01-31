import { createContext, useState, Dispatch, SetStateAction, useMemo, useEffect, useRef } from "react";

type AudioContextType = {
    playingTrack: any;
    s__playingTrack: Dispatch<SetStateAction<any>>;
    play: Dispatch<SetStateAction<any>>;
};

export const AudioContext = createContext<AudioContextType>({
    playingTrack: {},
    play: () => {},
    s__playingTrack: () => {},
});

export function AudioProvider({children}:any) {
    const [playingTrack, s__playingTrack] = useState("")
    // const [lastSrc, s__lastSrc] = useState("")
    
    const play = (src:string) => {
        if (!!playingTrack) {
            s__playingTrack("")
            return setTimeout(()=>{
                s__playingTrack(src)
            },150)
        }
        s__playingTrack(src)
    }

    return (
        <AudioContext.Provider
            value={{
                playingTrack, s__playingTrack,
                play
            }}
        >
            <AudioContainer src={playingTrack} onSrcChange={s__playingTrack} />
            {children}
        </AudioContext.Provider>

    )
}

const AudioContainer = ({ src, onSrcChange }:any) => {
    const audioRef = useRef<HTMLAudioElement>(null);
  const [lastSrc, s__lastSrc] = useState()

    useEffect(() => {
      if (!src) {
        // if (!!audioRef.current) {
        //     audioRef.current.src = ""
        //     audioRef.current.pause();
        // }
        return
      }
      const audioElement = audioRef.current;
      if (!audioElement) return;
  
      // Function to change audio source and play
      const changeAudioSource = (aud:any,newSrc: string) => {
        if(!newSrc) { return }
        aud.pause();
        aud.src = newSrc;
        aud.load(); // Important to call load() to update the audio element's source
        aud.play().catch((error:any) => console.error("Error playing audio:", error));
        // console.log("aud.duration", aud)
        // return aud.duration
      };
  
      let duration = changeAudioSource(audioElement, src);
    //   setTimeout(()=>{
        
    //     onSrcChange("")
    //   },250)
  
      // Callback for optional parent component handling
    //   if (onSrcChange) {
        
    //     onSrcChange(src)
    // };
      
      // Cleanup function to pause audio on component unmount or before changing source
      return () => {
        audioElement.src = ""
        audioElement.pause();
      };
    }, [src, onSrcChange]);
  
    return <audio ref={audioRef} src={src} />;
  };
  
  export default AudioContainer;
  