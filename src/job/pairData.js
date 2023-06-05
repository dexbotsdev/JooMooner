import axios from "axios";
import ethers, { BigNumber, providers, Wallet ,Contract} from 'ethers';
 

import { ERC20ABI } from "../abis/index.js";

const provider = new providers.WebSocketProvider("wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e")

export const pairData = async (pairAddress) => {

    const pairDetails = await axios.get('https://api.dexscreener.com/latest/dex/pairs/ethereum/' + pairAddress);

    const paird={...pairDetails?.data.pair, owner:''};
    
    console.log(pairDetails.data);
 

    console.log('Returning paird')

    return paird;
};
