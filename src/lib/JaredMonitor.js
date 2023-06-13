import { Contract, providers, ContractFactory, Wallet } from 'ethers';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import Web3 from 'web3';
import { ethers } from 'ethers';
import { PancakeRouterABI, WETH, UniswapPairABI, ERC20ABI } from '../abis/index.js';
import abiDecoder from 'abi-decoder';
import logger from './logger.js';
import { BigNumber as BN } from "bignumber.js"
const wss_qukcinode = "wss://orbital-evocative-violet.discover.quiknode.pro/3809ea0cc00274ebd7a41254732e23322a839d28/"
const web3 = new Web3(wss_qukcinode)
abiDecoder.addABI(PancakeRouterABI);
const WETH9 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const provider = new providers.WebSocketProvider(wss_qukcinode)
const wethC = new Contract(WETH9, WETH, provider);
const ten = new BN(10)
let i=0;
const contractUniswapFactory = new Contract(
  UniswapFactory.address,
  UniswapFactory.ABI,
  provider
);
let tnxType = 'NEW'
let oldNumber = 0;
let token = 0;

const getPairInfo = async (pairAddress, tokenContract) => {
  const pairContract = new Contract(pairAddress, UniswapPairABI.abi, provider);
  const tokenAddress = await pairContract.token0();

  const tokenDecimals = await tokenContract.decimals();
  const stableCoinBalance = await wethC.balanceOf(pairAddress);
  const tokenBalance = await tokenContract.balanceOf(pairAddress);
  const price = new BN(stableCoinBalance)
    .multipliedBy(ten.pow(Number(tokenDecimals)))
    .idiv(new BN(tokenBalance)).idiv(ten.pow(Number(18 - 6)))
  const name = await tokenContract.name();
  return { tokenAddress:tokenAddress,name: name, price: price }

}

const monitorJaredsTnx = async (monitorToken) => {
  const tokenContract = new Contract(monitorToken, ERC20ABI, provider);

  tokenContract.on('Transfer', (from, to, value, transaction) => {
    if (to === '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80'){
    if (transaction.blockNumber !== oldNumber) {
     
      logger.error('------------------------NEW SANDWITCH------------------------------');
      logger.info('Token From : ' + from)
      logger.info('Token to: ' + to)
      oldNumber = transaction.blockNumber
    }
    console.log(from + ":" + to + ":" + value + ":" + JSON.stringify(transaction)); 
    console.log('--------------------------------------------------------------');

    if (to === '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80') {
      getPairInfo(from, tokenContract).then((result) => {
        logger.error('------------------------JARED Bought Token------------------------------');
        logger.info('Token Name : ' + result.name)
        logger.info('Token Price: ' + result.price.toString())
        logger.info('Tokens Bought: ' + value.toString())
      })
    }}




  })

}





provider.on("pending", (tx) => {
  provider.getTransaction(tx).then(async function (transaction) {
    if (transaction && transaction.gasPrice) {
      const value = web3.utils.fromWei(transaction.value.toString())
      const gasPrice = web3.utils.fromWei(transaction.gasPrice.toString())
      const gasLimit = web3.utils.fromWei(transaction.gasLimit.toString())
      const result = abiDecoder.decodeMethod(transaction.data);
      if (result && result.name) {
        if (result.name.indexOf('addLiquidity') >= 0) {
          const tokenAddress = result.params[0].value;

          try {
            const pair = await contractUniswapFactory.getPair(tokenAddress, WETH9);

            const tokenContract = new Contract(tokenAddress, ERC20ABI, provider);

            logger.info("Pair Address  : " + pair);
            logger.info(i++ +":" + tx);

            if (pair && pair.address) {
              const liquidity = await wethC.balanceOf(pair.address);
              logger.info("Liquidity   : " + liquidity.toString());
              if (BN(liquidity.toString()).gt(0)) {
                logger.info("Pair Address  : " + pair.address);
                logger.info("Pair Liquidity Exists : " + await tokenContract.name());
              }
            } else {
              logger.info("value : " + value);
              logger.info("gasPrice : " + gasPrice);
              logger.info("gasLimit : " + gasLimit);
              logger.info("from :" + transaction.from);
              logger.info("to :" + transaction.to);
              logger.info("TokenAddress : " + tokenAddress)
              monitorJaredsTnx(tokenAddress)

            }



          } catch (error) {
            logger.error(error)



          }



        }

      }

    }
  })
}) 
