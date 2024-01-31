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
<div className="Q_sm_x flex-col">
      <div className='tx-altfont-1 tx-md flex-wrap gap-1 '>
        <div>Support the Game</div>
        <div>{"->"} $MIL</div>
      </div>
      <div className='flex-wrap gap-1 tx-altfont-1 tx-md '>
        <div className='Q_sm_x'>$MIL = Money, Inter & Law</div>
        <div className='Q_sm_x'>(Milei Tribute Solana Token)</div>
        <div className='Q_sm_x'>{"[ExtT22]"}</div>
      </div>
      <div className='tx-altfont-1 tx-md'>{"<address>"}</div>
      </div>
      <hr className="Q_sm_x" />
      <button className=' bord-r-50 border-white bg-w-50 bg-glass-10 py-2 tx-altfont-5 opaci-chov--50 tx-white tx-shadow-5'>
        <div className="Q_sm_x tx-xl px-8 ">SUPPORT</div>
        <div className="Q_xs tx-lx px-2">SUPPORT</div>
      </button>
      
  </>);
};