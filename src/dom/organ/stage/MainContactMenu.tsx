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
            <details className="flex  flex-align-end">
                <summary className="noselect opaci-chov--50 tx-end flex flex-justify-end">
                    <button className="noclick flex-col noborder bg-w-50 border-white-50 bord-r-100 pa-4 tx-lg ">
                        <div className="pos-abs opaci-40 tx-roman tx-lx tx-bold-8 tx-white tx-shadow-5">i</div>
                    </button>
                </summary>
                <div className="flex-col flex-align-end gap-1 pa-1 mt-1">
                {/* <button
    onClick={handleCheckBalance}
    className="px-6 bg-blue-500 text-white font-semibold rounded-r-md focus:outline-none hover:bg-blue-600"
 >
   Check Balance
 </button> */}
 
 {false && balance && (
        <div className="mt-8 py">
          <p className="text-xl font-medium">Wallet Balance:</p>
          <p className="text-4xl font-semibold text-green-600">{balance} SOL</p>
        </div>
      )}
      {/* <hr className='w-50' /> */}
                    <a href="https://x.com/mileidichan" target="_blank">
                        <button className="noborder  bg-glass-10 bg-w-50 bord-r-25  opaci-chov--50 "
                          style={{background: "linear-gradient(45deg, cyan, #66aaff)", padding: "2px !important"}}
                        >
                          <div className='bg-w-90 tx-bold-6 tx-altfont-1 bord-r-25 py-1 pa-2'>Twitter: @MileiDiChan</div>
                        </button>
                    </a>
                    <a href="https://fluxbeam.xyz/app/tokens/miL2tTuTfd9nGKDSDcBXsEi1HMu2ANyiMasSnph44tn" target="_blank">
                        <button className="noborder bg-glass-10 bg-w-50 bord-r-25  opaci-chov--50 "
                          style={{background: "linear-gradient(45deg, cyan, #66ffaa)", padding: "2px !important"}}
                        >
                          <div className='noselect bg-w-90 tx-bold-8 tx-altfont-1 bord-r-25 py-1 pa-2'>Get $MILEI</div>
                        </button>
                    </a>
                </div>
            </details>
        </div>
    );
};
