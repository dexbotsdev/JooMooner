import { Contract, providers, ContractFactory, Wallet } from 'ethers';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { PancakeRouterABI, WETH } from '../abis/index.js';
import abiDecoder from 'abi-decoder';
import logger from './logger.js';
const UNI_WOUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const wss_qukcinode = "wss://orbital-evocative-violet.discover.quiknode.pro/3809ea0cc00274ebd7a41254732e23322a839d28/"
const wss_meganode = "wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e"
const web3 = new Web3(wss_meganode)
const iface = new ethers.utils.Interface(PancakeRouterABI)
abiDecoder.addABI(PancakeRouterABI);

const provider = new providers.WebSocketProvider(wss_meganode)
const contractUniswapFactory = new Contract(
  UniswapFactory.address,
  UniswapFactory.ABI,
  provider
);
let i = 0;
const wallet = new Wallet('0x5cd071930fe1eafa08c0156f9b22a7042544f2dcd20b21988dfbd0eacc1836a7', provider);

let tnxType = 'NEW'
let oldNumber = 0;
let token = 0;

const wethC = new Contract('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', WETH, provider);


wethC.on('Transfer', (from, to, value, a, b, c) => { 

  if (from === '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80' || to === '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80') {
    if (a.blockNumber !== oldNumber) {
      logger.error('------------------------NEW SANDWITCH------------------------------');
      oldNumber = a.blockNumber
    }

    console.log("Weth Transferred from : "+from + ": - To - " + to + ": Value: "  + ethers.utils.formatEther(value )); 
    console.log(a)
    console.log('--------------------------------------------------------------');
  }

})

/*
provider.on("block", async (tx) => {
   console.log(i++ +":" + tx);

   let block = await web3.eth.getBlock(tx,true);
   if (block != null) {
     if (block.transactions != null && block.transactions.length != 0) {
       block.transactions.map(transaction =>{
            
 
               ///  console.log(transaction.from ==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
                 if (transaction && transaction.from  ) {  
                         // console.log("gasPrice : ", gasPrice);
                         //console.log("gasLimit : ", gasLimit);
                        // console.log("from", transaction.from);
                        if(transaction.from==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13' || transaction.from==='0x6b75d8af000000e20b7a7ddf000ba900b4009a80')
                         console.log(transaction)
                          
                      
                 } 
       })
     }
   }
}) 


let block = await web3.eth.getBlock(17454576,true);

block.transactions.map(transaction =>{
            
 
     console.log(transaction.from ==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
     if (transaction && transaction.from  ) {  
             // console.log("gasPrice : ", gasPrice);
             //console.log("gasLimit : ", gasLimit);
            // console.log("from", transaction.from);
            if(transaction.from==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13' || transaction.from==='0x6b75d8af000000e20b7a7ddf000ba900b4009a80')
             console.log(transaction)
              
          
     } 
})  
provider.on("pending", (tx) => {
   //console.log(i++ +":" + tx);
   provider.getTransaction(tx).then(async function (transaction) {
 
     ///  console.log(transaction.from ==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
       if (transaction && transaction.gasPrice  ) {  
               // console.log("gasPrice : ", gasPrice);
               //console.log("gasLimit : ", gasLimit);
               // console.log("from", transaction.from);
               if(transaction.from==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13' 
               || transaction.from==='0x6b75d8af000000e20b7a7ddf000ba900b4009a80'
               || transaction.from ==='0x77ad3a15b78101883af36ad4a875e17c86ac65d1'
               || transaction.from ==='0x00000000A991C429eE2Ec6df19d40fe0c80088B8'
               || transaction.from === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
               //console.log(transaction)
                //const result = abiDecoder.decodeMethod(transaction.data);
                
               if (result && result.name) {

                   if(result.from==='0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80')
                   console.log('Found Tnx with '+result.name +':'+result.params[0].value);
                    if(result.name.includes('removeLiquidity')){

                       console.log(result.params)

                   }
                   
               }  
            
       }
   })
})*/

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