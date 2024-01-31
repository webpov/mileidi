"use client";
import MainStage from '@/dom/organ/stage/MainStage';
import { useState } from 'react';

export function Home() {

  const [currentSpeech, s__currentSpeech] = useState<any>();
  const [currentSpeechBg, s__currentSpeechBg] = useState<any>();
  // Function to adjust speech volume
  const adjustSpeechVolume = (volume: number) => {
    if (currentSpeech) {
      currentSpeech.volume = volume;
    }
  };

  // Function to adjust background audio volume
  const adjustBgVolume = (volume: number) => {
    if (currentSpeechBg) {
      currentSpeechBg.volume = volume;
    }
  };
  const audioBgNotification = (src = "") => {
    if (!!currentSpeechBg) {
      currentSpeechBg.pause();
      s__currentSpeechBg(null);
      return;
    }
    const audioBg = new Audio(src);
    audioBg.volume = 0.33;
    audioBg.play();
    s__currentSpeechBg(audioBg);
  };
  const audioNotification = (src = "") => {
    if (!!currentSpeech) {
      currentSpeech.pause();
      s__currentSpeech(null);
      return;
    }
    const audio = new Audio(src);
    audio.volume = 0.8
    audio.play();
    s__currentSpeech(audio);
  };

  return (
    <main className={"h-100 bord-r-25 noverflow mt-2 "}
    >
      <div className='pos-abs bord-r-25 w-100 h-100 '
        style={{ background: "linear-gradient(-25deg, #ffff66 0%, #ff9933 15%, #88ddff 50%, #0066aa)" }}
      ></div>
      <div className='pos-abs bord-r-25 invertbgchange mainbgchange w-100 h-100 '></div>
      <div className='pos-abs z-200'>
        <div id='logo' className='pa-2 '>
          <a href="/" className='nodeco  noselect tx-black flex tx-lx  tx-shadow-5 tx-bold-6'
            style={{ color: "#2E8CF0" }}
          >
            <div className='tx-altfont-1' style={{ color: "#4EaCF0" }}>MIL</div>
            {/* <div className='tx-white'>-</div> */}
            <div className='flex tx-altfont-1 tx-white'>
              <div>E</div>
              <div className='pos-rel flex-col'>
                <div className="pos-abs pa-1  mb-5 box-shadow-5-b border-white bord-r-100p" style={{ background: "gold" }}></div>
                i
              </div>
              <div>D</div>
            </div>
            <div className='tx-altfont-1' style={{ color: "#4EaCF0" }}>I</div>
            <div className='tx-sm pt-2 tx-altfont-1' style={{ color: "#4EaCF0" }}>chan</div>
          </a>
        </div>
      </div>

      <div>
        {// @ts-ignore
          <MainStage mainAction={()=>{
            if (!currentSpeech && !currentSpeechBg) {
              audioNotification("../sound/speech1min.mp3");
              audioBgNotification("../sound/bg.mp3");
            }
          }} />}
      </div>

      <div className="pos-abs   mt-6 tx-shadow-5 bord-r-100 bg-w-50 border-white hover-jump z-200  audioIcon"

        onClick={() => {
        }}>

        <details className='pos-rel z-200'>
          <summary className='flex opaci-chov--50 tx-xl  '
            onClick={() => {
              if (!currentSpeech && !currentSpeechBg) {
                audioNotification("../sound/speech1min.mp3");
                audioBgNotification("../sound/bg.mp3");
              }
            }}
          ><div>🔊</div></summary>
          <div className='pos-abs right-0 mt-2'>
            <div className='flex-col gap-2 flex-align-end bg-w-10 bord-r-25 border-white-50 bg-glass-10 pa-1 py-2'>

              <button className='nowrap noselect opaci-chov--50 py-2  px-3 bg-b-50 bord-r-10 tx-white border-white ' onClick={() => {
                audioNotification("../sound/speech1min.mp3");
              }}>
                Speech
                {!!currentSpeech ? "🔊" : "🔇"}
              </button>
              <input type="range" min="0" max="1" step="0.01" defaultValue={0.8} onChange={(e) => adjustSpeechVolume(parseFloat(e.target.value))} />

              <button className='nowrap noselect opaci-chov--50 py-2  px-3 bg-b-50 bord-r-10 tx-white border-white ' onClick={() => {
                audioBgNotification("../sound/bg.mp3");
              }}>
                Background
                {!!currentSpeechBg ? "🔊" : "🔇"}
              </button>
              <input type="range" min="0" max="1" step="0.01" defaultValue={0.3} onChange={(e) => adjustBgVolume(parseFloat(e.target.value))} />

            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
