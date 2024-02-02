//SolCard.tsx
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Web3ReactSelectedHooks, useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAccount, getMint } from '@solana/spl-token'
import * as bs58 from "bs58";

import {
  getAssociatedTokenAddress,
  mintTo,
  createMint,
} from "@solana/spl-token";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { shortWeb3Address } from '../../../script/util/webhelp';


export const SolCard = forwardRef(({ name}:any, ref:any ) => {
  const { connector, hooks } = useWeb3React();

  
  const {
    useSelectedAccount, useSelectedChainId, useSelectedIsActive, useSelectedIsActivating, useSelectedStore
   } = hooks
  const isActivating = useSelectedIsActivating(connector)
  const isActive = useSelectedIsActive(connector)
  const account = useSelectedAccount(connector)
  const chain = useSelectedChainId(connector)
// const store = useSelectedStore(connector)
// const { library } = useWeb3React();
   const [solBal, s__solBal] = useState()
   const [tokBal, s__tokBal] = useState<any>()
   const [tokBalance, s__tokBalance] = useState<any>()
   const [solAddress, s__solAddress] = useState()
  const [error, setError] = useState<Error | undefined>(undefined)
  const [connectionLabel, setConnectionLabel] = useState('Disconnected')
  const trySolAddress = async () => {
    // @ts-ignore
    let ggg =  window.solana.connect()
    // console.log("ggg", ggg)
    let gg22 = await ggg
    // @ts-ignore
    let gg244442 = await window.solana
    // console.log("gg244442gg244442gg244442", gg244442)
    // console.log("gg22110", gg22)
    // console.log("gg22110", JSON.stringify(gg22))
    // console.log(gg22.publicKey, "gg22123", JSON.stringify(gg22.publicKey))
    // console.log(gg22.publicKey.toString(), "gg2224455", gg22)
    let solAd = gg22.publicKey.toString()
    s__solAddress(solAd)
    setConnectionLabel("✅ "+shortAd(solAd))

    getSolBalance(gg244442, gg22.publicKey)
  }
  useImperativeHandle(ref, 
    () => {
      return {
        solAddress,
        solBal,
      };
    },
  )
  const callUpdateSupabase = async (publicKey:string, amount:number) => {
    try {
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicKey, amount }),
      });
  
      if (!response.ok) {
        // Handle non-2xx responses here
        console.error('Failed to call the API endpoint', response.statusText);
        return null;
      }
  
      const data: any = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling the API', error);
      return null;
    }
  

  }
  async function getTokenBalanceWeb3(connection:any, tokenAccount:any) {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (!info.value.uiAmount) throw new Error('No balance found');
    // console.log('Balance (using Solana-Web3.js): ', info.value.uiAmount);
    return info.value.uiAmount;
}
async function getTokenBalanceSpl(connection:any, connectedWallet:any) {
  
// const tokenAccoun123t = await getAssociatedTokenAddress(
//   connection,
//   connectedWallet,
// );
// console.log("asd", tokenAccoun123t)
// let MY_WALLET  = connectedWallet.toString()
// const payload = {
//   "id": 1,
//   "jsonrpc": "2.0",
//   "method": "getTokenAccountsByOwner",
//   "params": [
//       MY_WALLET,
//       {"mint": MY_TOKEN},
//       {"encoding": "jsonParsed"},
//   ],
// }
// const resres = await fetch("https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r",{
//   method:"GET",
//   body: JSON.stringify(payload)
// })
// console.log("resres",resres)

let MY_TOKEN_ADDRESS:any  = 'mdnhtNYShfmkToZRmnS4y33pyopnYcMhyF3V3Hyo8eg'
let MY_TOKEN_ACCOUNT:any  = '6zDLHeA1jXLUqMpVvrxScuXEvCEXG2hwbaGKS87fLgN9'
// let MY_TOKEN:any  = '8AG4ZFCu8V3C2zkmyLtSorgGT6odFbKLFWnqykTiijZ6'
// const mintAccountPublicKey = new PublicKey(MY_TOKEN);
// let mintAccount = await getMint(connection, new PublicKey("mdnhtNYShfmkToZRmnS4y33pyopnYcMhyF3V3Hyo8eg"));

//   console.log("bs58.decodebs58.decode", mintAccount)
//   let balanceOfTokens = await connection.getTokenAccountsByOwner(connectedWallet,{mint:mintAccount});
//   console.log(`${balanceOfTokens / LAMPORTS_PER_SOL} SOL`);
  // callUpdateSupabase(connectedWallet.toString(),balance / LAMPORTS_PER_SOL)

//   console.log("asd connection.getParsedProgramAccounts", )
//   const filters:any[] = [
//     {
//       dataSize: 165,    //size of account (bytes)
//     },
//     {
//       memcmp: {
//         offset: 32,     //location of our query in the account (bytes)
//         bytes: connectedWallet.toString(),  //our search criteria, a base58 encoded string
//       }            
//     }
//  ];

  const info22 = await connection.getTokenAccountBalance(new PublicKey(MY_TOKEN_ACCOUNT));
  // console.log("info22", info22, connectedWallet)
  
  // const info233 = await connection.getTokenLargestAccounts  (new PublicKey(MY_TOKEN_ADDRESS))
  // const info233 = await connection.getTokenAccountsByOwner  (new PublicKey("EcBKZoU5BjYUXzEa4GagmyrRF34ZNUi9WqDfqAGRAfM2"),{ //connectedWallet
  //   mint: new PublicKey(MY_TOKEN_ADDRESS)
  // });

  const accountsList = await connection.getTokenAccountsByOwner(connectedWallet, {
    mint: new PublicKey(MY_TOKEN_ADDRESS)
  });

    

    // console.log("******************accountsList.value[0].pubkey.toString()******************");
    const walletSpecificAccoutn = accountsList.value[0].pubkey


    const accountBalance = await connection.getTokenAccountBalance(walletSpecificAccoutn)
    // console.log("accountBalance", accountBalance.value.uiAmount)
  

  // console.log("getTokenAccountsByOwner info233info233", info233.uiAmount, connectedWallet.toString())
  // const matched = info233.value.filter((anAcc:any)=>{
  //   console.log("anAcc.address.toString()", anAcc.address.toString())
  //   return anAcc.address.toString() == connectedWallet.toString()
  // })
  // console.log("matchedmatched", matched)
  // if (matched.length) {
  //   // console.log("matched", matched.uiAmount)
  //   console.log("matched.uiAmount", matched[0].uiAmount)
  // } else {return} 
  // console.log("getTokenAccountsByOwner info233info233", info233.value[0].account)
  // console.log("getTokenAccountsByOwner info233info233", info233.value[0].account.owner)
  // console.log("getTokenAccountsByOwner info233info233", info233.value[0].account.owner.toString())
  // console.log("getTokenAccountsByOwner info233info233", info233.value[0].account.lamports / LAMPORTS_PER_SOL)
  

    if (!info22.value.uiAmount) throw new Error('No balance found');
    // console.log('Balance (using Solana-Web3.js): ', info22.value.uiAmount);
    // return info22.value.uiAmount;

//   const accounts = await connection.getParsedProgramAccounts(
//     new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
//     {filters: filters}
// );
//   console.log("asd accounts", accounts)
    



  // const info = await getAccount(connection, mintAccountPublicKey);
  // console.log("asd info", info)
  // const amount = Number(info.amount);
  // const mint = await getMint(connection, info.mint);
  // const balance = amount / (10 ** mint.decimals);
  // console.log('Balance (using Solana-Web3.js): ', balance);
  // return balance;

  // callUpdateSupabase(publicKey.toString(),balance / LAMPORTS_PER_SOL)
  let actualVal = parseInt(accountBalance.value.uiAmount) // parseInt(info22.value.uiAmount)
  
  // const priceSol:any = await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`)).json()
  // console.log("priceSol", priceSol)
  // const realpriceSol = parseFloat(priceSol.solana.usd)*actualVal
  const formatter = Intl.NumberFormat('en', {notation: 'compact'})
  let stringVal = formatter.format(actualVal)
  
  s__tokBal(stringVal)
  s__tokBalance(actualVal)
  callUpdateSupabase(connectedWallet.toString(),actualVal)

}

  const getSolBalance = async (provider:any, publicKey:any) => {
    // ts-ignore
    var phantom = await provider;

  if (phantom !== false) {

    // console.log("Phantom Wallet Found, Connecting..", phantom);
    // const connection123 = new Connection("https://api.mainnet-beta.solana.com");
    // const connection123 = new Connection("https://api.devnet.solana.com");
    const connection123 = new Connection("https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r");
    // const connection123 = new Connection("https://api-mainnet.magiceden.dev/v2");
    (async () => {
      let balance = await connection123.getBalance(publicKey);
      // console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
      let solBale:any = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(4))
      s__solBal(solBale)
      s__solBal(solBale)
      // callUpdateSupabase(publicKey.toString(),balance / LAMPORTS_PER_SOL)
    })();
    (async () => {
      // console.log("await getTokenBalanceWeb3", publicKey, )
      let asd = await getTokenBalanceSpl(connection123, publicKey)
      // console.log("token balance asd", publicKey, asd)
    //   // @ts-ignore
    //   let balance = await window.solana.request({
    //       method: "getBalance",
    //       params: [
    //         publicKey.toString(), //wallet's public key
    //         {
    //           encoding: "base58",
    //         },
    //       ],
    //     });
    //   console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
    })();
  // Connect to Solana
  var connect_wallet = phantom.connect();
  // var balancebalancebalancebalance = await phantom?.getSolBalance()
  // console.log("balancebalancebalancebalance", balancebalancebalancebalance)
  //   var walletinfo111 = phantom?.request({
  //   method: "getAccountTokenBalance",
  //   params: [
  //     "AbeujwVGomZLR5WejXQ5JXDQadHbyPhsxLPvrrsHk9fc", //wallet's public key
  //     {
  //       encoding: "base58",
  //     },
  //   ],
  // });
  // console.log("walletinfo..", walletinfo111);
  // console.log("walletinfo2222..", await walletinfo111);
  // console.log("***********************..", );
  // var walletinfo = phantom.connect()?.getSolbalance?.("AbeujwVGomZLR5WejXQ5JXDQadHbyPhsxLPvrrsHk9fc");
  // console.log("walletinfo..", walletinfo);
  // console.log("walletinfo2222..", await walletinfo);
  // console.log("connect_walletconnect_walletconnect_wallet..", connect_wallet);
  // console.log("connect_walletconnect_walletconnect_wallet..", await connect_wallet);

  // After Connecting
  phantom.on("connect", () => {

    // Check Connection
    // console.log("Phantom Connected: " + phantom.isConnected);

    // Get Wallet Address
    var wallet_address = phantom.publicKey.toString();
    // console.log("Solana Wallet Address: " + wallet_address);
  })

    // let ggg =  window.solana.getTokenAccountsByOwner()
    // console.log("g23232323232gg", ggg)
    // let gg22 = await ggg
    // console.log("g23232323232ggg22gg22gg22g", gg22)
  
  }
     
  }
  const handleContractCall = async () => {
    

    try {
        
      // @ts-ignore
      let sol:any = window.phantom?.solana
            // console.log("window.phantom?.solana", sol )
      // @ts-ignore
            let sol2:any = window.solana
                  // console.log("window.sol2", sol2 )
      trySolAddress()
        //     connector.watchAsset && connector.watchAsset({
        //     "address": "",
        //     "symbol": "",
        //     "decimals": 9,
        //     "image": ""
        // }) 
    } catch (error) {
      console.error('Error calling contract:', error);
    }
  };
  const handleToggleConnect = async () => {
    setError(undefined) // clear error state

    if (isActive) {
        // console.log("watchAsset", connector, "***" , )
        // await handleContractCall()
        if(connector?.deactivate) {
          void connector.deactivate()
        } else {
          void connector.resetState()
        }
  
      
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
        {/* <div>{name.toUpperCase()}</div> */}
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
        {/* <div>Address - {account ? account : "No Account Detected"}</div>
        <div>ChainId -  {chain ? chain : 'No Chain Connected'}</div> */}
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