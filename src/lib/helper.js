import { BscScan } from "@jpmonette/bscscan";
import axios from 'axios';
import logger from "./logger.js";
import { Client } from "twitter-api-sdk";
import { HoneypotIsV1 } from "@normalizex/honeypot-is";
import fs,{ writeFileSync } from 'fs'

const ttoken='AAAAAAAAAAAAAAAAAAAAAKGXngEAAAAAfXMYr7nIViuLRZNuM95gGdj9uBc%3Du20Igs9hUi9qZiyrYsbmXei6W1ZmDwz33NBTGitdmse7qbxE1D';

export const addresses = { RPC: "https://eth-mainnet.nodereal.io/v1/c39cf5b992844862a28cf386f68d310e",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDT:'0xdAC17F958D2ee523a2206206994597C13D831ec7',
    BUSD:"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    HONEYPOT_CHECKER_ADDRESS: "0xb8d371276ae24a851347cf90bd4884d59254ff71",

} 

export const validateTwitterHandle = (src)=>{
  const client = new Client(ttoken);
   const srcl = src.split('/n')
   srcl.forEach((item)=>{
    if(item.indexOf("twitter")>0){
      var txt = item.split("/");
      console.log(txt)
    }
   })
 
}

export const getContractCreator = async(tokenAddress)=>{

    const contractdata= await axios
    .get(`https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=H8S7Y2FBEFSP2I5D1ZSTRR5DM6BDH9Q8SG`)
    .then(res=>res)
    .catch(error=>null);
   
    return contractdata;
  }
  
  export const getTopHolders = async(tokenAddress)=>{
  
    const contractdata= await axios
    .get(`https://api.covalenthq.com/v1/1/tokens/${tokenAddress}/token_holders/?key=ckey_0b02a76db9bb4809a54aa41972b`)
    .then(res=>res)
    .catch(error=>null);
   
    return contractdata;
  }

  export const isBlacklisted = async(srcx,name,tradeAble)=>{
    let isBlackList=false;
 
     fs.readFile('./blacklist.json', 'utf8',  (error, data) => {
       if(error){
          console.log(error);
          return;
       }

       let blacklist = data ? JSON.parse(data): null;    

       console.log('Checking blacklist For ContractName '+ name) 
       console.log(blacklist.indexOf(name)); 
     if(tradeAble==='HONEYPOT'){
       if(blacklist=== undefined || blacklist === null){
         blacklist = [name];
         isBlackList=true;
       } else {

         if(blacklist.indexOf(name) <0)
             {blacklist.push(name);
               isBlackList=true;}
       } 
       fs.writeFile('./blacklist.json', JSON.stringify(blacklist, null, 2), (err) => {
         if (err) {
           console.log('Failed to write updated data to file');
           return;
         }
         console.log('Updated file successfully');
       }); 
     }  
        
     }) 
    return isBlackList;

  }
  
  export const getContractSrc = async(tokenAddress)=>{
  
    
    const contractdata= await axios
    .get(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${tokenAddress}&apikey=UHC6JGAPVA9FJIG7X9PFTZAX94JVFIE285`)
     

    const data =JSON.stringify(contractdata.data.result);
    console.log(data.indexOf('pragma solidity'));
    const result = {
      status:Number(data.indexOf('pragma solidity'))>0,
      SourceCode: Number(data.indexOf('pragma solidity'))>0 ? contractdata.data.result[0].SourceCode:'',
      ContractName: Number(data.indexOf('pragma solidity'))>0 ? contractdata.data.result[0].ContractName:'',
    }


    return result;
  }
  
  export const isQuoteToken=(tokenAddress)=>{
  
    if(tokenAddress.toLowerCase() ===  addresses.WETH.toLowerCase()) return true;
    else if(tokenAddress.toLowerCase() ===  addresses.USDT.toLowerCase()) return true; 
    else return false; 
  
  }
  
  export const checkETHPaired = (token0,token1)=>{
    if(token0.toLowerCase() ===  addresses.WETH.toLowerCase() ||token1.toLowerCase() ===  addresses.WETH.toLowerCase()  ) return true; 
  }
  

  export const checkforHoneyPot = async(tokenAddress)=>{
  
    let tradeAble = true; 
      let newData = {};
      const CHAIN_ID = 1;
      const honeypotis = new HoneypotIsV1();

      const ITM_PAIRS = await honeypotis.getPairs(tokenAddress, CHAIN_ID);
      
      try{
        const tokenData =  await honeypotis.honeypotScan(
          tokenAddress, 
          ITM_PAIRS[0].Router, 
          ITM_PAIRS[0].Pair.Address,
          CHAIN_ID
        ).then((result) => result) 
        if(tokenData!== null && tokenData!== undefined){
          if(tokenData.IsHoneypot || tokenData.Error 
            || tokenData.BuyTax >5
            || tokenData.SellTax >5
            || tokenData.TransferTax >0 
            ){ 
              logger.error( tokenData.Flags,'Token Error : ');
              tradeAble=false;  
            }  
        }
  
        if(tokenData === null || tokenData === undefined){
          logger.error( 'No Data Found Yet','Token Error : ');
              tradeAble=false; 
        }
         newData = {...tokenData,"tradeAble":tradeAble}

         console.log(newData)

      }catch(err){
         console.log(err)
        logger.error( err.message,'Token Error : ');
        tradeAble=false; 
      }
      
      
      return tradeAble;
  }

  export const checkforFeesUpdate = async(sourcecode)=>{
    let scamtoken=false;
    const srccodehasfeeupdate = sourcecode.indexOf('FeesUpdated')>0;
    const srccodehassetfee = sourcecode.toLowerCase().indexOf('setfee')>0;
     
    console.log(sourcecode.indexOf('FeesUpdated'))
    if(srccodehasfeeupdate || srccodehassetfee) scamtoken=true;

    return scamtoken;
    
  }

  export const checkforHoneyPot2 = (abi)=>{

     
    var str = JSON.stringify(abi).toLowerCase();

    const isNotVerified = str.indexOf('contract source code not verified')>0;
    const isAccounting = str.indexOf('setaccountingaddress')>0;
    const isLibrary = str.indexOf('libraryaddress')>0 ;
    const scam = str.indexOf('adjust')>0 ||str.indexOf('analyze')>0 || str.indexOf('multicall')>0 ||str.indexOf('approved')>0 ;
    const setFees = str.indexOf('setfees')>0 ||str.indexOf('setsellfees')>0 ||str.indexOf('feesupdated')>0 ;
  

    logger.error('isNotVerified '+isNotVerified)
    logger.error('isAccounting '+isAccounting)
    logger.error('isLibrary '+isLibrary)
    logger.error('scam '+scam)
    logger.error('setFees '+setFees)

    if(isAccounting || scam) return true; 
    else if(isLibrary) return true;
    else if(isNotVerified) return true;
    else if(setFees) return true;
    

    return false;

  }

  export const isTokenNotVerified =(abi)=>{

     
    var str = JSON.stringify(abi).toLowerCase();

    const isNotVerified = str.indexOf('Contract source code not verified')>0; 

    logger.error('isNotVerified '+isNotVerified)


    if(isNotVerified) return true;
    

    return false;

  }


  export const displayBanner=()=>{

    logger.docs("")
  }
  