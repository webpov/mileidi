"use client";

import { DEFAULT_ICON_LOOKUP } from "./MainStage";

export const PlayerScore = ({ color, score, zone, available, maxScores }: any) => (
    <div className="bg-glass-10 bord-r-25 bg-w-50 px-2 py-1 box-shadow-i-2-b"
        style={{border: `1px solid ${color}`}}
    >
        <div className="tx-roman flex-center gap-1">
            <div className="pa-1 bord-r-100p" style={{background: color}}></div>
            <div className="tx-lx Q_sm_x">{zone.toUpperCase()}</div>
            <div className="tx-lgx Q_xs">{zone.toUpperCase()}</div>
            <div className="pa-1 bord-r-100p" style={{background: color}}></div>
        </div>
        <div className="flex flex-justify-around gap-2">
            {Object.entries(score).map(([key, value]: any,index) => (
                <div key={key} className="pa-1 flex-col">
                    <div className="flex-center tx-altfont-1">
                    
                        <div className="tx-shadow-2 tx-mdl">
                            {Object.keys(DEFAULT_ICON_LOOKUP).find(icon => DEFAULT_ICON_LOOKUP[icon] === key) || key}
                        </div>
                        <div className="tx-lgx pr-1 tx-bold-5">
                            {value}
                        </div>
                    </div>
                    <div className="tx-altfont-1 opaci-50 flex-center Q_xs_flex-col gap-1">
                        <div className="tx-xsm " style={{}}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                        <div className="flex Q_sm_x">{available[key]} | <div> {maxScores["maxScore"+(index+1)]}</div></div>
                        {/* <div></div> */}
                    </div>
                    <div className="Q_xs  tx-sm flex">
                        {/* <div className="tx-altfont-1 opaci-50">left:</div> */}
                        <div className="flex ">( {(available[key])} | <div> {maxScores["maxScore"+(index+1)]}</div> )</div>
                    </div>
                    
                </div>
            ))}
        </div>
    </div>
);
