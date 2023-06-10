import Parse from 'parse/node.js';
import { pairData } from "./pairData.js";
import { WebhookClient, EmbedBuilder } from 'discord.js';
import ethers, { BigNumber, logger, providers, Wallet } from 'ethers';
import { getContractSrc } from '../lib/helper.js';
import { tokenSecurity } from './goplusTokenData.js'; 
import honeypotChecker from './HoneyPot.js';
import getRenounceStatus from '../lib/ContractUtil.js';
import { Webhook,MessageBuilder } from 'discord-webhook-node';

const appId = "Z6R6NI8P6LR2ZIE0B9G1";
const appKey = "QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB";
const masterKey = "QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB"
const hostUrl = "http://144.24.158.75:1337/parse";
Parse.initialize(appId, appKey, masterKey);
Parse.serverURL = hostUrl;
const TokenTracker = Parse.Object.extend("TokenTracker");
const hook = new Webhook("https://discord.com/api/webhooks/1115170551556755478/kdVk0PlNa4_K9KDrvsA9V_r8z7GXfIhYUd7UngtV6-tOwmdGwZPN-xXus3DXvT0RuUmX");



const mainInterval = setInterval(() => {

    const query = new Parse.Query(TokenTracker);
    query.equalTo("track", true);
    query.addDescending("pairCreated");
    query.limit(10);
    query.find().then((resp => {
        const trackedTokens = resp;
        console.log("Successfully retrieved " + trackedTokens.length + " Tokens.");
        // Do something with the returned Parse.Object values
        for (let i = 0; i < trackedTokens.length; i++) {
            const object = trackedTokens[i].toJSON();
            pairData(object.pairAddress).then((pair) => {

                 const tokenTracked = object;
          

             

                if (tokenTracked.currVolume === 'undefined') {
                    tokenTracked.currVolume = 0;
                }


                //  if (Number(pair?.volume?.h24)>Number(tokenTracked.currVolume)) {


                var query = new Parse.Query(TokenTracker);
                query.equalTo("pairAddress", tokenTracked.pairAddress);

                query.find().then((results) => {
                    console.log('Updating values')
                    results[0].set("currVolume", '' + pair?.volume?.h24);
                    results[0].set("currPrice", '' + pair?.priceUsd);
                    results[0].set("currmarketcap", '' + pair?.fdv); 


                    if (pair?.liquidity?.usd < 10 || Number(pair?.fdv) < 10) {
                        results[0].set("marketcap", ''+pair?.liquidity?.usd); 
                        results[0].set("track", false);
                        results[0].set("blacklisted", true); 
                    }
                    if (tokenTracked.priceNative === 'undefined') {
                        results[0].set("priceNative", '' + pair?.priceNative); 
                    }



                    if (tokenTracked.pairCreatedAt === 'undefined') {
                        results[0].set("pairCreatedAt", '' + new Date().getTime());
                    }
                    if (tokenTracked.priceUsd === 'undefined') {
                        results[0].set("priceUsd", '' + pair?.priceUsd);
                    } 
                    if (tokenTracked.volume === 'undefined') {
                        results[0].set("volume", '' + pair?.volume?.h24);
                    }
                    if (tokenTracked.priceNative === 'undefined') {
                        results[0].set("currmarketcap", '' + pair?.priceNative);
                    }
                    const ITM = tokenTracked.tokenAddress;
                    tokenSecurity(ITM, tokenTracked.pairAddress).then((data) => {
                        const ts = JSON.parse(data)?.gp;
                        if (ts !== null) {

                            if (   ts.antiWhaleModifiable === true
                                || ts.cannotSellAll === true
                                || ts.canTakeBackOwnership === true
                                || ts.isBlacklisted === true
                                || ts.isHoneypot === true
                                || ts.isMintable === true
                                || ts.isProxy === true
                                || ts.slippageModifiable === true
                                || ts.transferPausable === true ) {
                                    results[0].set("track", false);
                                    results[0].set("ishp", true);
                                    results[0].set("blacklisted", true);
                            }
 
                        }
                    })


                    honeypotChecker(ITM,trackedTokens.pairAddress).then((result) => {
                        console.log('****************************** -- -')
                        console.log(result)
                         if(result && result.IsHoneypot === true){
                           results[0].set("track", false);
                            results[0].set("blacklisted", true);
                            results[0].set("ishp", true); 
                         }
    
                        console.log(results[0].toJSON())
                        results[0].save();
                    })

                    
                }).catch((error) => {
                    console.log("Error: " + error.code + " " + error.message);
                });
  

            }).catch((err) => console.log(err));


        }

    }));



}, 22000)


