import logger from './src/lib/logger.js';
import main from './src/service/sniper.js';
import { EventEmitter } from 'emitter';
import Parse from 'parse/node.js';
import { pairData } from './src/job/pairData.js';
import { Webhook,MessageBuilder } from 'discord-webhook-node';


const eventEmitter = new EventEmitter();
const appId="Z6R6NI8P6LR2ZIE0B9G1";
const appKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB";
const masterKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB"
const hostUrl="http://144.24.158.75:1337/parse";
Parse.initialize(appId, appKey,masterKey);
Parse.serverURL = hostUrl;
const TokenTracker = Parse.Object.extend("TokenTracker");
const hook = new Webhook("https://discord.com/api/webhooks/1114799853399199774/No_4h5_XyUS68rJmqPt7j62Nmv1ukSaNonvXukUJTiWl4P0oMFzn87L4cfJLvLO4UmFx");

async function start() {



  eventEmitter.on('newListener', (event, listener) => {
    logger.info(`Added ${event} listener.`);
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
        blacklisted:false
      };  
      
      const newTrade = new TokenTracker(tokenTracked);
      newTrade.save(); 
     } catch(err){
      console.log(err)
     }  
      
     console.log('Saved new token')

    
  });
  main(eventEmitter);
}




start();




