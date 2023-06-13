import { Contract,  providers,ContractFactory,Wallet  } from 'ethers';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { ERC20ABI, PancakeRouterABI,WETH } from '../abis/index.js';
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

 
 const wethC = new Contract('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',WETH,provider);

/*
 wethC.on( 'Transfer' , async (from,to,value,a,b,c) => { 
    if(from === '0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13' || to==='0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80')
    console.log(from +":" + to +":"+ value+":"+ JSON.stringify(a));
  } )*/

  const monitorJaredsBuys = (token)=>{

    const tokenContract = new Contract(token.value,ERC20ABI,provider);

    tokenContract.on('Transfer', async (from,to,value,tx) =>{

      //if(to === '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80'|| from=== '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80'){
        console.log('********************************')
        console.log(to)
        console.log(from)
        console.log('Jared MEV FrontRun : '+ await tokenContract.name()); 
        console.log('Bought and Sold No Of Tokens  : '+ ethers.utils.formatEther(value.toString()));
        console.log('********************************')

     // }
    })

  }

  const JARED_BOT='0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80';
  const JARED_ADDR='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13'
  provider.on("pending", (tx) => {
    //console.log(i++ +":" + tx);
    provider.getTransaction(tx).then(function (transaction) {
 
      ///  console.log(transaction.from ==='0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
        if (transaction && transaction.gasPrice  ) {    
          if (transaction.from === JARED_BOT || transaction.from === JARED_ADDR ){

            console.log("from", transaction.from);
            console.log("to", transaction.to);
          }

                /*if (transaction.to === UNI_WOUTER) {
                    const result = abiDecoder.decodeMethod(transaction.data);
                    const token = result.params[0];
                      console.log(result.name+"\n"+token.value)
                    if(result.name.indexOf('addLiquidity')>=0){ 
                      console.log('Jared MEV FrontRun Monitoring for  : '+ token.value);

                      monitorJaredsBuys(token);
                    }
                    
                }  */
             
        }
    })
})