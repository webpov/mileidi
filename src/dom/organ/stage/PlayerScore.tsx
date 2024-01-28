"use client";

import { DEFAULT_ICON_LOOKUP } from "./MainStage";

export const PlayerScore = ({ color, score, zone }: any) => (
    <div className="bg-glass-10 bord-r-25 bg-w-50 px-2 py-1 box-shadow-i-2-b"
        style={{border: `1px solid ${color}`}}
    >
        <div className="tx-lx tx-roman flex-center gap-1">
            <div className="pa-1 bord-r-100p" style={{background: color}}></div>
            {zone.toUpperCase()}
            <div className="pa-1 bord-r-100p" style={{background: color}}></div>
        </div>
        <div className="flex flex-justify-around gap-2">
            {Object.entries(score).map(([key, value]: any) => (
                <div key={key} className="pa-1 flex-col">
                    <div className="flex-center tx-altfont-1">
                        {Object.keys(DEFAULT_ICON_LOOKUP).find(icon => DEFAULT_ICON_LOOKUP[icon] === key) || key}
                        <div className="tx-lgx pr-1 tx-bold-5">{value}</div>
                    </div>
                    <div className="tx-altfont-1 opaci-50">
                        <div className="tx-xsm " style={{}}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
