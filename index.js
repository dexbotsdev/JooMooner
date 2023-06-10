import logger from './src/lib/logger.js';
import main from './src/service/sniper.js';
import { EventEmitter } from 'emitter';
import Parse from 'parse/node.js';
import { pairData } from './src/job/pairData.js';
import { Webhook,MessageBuilder } from 'discord-webhook-node';



const appId="Z6R6NI8P6LR2ZIE0B9G1";
const appKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB";
const masterKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB"
const hostUrl="http://144.24.158.75:1337/parse";
Parse.initialize(appId, appKey,masterKey);
Parse.serverURL = hostUrl;
const TokenTracker = Parse.Object.extend("TokenTracker");
const hook = new Webhook("https://discord.com/api/webhooks/1115170551556755478/kdVk0PlNa4_K9KDrvsA9V_r8z7GXfIhYUd7UngtV6-tOwmdGwZPN-xXus3DXvT0RuUmX");

async function start() { 
  const eventEmitter = new EventEmitter();
  eventEmitter.on('newListener', (event, listener) => {
    logger.info(`Added ${event} listener.`);
  });
  eventEmitter.on('error', async (error) => {
 
    console.log(error);
    start();
  });
  eventEmitter.on('newtoken', async (newtoken) => {
    logger.info('Recieved a   Token       :' + newtoken.tokenName);


    const pair = await pairData(newtoken.pairAddress);
 
     try{
      const tokenTracked = {...newtoken,
        priceNative: ''+pair?.priceNative || '0',
        priceUsd: ''+pair?.priceUsd|| '0',
        pairCreatedAt: ''+pair?.pairCreatedAt || new Date().getTime(),  
        volume: ''+pair?.volume?.h24|| '0',
        marketcap: ''+pair?.fdv|| '0', 
        currVolume:''+pair?.volume?.h24|| '0',
        currmarketcap : ''+pair?.fdv || '0',
        currPrice:'',
        profit:'',
        track:true,
        blacklisted:false,
        renounced:false
      };  
      const pairduration = ((new Date().getTime() - tokenTracked.pairCreatedAt)/60000).toFixed(2)

      const embed = new MessageBuilder()
      .setTitle('BlinkoMooner Found - New Launch -'+ newtoken.tokenName)
      .setAuthor('Blinko', 'https://avatars.githubusercontent.com/u/33565557?v=4', 'https://www.google.com')
      .setURL('https://etherscan.io/token/'+newtoken.tokenAddress)
      .addField('Token Name', ''+newtoken.tokenName, true)
      .addField('TokenType', newtoken.ishp, true) 
      .addField('Liquidity ', ''+newtoken.ethLiquidity+' ETH', true)
      .addField('LPShare ', ''+newtoken.lpHoldings+' %', true)
      .addField('MarketCap ', ''+pair?.fdv, true)
      .addField('Source Verified', ''+newtoken.tokenVerified ?'YES':'NO', true)
      .addField('Token Price(usd)', ''+pair?.priceUsd, true) 
      .addField('Launched Before', ''+pairduration +' mins', true) 
      .addField('CA', ''+newtoken.tokenAddress, true) 
      .addField('CHART', ''+ "[Dexscreener](https://dexscreener.com/ethereum/"+newtoken.tokenAddress+")", true) 
      .setColor(newtoken.ishp==='HONEYPOT'?'#FF0000':newtoken.ishp==='GOOD TO TRADE'?'#008000':'#800080') 
      .setDescription('Do Not Overtrade and greedy, close the trade if no volume for more than 2 minutes.')
      .setTimestamp();  
      logger.info('Sending Message ')

      if(newtoken.ishp !== 'HONEYPOT'){

      hook.send(embed); 

      }

      const newTrade = new TokenTracker(tokenTracked);
      newTrade.save(); 
     } catch(err){
      console.log(err)
     }  
      
     console.log('Saved new token')

    
  });
  main(eventEmitter);
}

const startFunc = async()=>{
  try{
    await start();
  }catch(erro){
    logger.info('Restarting again');
    await startFunc();
  }
}


await startFunc();




