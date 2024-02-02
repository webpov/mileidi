"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export const TradingViewNews = () => {
  const myRef:any = useRef();
  const [widgetCount, s__widgetCount] = useState(0)
  useEffect(()=>{
    if (!myRef.current) return
    if (!!widgetCount) return
    s__widgetCount(1)
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
    script.async = false;
    script.innerHTML = JSON.stringify({
      "feedMode": "symbol",
      "symbol": "BITSTAMP:BTCUSD",
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "regular",
      "width": "100%",
      "height": 830,
      "locale": "en"
    })
    myRef.current.innerHTML = ''
    myRef.current.appendChild(script);
  },[])

  return (<>
    <h1 className="ma-0 px-6 Q_xs_px-2 pa-0 tx-bold-2">Tradingview&apos;s Cryptocurrency Market Widget</h1>
    <h3 className="ma-0 px-6 Q_xs_px-2 pa-0 tx-link">
        <Link href="https://www.tradingview.com/widget/timeline/" target="_blank">
          Tradingview.com/widget/timeline
        </Link>
      </h3>
    <div className="mt-">
      
      <div className="tradingview-widget-container mt-8  w-100" ref={myRef}>
          {/* <div className="tradingview-widget-container__widget"></div>     */}
      </div>
    </div>
  </>);
}
export default TradingViewNews