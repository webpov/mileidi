"use client";

export const MainGameMenu = () => {
    return (
        <div className="pa-2 z-200">
            <details className="">
                <summary className="opaci-chov--50 tx-end flex flex-justify-end">
                    <button className="noclick noborder bg-w-50 border-white-50 bord-r-25  tx-lg px-2">
                        <div className="opaci-40">WebPOV</div>
                    </button>
                </summary>
                <div className="flex-col flex-align-end gap-1 pa-1">
                    <a href="https://webpov.vercel.app/">
                        <button className="opaci-chov--50 pa-2">WebPOV</button>
                    </a>
                    <a href="https://wpack.vercel.app/">
                        <button className="opaci-chov--50 pa-2">Pack</button>
                    </a>
                    <a href="https://wtrade.vercel.app/">
                        <button className="opaci-chov--50 pa-2">Trade</button>
                    </a>
                    <a href="https://wqub.vercel.app/">
                        <button className="opaci-chov--50 pa-2">Qub</button>
                    </a>
                </div>
            </details>
        </div>
    );
};
