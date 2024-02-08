import { PointerFollowInit } from "@/dom/organ/stage/StartScreen";

export const WIP = () => {
  return (<>
      <div className="Q_sm_x flex-col">
      <div className='flex-wrap gap-1'>
        <div>Section:</div>
        <div>Work In</div>
        <div>Progress</div>
      </div>
      <hr />
      </div>
      <SupportSection />
      <a href='https://webpov.vercel.app/faq/tos' className='tx-black  bord-r-50 tx-bold-4 bg-glass-10 py-2 noborder tx-altfont-1 opaci-chov--50 '>
        <div className="Q_xs px-2 tx-xsm">Terms & Conditions</div>
        <div className="px-8  Q_sm_x tx-mdl">Terms & Conditions</div>
      </a>
  </>);
};
export const SupportSection = () => {
  return (<>
  <div className="flex  w-100">
  <div className="flex  Q_md_x pt-8  flex-col  w-100 h-100 flex-col ">
    <div className="bord-r-25 bg-w-50 box-shadow-2-b pa-2">
    

    <div className="bord-r-100p box-shadow-2-b" style={{padding: "3px", background:"linear-gradient(45deg, grey, lightgrey)"}}>
    <div>
      <div className="bord-r-100p noverflow Q_xl_x"><img  className='block' src='825bc567-d24f-4b55-95fa-a5abae3493a0.jpeg' alt="logo" width={260} height={260} /></div>
      <div className="bord-r-100p noverflow Q_md_lg"><img  className='block' src='825bc567-d24f-4b55-95fa-a5abae3493a0.jpeg' alt="logo" width={128} height={128} /></div>
    </div>
    </div>
    </div>
  </div>

  <div className="flex-col w-100">
        <div className=" flex-col Q_xs tx-altfont-1 tx-lg pt-2">Support the Game: <br /> <div className="flex">Get <div className="tx-altfont-4">MILEI</div></div></div>
<div className="Q_sm_x flex-col">
      <div className='hover-6 tx-altfont-1 tx-md pt-4 flex-wrap gap-1 '>
        <div className="tx-lx tx-altfont-5  tx-shadow-2"
          style={{color:"#2EaCf0"}}
        >Support the Game</div>
        {/* <div>{"Buy"} $MIL</div> */}
      </div>
      <div className='flex-wrap gap-1 flex-col tx-altfont-1 tx-md '>
        <div className='Q_sm_x tx-lgx pt-2 flex gap-2'>Get <div className="tx-milei tx-altfont-4">MILEI</div></div>
        <div className='Q_sm_x tx-center'>Milei Solana game <br /> level authorization system</div>
        {/* <div className='Q_sm_x'>{"[ExtT22]"}</div> */}
      </div>
      </div>
      <div className='Q_md_x tx-altfont-1 tx-mdl   z-200 tx-bold-8'>
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank" className="tx-white tx-shadow-5">
        
        {"miL2tTuTf . . . sSnph44tn"}
                </a>
                </div>
      <div className='Q_xs_md py-2 tx-xsm tx-altfont-1 tx-bold-8'>
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank" className="tx-black">
        
        {"miL2tT . . . ph44tn"}
                </a>
                </div>
      <hr className="Q_sm_x" />
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank"
      className=' bord-r-25 border-white box-shadow-2-b bg-glass-10 pb-2 pt-1 tx-altfont-5  tx-white tx-shadow-5'
      style={{textShadow:"0 4px #4EACF0, -1px -1px 3px #00000044", background: "linear-gradient(-45deg, #ddddddcc, #ffffff00, #ffffffcc)"}}
      > 
        <div className="Q_sm_x tx-xl px-8 opaci-chov--50 ">SUPPORT</div>
        <div className="Q_xs tx-lx px-2 opaci-chov--50">SUPPORT</div>
      </a>
      </div>
      </div>
  </>);
};