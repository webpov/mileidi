"use client";

import { Web3ReactProvider, Web3ReactHooks, useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import allConnections from '@/../script/util/connectors'
import ReactDOM from 'react-dom/client'

// import './index.css'

const connections: [Connector, Web3ReactHooks][] = allConnections.map(([connector, hooks]) => [connector, hooks])


export const Web3ReactContainer = ({children}:any) => {
  // console.log("connections", connections)
    return (<>
      <Web3ReactProvider connectors={connections}>
        {children}
      </Web3ReactProvider>
    </>)
}