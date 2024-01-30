import { getSupabaseClient } from "@/../script/state/repository/webdk";
import { NextApiRequest, NextApiResponse } from 'next';
  
import { headers } from "next/headers";

async function createOrUpdateWallet(supabase: any, publicKey: any, amount:any, ip: string) {
    const { data: existingWallet } = await supabase.from('wallet').select()
        .match({ public: publicKey }).single();
    if (!existingWallet) {
        // If wallet doesn't exist, create a new one with `created_ip` and `updated_ip`
        const insObj = {
            public: publicKey,
            amount,
            created_ip: ip, // Set the IP address at wallet creation
            updated_ip: ip  // Both fields are set at creation
        }
        console.log("insObj", insObj)
        const { data: newWallet, error: insertError } = await supabase.from('wallet').insert(insObj);

        if (insertError) {
            console.error('Error creating new wallet:', insertError);
            throw insertError;
        }

        return newWallet;
    } else {
        // If wallet exists, update the `updated_at` and `updated_ip` fields
        const { data: updatedWallet, error: updateError } = await supabase.from('wallet')
            .update({
                amount,
                updated_at: Date.now(), // Assuming `updated_at` is managed manually
                updated_ip: ip  // Update the IP address on each update
            })
            .match({ public: publicKey });

        if (updateError) {
            console.error('Error updating wallet:', updateError);
            throw updateError;
        }

        return updatedWallet;
    }
}

// KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r
// https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r
// wss://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r

// {"jsonrpc":"2.0","id": 2, "method": "eth_subscribe", "params": ["alchemy_pendingTransactions", {"toAddress": ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xdAC17F958D2ee523a2206206994597C13D831ec7"], "hashesOnly": false}]}

export async function POST(req: any) {  


    console.log("asdasdasd wallet endpoint wallet endpointwallet endpoint")
    const supabase = getSupabaseClient()
  const { publicKey, amount } = await req.json()
    console.log("publicKey, amount", publicKey, amount)
    const headersList = headers();
    let player
    const ip = headersList.get("x-forwarded-for") || "121.0.0.1"
    try {
        player = await createOrUpdateWallet(supabase, publicKey, amount, ip)
    } catch (error) {
        throw new Error("unknown error")
        console.error(error)
    }
    return new Response(JSON.stringify({ player }))
}
  
  
