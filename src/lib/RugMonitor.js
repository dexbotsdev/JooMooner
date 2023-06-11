import { Contract,  providers  } from 'ethers';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { PancakeRouterABI } from '../abis/index.js';
import abiDecoder from 'abi-decoder';
const UNI_WOUTER='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const wss_qukcinode="wss://orbital-evocative-violet.discover.quiknode.pro/3809ea0cc00274ebd7a41254732e23322a839d28/"
const wss_meganode="wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e"
const web3 = new Web3(wss_qukcinode)
const iface = new ethers.utils.Interface(PancakeRouterABI)
 abiDecoder.addABI(PancakeRouterABI);

const provider = new providers.WebSocketProvider(wss_qukcinode)
const contractUniswapFactory = new Contract(
    UniswapFactory.address,
    UniswapFactory.ABI,
    provider
); 
let i=0;
provider.on("pending", (tx) => {
    //console.log(i++ +":" + tx);
    provider.getTransaction(tx).then(async function (transaction) {
 
        if (transaction && transaction.to === UNI_WOUTER && transaction.gasPrice) {
        
            
            const value = web3.utils.fromWei(transaction.value.toString())
            const gasPrice = web3.utils.fromWei(transaction.gasPrice.toString())
            const gasLimit = web3.utils.fromWei(transaction.gasLimit.toString())
            if (parseFloat(value) > 0) {
               // console.log("value : ", value);
               // console.log("gasPrice : ", gasPrice);
                //console.log("gasLimit : ", gasLimit);
               // console.log("from", transaction.from);
                let result  = [];
                try {
                  result = iface.decodeFunctionData('swapExactETHForTokens', transaction.data)
                } catch (error) {
                  try {
                    result = iface.decodeFunctionData('swapExactETHForTokensSupportingFeeOnTransferTokens', transaction.data)
                  } catch (error) {
                    try {
                      result = iface.decodeFunctionData('swapETHForExactTokens', transaction.data)
                    } catch (error) {
                      console.log("final err : ", { hash: transaction.hash, data: transaction.data });
                    }
                  }
                }
                console.log('result',abiDecoder.decodeMethod(transaction.data));
                if (result.length > 0) {
                    let tokenAddress = ""
                    if (result[1].length > 0) {
                      tokenAddress = result[1][1]
                      console.log("tokenAddress", tokenAddress);
                        
                    }
                }
            }
        }
    })
})