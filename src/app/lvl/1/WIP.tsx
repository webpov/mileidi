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
  <div className="flex Q_lg_x pt-8 flex-1 w-100 h-100 flex-col">
  <img  className='block' src='android-chrome-192x192.png' alt="logo" width={128} height={128} />
  </div>

  <div className="flex-col w-100">
        <div className=" flex-col Q_xs tx-altfont-1 tx-lg pt-2">Support the Game: <br /> <div>Get $MILEI</div></div>
<div className="Q_sm_x flex-col">
      <div className='hover-6 tx-altfont-1 tx-md pt-4 flex-wrap gap-1 '>
        <div className="tx-lx tx-altfont-5 "
          style={{color:"#2E8Cc0"}}
        >Support the Game</div>
        {/* <div>{"Buy"} $MIL</div> */}
      </div>
      <div className='flex-wrap gap-1 flex-col tx-altfont-1 tx-md '>
        <div className='Q_sm_x tx-lgx'>Get $MILEI</div>
        <div className='Q_sm_x tx-center'>Milei Di Chan game level authorization system</div>
        {/* <div className='Q_sm_x'>{"[ExtT22]"}</div> */}
      </div>
      </div>
      <div className='Q_md_x tx-altfont-1 tx-md tx-bold-8'>
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank" className="tx-black">
        
        {"miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn"}
                </a>
                </div>
      <div className='Q_xs_md py-2 tx-xsm tx-altfont-1 tx-bold-8'>
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank" className="tx-black">
        
        {"miL2tT . . . ph44tn"}
                </a>
                </div>
      <hr className="Q_sm_x" />
      <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank"
      className=' bord-r-25 border-white bg-glass-10 pb-2 pt-1 tx-altfont-5  tx-white tx-shadow-5'
      style={{textShadow:"0 4px #4EACF0, -1px -1px 3px #00000044", background: "linear-gradient(-45deg, #ddddddcc, #ffffff00, #ffffffcc)"}}
      > 
        <div className="Q_sm_x tx-xl px-8 opaci-chov--50 ">SUPPORT</div>
        <div className="Q_xs tx-lx px-2 opaci-chov--50">SUPPORT</div>
      </a>
      </div>
      </div>
  </>);
};