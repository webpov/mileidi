import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { shortWeb3Address } from '../../../script/util/webhelp';
import { callUpdateSupabase } from './callUpdateSupabase';

interface Solana {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
}

declare global {
  interface Window {
    solana?: Solana;
  }
}
export const SolCard = forwardRef(({ name}:any, ref:any ) => {
  const { connector, hooks } = useWeb3React();
  const { useSelectedAccount, useSelectedIsActive, useSelectedIsActivating } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const [usdBal, s__usdBal] = useState()
  const [milBal, s__milBal] = useState()
  const [solBal, s__solBal] = useState()
   const [tokBal, s__tokBal] = useState<any>()
   const [tokBalance, s__tokBalance] = useState<any>()
   const [milBalance, s__milBalance] = useState<any>()
   const [solAddress, s__solAddress] = useState("")
  const [error, setError] = useState<Error | undefined>(undefined)
  const [connectionLabel, setConnectionLabel] = useState('Disconnected')
  const trySolAddress = async () => {
    if (window.solana) {
      let ggg = window.solana.connect();
      let gg22 = await ggg;
      let solAd = gg22.publicKey.toString();
      s__solAddress(solAd);
      setConnectionLabel("✅ " + shortAd(solAd));
  
      getSolBalance(window.solana, gg22.publicKey);
    } else {
      console.error('Solana object is not available on window');
    }
  };
  
  useImperativeHandle(ref, () => ({ solAddress, solBal }))
  
  async function getTokenBalanceWeb3(connection:any, tokenAccount:any) {

    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (!info.value.uiAmount) throw new Error('No balance found');
    // console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
    return info.value.uiAmount;
}
const MY_TOKEN_ADDRESS:any  = 'mdnhtNYShfmkToZRmnS4y33pyopnYcMhyF3V3Hyo8eg'
const MY_USD_ADDRESS:any  = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const MY_TOKEN_ACCOUNT:any  = '6zDLHeA1jXLUqMpVvrxScuXEvCEXG2hwbaGKS87fLgN9'
const MIL_TOKEN_ADDRESS:any  = ''

async function getTokenBalanceSpl(connection:any, connectedWallet:any) {
  const accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    mint: new PublicKey(MY_TOKEN_ADDRESS)
  });
  
  const walletSpecificAccoutn = accountsList.value[0].pubkey
  const accountBalance = await connection.getTokenAccountBalance(walletSpecificAccoutn)
  if (!accountBalance.value.uiAmount) throw new Error('No balance found');

  let actualVal = parseInt(accountBalance.value.uiAmount)
  const formatter = Intl.NumberFormat('en', {notation: 'compact'})
  let stringVal = formatter.format(actualVal)+"b"
  
  s__tokBal(stringVal)
  s__tokBalance(actualVal)

  const mil_accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    mint: new PublicKey(MIL_TOKEN_ADDRESS)
  });
  const mil_walletSpecificAccoutn = mil_accountsList.value[0].pubkey
  const mil_accountBalance = await connection.getTokenAccountBalance(mil_walletSpecificAccoutn)
  let mil_actualVal:any = parseInt(mil_accountBalance.value.uiAmount)
  let mil_stringVal:any = formatter.format(mil_actualVal)
  
  s__milBal(mil_stringVal)
  s__milBalance(actualVal)
  callUpdateSupabase(connectedWallet.toString(),actualVal)
}
const getSolBalance = async (provider:any, publicKey:any) => {
  var phantom = await provider;
  if (phantom !== false) {
    // const devConnection = new Connection("https://api.devnet.solana.com");
    const connection123 = new Connection("https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r");
    (async () => {
      let balance = await connection123.getBalance(publicKey);
      let solBale:any = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(4))

      let usdAccList:any = null
      try {
        usdAccList = await connection123.getTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(MY_USD_ADDRESS)
        });
      } catch (error) {
        
      }
      // console.log("usdAccList?.value?.length", usdAccList?.value.length)
      if (!!usdAccList?.value?.length) {
        const usdwalletSpecificAccoutn = usdAccList.value[0].pubkey
        const usdBalance:any = await connection123.getTokenAccountBalance(usdwalletSpecificAccoutn)
        console.log("usdBalance", usdBalance.value.uiAmount)
        const formatter = Intl.NumberFormat('en', {notation: 'compact'})
        const usdAmount:any = parseFloat(usdBalance.value.uiAmount).toFixed(2)
        const usdAmountUI:any = formatter.format(usdAmount)
        let solBal:any = (parseFloat(solBale)/10).toFixed(3) // (parseFloat(`${usdAmount}`)/100) * 
        // console.log( "parseFloat(`${usdAmount}`) , parseFloat(solBale)")
        // console.log( parseFloat(`${usdAmount}`) , parseFloat(solBale))
        let solBalpercent:any = `${formatter.format(parseFloat(solBal)*100)} %`
        s__solBal(solBalpercent)
        s__usdBal(usdAmountUI)
      }


      await getTokenBalanceSpl(connection123, publicKey)
    })();
  }
  }
  const handleToggleConnect = async () => {
    setError(undefined) 
    if (isActive) {
        if(connector?.deactivate) { void connector.deactivate()
        } else { void connector.resetState() }
    }
    else if (!isActivating) {
      setConnectionLabel('Connecting..')
        Promise.resolve(connector.activate(1))
        .catch((e) => {
          connector.resetState()
          setError(e)
        }) 
      }
  }
  useEffect(() => {
    if(isActive) {
      setConnectionLabel('🏦')
      trySolAddress()
    } else {
      setConnectionLabel('Wallet')
    }
  }
  ,[isActive])
  
  return (<>
  
    <details ref={ref} className='tx-altfont-1  bord-r-25 border-white bg-b-50 bg-glass-10 tx-white'>
      <summary className='tx-xsm opaci-chov--50 tx-center flex-wrap py-2 px-2'>
        {(error?.message) ? ("Error: " + error.message) : connectionLabel}
        {milBal &&
          <div className='translate-y--100  bg-glass-10 box-shadow-2-b bord-r-10 px-2 py-1 right-0 mb-2 pos-abs flex gap-1 flex-justify-between flex-aligin-center' title={milBal}
            style={{background: "linear-gradient(45deg, #ffffff88, #ffffff11"}}
          >
            <div>
              <img src='favicon-32x32.png' alt="logo" />
              {/* <span className='Q_md_x opaci-50'>$MIL: </span> */}
            </div>
            <div className='tx-lg tx-shadow-5'>{milBal ? milBal : 'N/A'}</div>
          </div>
        }
      </summary>
      <div className='px-2 pb-2'>
        <hr className=' opaci-10' />
        <div>☀️ <span className='opaci-50 Q_sm_x'>SOL: </span><span>{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</span></div>
        <div>💎 <span className='opaci-50 Q_sm_x'>EVM: </span><span>{account ? shortWeb3Address(account) : 'N/A'}</span></div>
        <hr className=' opaci-10' />
        <div className='Q_sm_x tx-center w-100 opaci-30 tx-bold-6'>Extra </div>
        <div className='flex gap-1 flex-justify-between flex-aligin-center' title={usdBal}>
          <div>
            💸
            <span className='Q_md_x opaci-50'>USDc: </span>
          </div>
          <div className='tx-lg'>{usdBal ? usdBal : 'N/A'}</div>
        </div>
        <div className='flex gap-1 flex-justify-between flex-aligin-center' title={tokBalance}>
          <div>
            🛜
            <span className='Q_md_x opaci-50'>Wifi: </span>
          </div>
          <div className='tx-lg'>{tokBal ? tokBal : 'N/A'}</div>
        </div>
        <div className='flex gap-1 flex-justify-between flex-aligin-center'>
          <div>
          📜
            <span className='Q_md_x opaci-50'>Power: </span>
          </div>
          <div className='tx-lg'>{solBal ? solBal : 'N/A'}</div>
        </div>
        <hr className=' opaci-10' />
        <button className='bord-r-10 opaci-chov--50 border-white py-1 w-100' onClick={handleToggleConnect} disabled={false}>
          {isActive ? "Disconnect" : "Connect"}
        </button>
      </div>
    </details>
  </>)
})
SolCard.displayName = "SolCard"
export default SolCard

export function shortAd(address:string)
{
  return address.substr(0,2)+"-"+address.substr(address.length-2,address.length)
}