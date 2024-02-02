"use client";
export const SpentBadges = ({ maxScores, unixCountFinal, unixCount }: any) => {
  return (<>
    <div className="flex gap-1 flex-wrap flex-justify-start px-8 Q_xs_px-2">
      <div className="tx-altfont-1 tx-bold-8 opaci-40">Spent:</div>
      <div className="flex gap-1">
        <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>💰</div> {maxScores.maxScore1}</div>
        <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>🌐</div> {maxScores.maxScore2}</div>
        <div className="bord-r-10 bg-b-50  tx-white pa-1 flex-center"><div>⚖️</div> {maxScores.maxScore3}</div>
      </div>
      <div className="border-white px-2 py-1 bord-r-10 bg-b-10 tx-altfont-1 tx-bold-8">
        {parseInt(`${(unixCountFinal - unixCount) / 1000}`)}s
      </div>
    </div>
  </>);
};
