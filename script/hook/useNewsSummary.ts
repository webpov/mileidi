import { useState } from "react"

export const useNewsSummary = () => {
  const [summaryState, s__summaryState] = useState({})
  const [orderState, s__orderState] = useState({})

  // const refreshAllValues = async () => {
  //   // alert("asd")
  //   let local_totalMarketCap = prompt("enter totalMarketCap")
  //   let local_bitcoinDominance = prompt("enter bitcoinDominance")
  //   let local_cryptoVolume = prompt("enter cryptoVolume")
  //   let local_bitcoinPrice = prompt("enter bitcoinPrice")
  //   // let local_fearNGreed = prompt("enter fearNGreed")

  //   s__summaryState(prevValue=>({...prevValue,...{
  //       totalMarketCap: local_totalMarketCap || 0,
  //       bitcoinDominance: local_bitcoinDominance || 0,
  //       cryptoVolume: local_cryptoVolume || 0,
  //       bitcoinPrice: local_bitcoinPrice || 0,
  //       // fearNGreed: local_fearNGreed || 0,
  //     }})
  //   )
  // }
  
  

  return {
    orderState,
    newsState: summaryState,

    // refreshAllValues,
    s__summaryState,
    s__orderState,
  }
}