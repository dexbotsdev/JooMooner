import { Contract,  providers  } from 'ethers';
import { ERC20ABI } from '../abis/index.js'; 
import { UniswapPairABI } from '../abis/index.js';
import { getContractSrc } from '../lib/helper.js';
import { formatEther } from 'ethers/lib/utils.js';
const provider = new providers.WebSocketProvider("wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e")


const getRenounceStatus= async (tokenAddress)=>{

    console.log("Checking Renounce Status")
 
 	let tokenContract = new Contract(tokenAddress, ERC20ABI, provider);
 
    const getOwner = async()=>{
        try {
            const value = await tokenContract.owner()
            return value
        } catch (e) {
            return null;
        }
    } 

    let owner = await getOwner(); 
   
    console.log("Checking Renounce Status "+owner)

    return owner ==="0x000000000000000000000000000000000000dEaD" || owner ==="0x0000000000000000000000000000000000000000";
}


export default getRenounceStatus;