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
   const [solBal, s__solBal] = useState()
   const [tokBal, s__tokBal] = useState<any>()
   const [tokBalance, s__tokBalance] = useState<any>()
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
const MY_TOKEN_ACCOUNT:any  = '6zDLHeA1jXLUqMpVvrxScuXEvCEXG2hwbaGKS87fLgN9'
async function getTokenBalanceSpl(connection:any, connectedWallet:any) {
  const accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    mint: new PublicKey(MY_TOKEN_ADDRESS)
  });
  const walletSpecificAccoutn = accountsList.value[0].pubkey
  const accountBalance = await connection.getTokenAccountBalance(walletSpecificAccoutn)
  if (!accountBalance.value.uiAmount) throw new Error('No balance found');

  let actualVal = parseInt(accountBalance.value.uiAmount)
  const formatter = Intl.NumberFormat('en', {notation: 'compact'})
  let stringVal = formatter.format(actualVal)
  
  s__tokBal(stringVal)
  s__tokBalance(actualVal)
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
      s__solBal(solBale)
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
  
  return (
    <details ref={ref} className='tx-altfont-1  bord-r-25 border-white bg-b-50 bg-glass-10 tx-white'>
      <summary className='tx-xsm opaci-chov--50 tx-center flex-wrap py-2 px-2'>{(error?.message) ? ("Error: " + error.message) : connectionLabel}</summary>
      <div className='px-2 pb-2'>
        <hr className=' opaci-10' />
        <div>☀️ <span className='opaci-50 Q_sm_x'>SOL: </span><span>{solAddress ? shortWeb3Address(solAddress) : 'N/A'}</span></div>
        <div>💎 <span className='opaci-50 Q_sm_x'>EVM: </span><span>{account ? shortWeb3Address(account) : 'N/A'}</span></div>
        <hr className=' opaci-10' />
        <div className='flex flex-justify-between flex-aligin-center'>
          <div>
            🏦
            <span className='Q_sm_x'>QTY: </span>
          </div>
          <div className='tx-lg'>{solBal ? solBal : 'N/A'}</div>
        </div>
        <div className='flex flex-justify-between flex-aligin-center' title={tokBalance}>
          <div>
            💸
            <span className='Q_sm_x'>BAL: </span>
          </div>
          <div className='tx-lg'>{tokBal ? tokBal : 'N/A'}</div>
        </div>
        <hr className=' opaci-10' />
        <button className='bord-r-10 opaci-chov--50 border-white py-1 w-100' onClick={handleToggleConnect} disabled={false}>
          {isActive ? "Disconnect" : "Connect"}
        </button>
      </div>
    </details>
  )
})
SolCard.displayName = "SolCard"
export default SolCard

export function shortAd(address:string)
{
  return address.substr(0,2)+"-"+address.substr(address.length-2,address.length)
}