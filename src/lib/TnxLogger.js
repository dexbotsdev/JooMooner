import { Contract,  providers,ContractFactory,Wallet  } from 'ethers';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { PancakeRouterABI,WETH } from '../abis/index.js';
import abiDecoder from 'abi-decoder';
import logger from './logger.js';
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
const wallet = new  Wallet('0x5cd071930fe1eafa08c0156f9b22a7042544f2dcd20b21988dfbd0eacc1836a7', provider);

 
 
 const tx='0xc5a5325d92c8950567bfc00762470a0ad94c166ee9ebaeab44446dde8d37bb5d'
  
    provider.getTransaction(tx).then(async function (transaction) {
 
      ///  console.log(transaction.from ==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
        if (transaction && transaction.gasPrice  ) {  
          const value = web3.utils.fromWei(transaction.value.toString())
          const gasPrice = web3.utils.fromWei(transaction.gasPrice.toString())
          const gasLimit = web3.utils.fromWei(transaction.gasLimit.toString())
  
          console.log("value : ", value);
          console.log("gasPrice : ", gasPrice);
          console.log("gasLimit : ", gasLimit);
          console.log("from", transaction.from);
          console.log("to", transaction.to);
           
            console.log(transaction)

            process.exit(0)
        }
    }) 

/*
let options = {
    fromBlock: 17454196,
    address: ['0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13', '0x6b75d8af000000e20b7a7ddf000ba900b4009a80'],    //Only get events from specific addresses
    topics: []                              //What topics to subscribe to
};
let subscription = web3.eth.subscribe('logs', options,(err,event) => {
    if (!err)
    logger.info(event)
});
subscription.on('data', event => console.log('data'+event))
subscription.on('changed', changed => console.log('changed'+changed))
subscription.on('error', err => { throw err })
subscription.on('connected', nr => console.log('connected'+nr))

*/