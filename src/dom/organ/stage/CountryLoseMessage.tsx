"use client";





export const CountryLoseMessage = ({ finals }: any) => {
  return (<>
    <div className="tx-lx  tx-bold-6  tx-altfont-1  px-6 Q_sm_x">{JSON.stringify(finals[0].alertmsg.replace("\n\n", ""))}</div>
    <div className="tx-lg  tx-bold-6  tx-altfont-1 px-2 Q_xs">{JSON.stringify(finals[0].alertmsg.replace("\n\n", ""))}</div>
  </>);
};
