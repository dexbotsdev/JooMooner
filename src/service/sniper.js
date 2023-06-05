import { BigNumber, Contract,  providers,utils  } from 'ethers';
import * as BEP20 from '../contract/BEP20/bep20.js';
import * as UniswapFactory from '../contract/uniswap-v3-factory/factory.js'
import hpAbi from '../contract/honeypotChecker.js'
import { ERC20ABI } from '../abis/index.js';
import analyzeHp from '../lib/SourceAnalyzer.js';
 
import Web3 from 'web3';
import { addresses,checkETHPaired,checkforHoneyPot,isTokenNotVerified,getContractSrc,isQuoteToken, checkforFeesUpdate, isBlacklisted, checkforHoneyPot2 } from '../lib/helper.js'; 
 
import logger from '../lib/logger.js';
import HoneypotCheckerCaller from '../lib/HoneypotCheckerCaller.js';
import honeypotChecker from '../job/HoneyPot.js';

const provider = new providers.WebSocketProvider("wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e")
 const web3 = new Web3(addresses.RPC);  
const contractUniswapFactory = new Contract(
    UniswapFactory.address,
    UniswapFactory.ABI,
    provider
); 
const honeypotCheckerCaller = new HoneypotCheckerCaller(
    web3,
    addresses.HONEYPOT_CHECKER_ADDRESS
  )
const honeypotCheckerContract = new web3.eth.Contract(
    hpAbi,
    addresses.HONEYPOT_CHECKER_ADDRESS
  );

const main=(eventEmitter)=>{
    logger.docs("                             ")
    logger.docs(" |   _.     ._   _ |_   _  ._")
    logger.docs(" |_ (_| |_| | | (_ | | (/_ | ")  
    logger.docs("                             ")
    logger.docs(" ----- DEVELOPED BY DEXBOTSDEV                     ")
try{
    contractUniswapFactory.on('error', console.error);

    contractUniswapFactory.on('PairCreated', async (token0Addr, token1Addr, pairAddr) => {
        
        logger.info('Found a new Pair -- Analysis in Progress ---'+token0Addr +"/"+token1Addr);

        const ispairedWithWETH = checkETHPaired(token0Addr,token1Addr);

        if(ispairedWithWETH){

            let targetToken = token0Addr;
            let ethToken = token1Addr;

            const isQToken = isQuoteToken(targetToken);
            if(isQToken){
                targetToken = token1Addr;
                ethToken = token0Addr;
                }
            
            let ethContract = new Contract(ethToken, ERC20ABI, provider);
            let tokenContract = new Contract(targetToken, ERC20ABI, provider);
            let owner = '';
            
            try{
              owner = await tokenContract.owner();
            }catch(errr){
              console.log('errr')
              owner =null;
            }
            let tokenName = await tokenContract.name();
            let tokenSymbol = await tokenContract.symbol();
            let tokenDecimals = await tokenContract.decimals();
            let ethDecimals = await ethContract.decimals();

            let src = await getContractSrc(targetToken);
            let hp = true; 
            let tokenVerified = false;
            let blacklisted = false;
            if(src === null || src.data.result[0].ABI === 'Contract source code not verified' )
            {
                logger.info('Source Unverified stay Away from    '+tokenSymbol);  
             } else {
                  hp  = analyzeHp(src.data.result[0].SourceCode);
                 if(hp)
                  blacklisted = await isBlacklisted(src.data.result[0].SourceCode,src.data.result[0].ContractName,hp);
                  tokenVerified=true; 
                 
             }

            

            logger.info('Finding Liquidity   '+tokenSymbol);  

            const ethLiquidity = await ethContract.balanceOf(pairAddr);
            const tokenLiquidity = await tokenContract.balanceOf(pairAddr);
            const burntLiquidity = await tokenContract.balanceOf("0x000000000000000000000000000000000000dEaD");

            logger.info('Finding Total Supply  '+tokenSymbol);  
            const totalSupply = await tokenContract.totalSupply();

            let liqShare=0;
             try{
              liqShare = tokenLiquidity.mul(BigNumber.from("100")).div(totalSupply).toString();
             }catch(error){}
             

            let result='OK';
            let status=  !hp && tokenVerified &&  !blacklisted;

            logger.info('Token is Tradeable?? (Not HP and Src Verified and Not Scam and Not Blacklisted )  '+status);  


            if(Number(utils.formatUnits(ethLiquidity,ethDecimals))>0){
                logger.info('ETH Liquidity available  '+utils.formatUnits(ethLiquidity,ethDecimals));  
                
                 if(status){ 

                      logger.docs('Token Name       :',tokenName);
                      logger.docs('Token Symbol     :',tokenSymbol); 
                      logger.docs('Token ETH LIQ    :',Number(utils.formatUnits(ethLiquidity,ethDecimals))); 
                      logger.warning('Token Liq Share  :'+Number(liqShare).toFixed(2)+'  %'); 
                      
                      const cleanToken = {
                        tokenAddress: targetToken,
                        tokenName: tokenName,
                        tokenSymbol:tokenSymbol,
                       // buyTax: buyTax,   888000000000
                       // sellTax: sellTax, 263292000000
                        totalSupply: Number(utils.formatUnits(totalSupply,tokenDecimals)),
                        //buyGas: buyGas,
                       // sellGas: sellGas,
                        ethLiquidity: Number(utils.formatUnits(ethLiquidity,ethDecimals)),
                        lpTokenBalance: Number(utils.formatUnits(tokenLiquidity,tokenDecimals)),
                        lpHoldings: Number(liqShare).toFixed(2),
                        pairAddress:pairAddr, 
                        tokenVerified: tokenVerified,
                        ishp: hp,
                        owner:owner

                      } 
                      eventEmitter.emit('newtoken',cleanToken);

                 } else {
                    logger.error("Token is either Honeypot or there is no Liquidity Added");
                 } 
            }  
             else {
                logger.info('No Liquidity   ',tokenSymbol);  
                logger.docs('Token Name         :',tokenName);
                logger.docs('Token Symbol       :',tokenSymbol);
                logger.docs('Token is Verified  :',tokenVerified);  
                logger.docs('Token is HoneyPot  :',hp);    
                logger.docs('Token ETH LIQ    :',Number(utils.formatUnits(ethLiquidity,ethDecimals)));

             }
        } else {
            logger.error('Not a ETH Pair')
        }
 
    });

}catch(error){
    logger.error(error); 
 }
}

export  default main;