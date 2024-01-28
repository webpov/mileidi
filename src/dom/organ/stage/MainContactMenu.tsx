"use client";
import { useState } from 'react';
export const MainContactMenu = () => {
    const [walletAddress, setWalletAddress] = useState("BxuWcdHUqy9GGbhARea87Nu6yTf7SbVm6nid1nC76xUA");
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]); // Explicitly typed as any[] or Transaction[]


    const handleCheckBalance = async () => {
        const response = await fetch('/api/sol/balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });
    
        const data = await response.json();
        setBalance(data.balance);
    
        const transactionResponse = await fetch('/api/transactionHistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress }),
        });
    
        const transactionData = await transactionResponse.json();
        setTransactions(transactionData.transactions || []);
      };
      
    return (
        <div className="pa-2 z-200">
            <details className="">
                <summary className="opaci-chov--50 tx-end flex flex-justify-end">
                    <button className="noclick noborder bg-w-50 border-white-50 bord-r-25 py-2 tx-lg px-2">
                        <div className="opaci-40">ℹ️</div>
                    </button>
                </summary>
                <div className="flex-col flex-align-end gap-1 pa-1">
                {/* <button
    onClick={handleCheckBalance}
    className="px-6 bg-blue-500 text-white font-semibold rounded-r-md focus:outline-none hover:bg-blue-600"
 >
   Check Balance
 </button> */}
 
 {false && balance && (
        <div className="mt-8">
          <p className="text-xl font-medium">Wallet Balance:</p>
          <p className="text-4xl font-semibold text-green-600">{balance} SOL</p>
        </div>
      )}
      {/* <hr className='w-50' /> */}
                    <a href="https://x.com/mileidichan" target="_blank">
                        <button className="noborder bg-glass-10 bg-w-50 bord-r-25  opaci-chov--50 "
                          style={{background: "linear-gradient(45deg, cyan, #66aaff)", padding: "2px !important"}}
                        >
                          <div className='bg-w-90 tx-bold-6 tx-altfont-1 bord-r-25 pa-2'>Twitter: @mileidichan</div>
                        </button>
                    </a>
                    <a href="https://wpack.vercel.app/">
                        <button className="noborder bg-glass-10 bg-w-50 bord-r-25  opaci-chov--50 "
                          style={{background: "linear-gradient(45deg, cyan, #66aaff)", padding: "2px !important"}}
                        >
                          <div className='bg-w-90 tx-bold-6 tx-altfont-1 bord-r-25 pa-2'>WebPOV</div>
                        </button>
                    </a>
                </div>
            </details>
        </div>
    );
};
