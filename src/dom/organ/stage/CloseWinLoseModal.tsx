"use client";
export const CloseWinLoseModal = ({ s__finals }: any) => {
  return (<>
    <button onClick={() => { s__finals([]); }} className='Q_xs box-shadow-5-b bord-r-100 mr- mt- tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
    <button onClick={() => { s__finals([]); }} className='Q_sm_x box-shadow-5-b bord-r-100 mr-8 mt-8 tx-white tx-shadow-5 opaci-chov--50 pos-abs top-0 right-0 tx-shadow-5 px-3 tx-altfont-4 bg-w-50 bg-glass-10  ml- tx-lx'>X</button>
  </>);
};
