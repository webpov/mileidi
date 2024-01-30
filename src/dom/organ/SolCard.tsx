//SolCard.tsx
import { useEffect, useState } from 'react'
import { Web3ReactSelectedHooks, useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SolCard({ name}: {name: string}) {
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
   const [solAddress, s__solAddress] = useState()
  const [error, setError] = useState<Error | undefined>(undefined)
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')
  const trySolAddress = async () => {
    // @ts-ignore
    let ggg =  window.solana.connect()
    console.log("ggg", ggg)
    let gg22 = await ggg
    // @ts-ignore
    let gg244442 = await window.solana
    console.log("gg244442gg244442gg244442", gg244442)
    console.log("gg22110", gg22)
    console.log("gg22110", JSON.stringify(gg22))
    console.log(gg22.publicKey, "gg22123", JSON.stringify(gg22.publicKey))
    console.log(gg22.publicKey.toString(), "gg2224455", gg22)
    s__solAddress(gg22.publicKey.toString())
    getSolBalance(gg244442, gg22.publicKey)
  }
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
  const getSolBalance = async (provider:any, publicKey:any) => {
    // ts-ignore
    var phantom = await provider;

  if (phantom !== false) {

    console.log("Phantom Wallet Found, Connecting..", phantom);
    // const connection123 = new Connection("https://api.mainnet-beta.solana.com");
    const connection123 = new Connection("https://api.devnet.solana.com");
    // const connection123 = new Connection("https://api-mainnet.magiceden.dev/v2");
    (async () => {
      let balance = await connection123.getBalance(publicKey);
      console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
      callUpdateSupabase(publicKey.toString(),balance / LAMPORTS_PER_SOL)
    })();
    // (async () => {
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
    // })();
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
  console.log("***********************..", );
  // var walletinfo = phantom.connect()?.getSolbalance?.("AbeujwVGomZLR5WejXQ5JXDQadHbyPhsxLPvrrsHk9fc");
  // console.log("walletinfo..", walletinfo);
  // console.log("walletinfo2222..", await walletinfo);
  // console.log("connect_walletconnect_walletconnect_wallet..", connect_wallet);
  // console.log("connect_walletconnect_walletconnect_wallet..", await connect_wallet);

  // After Connecting
  phantom.on("connect", () => {

    // Check Connection
    console.log("Phantom Connected: " + phantom.isConnected);

    // Get Wallet Address
    var wallet_address = phantom.publicKey.toString();
    console.log("Solana Wallet Address: " + wallet_address);
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
            console.log("window.phantom?.solana", sol )
      // @ts-ignore
            let sol2:any = window.solana
                  console.log("window.sol2", sol2 )
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
        await handleContractCall()
      
    }
    else if (!isActivating) {
      setConnectionStatus('Connecting..')
        Promise.resolve(connector.activate(1))
        .catch((e) => {
          connector.resetState()
          setError(e)
        }) 
      }
  }
  useEffect(() => {
    
    if(isActive) {
      setConnectionStatus('Connected')
      trySolAddress()
    } else {
      setConnectionStatus('Disconnected')
    }
  }
  ,[isActive])

  return (
    <div>
      <p>{name.toUpperCase()}</p>
      <h4>Sol: {solAddress || "n/a"}</h4>
      <h3>Status - {(error?.message) ? ("Error: " + error.message) : connectionStatus}</h3>
      <h3>Address - {account ? account : "No Account Detected"}</h3>
      <h3>ChainId -  {chain ? chain : 'No Chain Connected'}</h3>
      <button onClick={handleToggleConnect} disabled={false}>
        {isActive ? "Disconnect" : "Connect"}
      </button>
    </div>
  )
}