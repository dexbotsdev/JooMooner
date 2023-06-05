import Parse from 'parse/node.js';
import { pairData } from "./pairData.js";
import { WebhookClient, EmbedBuilder } from 'discord.js';
import ethers, { BigNumber, providers, Wallet } from 'ethers';
import { getContractSrc } from '../lib/helper.js';

const appId="Z6R6NI8P6LR2ZIE0B9G1";
const appKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB";
const masterKey="QCS13J3VY5P6C0SV9CXFW24P8CQQ3RS8EQCX3LHB"
const hostUrl="http://144.24.158.75:1337/parse";
Parse.initialize(appId, appKey,masterKey);
Parse.serverURL = hostUrl;
const TokenTracker = Parse.Object.extend("TokenTracker");
 

 
const mainInterval = setInterval(() => {
 
    const query = new Parse.Query(TokenTracker);
    query.equalTo("track", true);
    query.limit(300);
    query.find().then((resp => {
        const trackedTokens = resp; 
        console.log("Successfully retrieved " + trackedTokens.length + " Tokens.");
        // Do something with the returned Parse.Object values
        for (let i = 0; i < trackedTokens.length; i++) {
            const object = trackedTokens[i].toJSON();
             pairData(object.pairAddress).then((pair) => {

 
                for (var i = 0; i < 5000; i++) {

                }

                const tokenTracked = object;

                const renounced = pair.owner==='R'? 'Yes':'No';

                if(tokenTracked.currVolume=== 'undefined'){
                    tokenTracked.currVolume=0;
                }                        
                
                console.log(tokenTracked)

                if (Number(pair?.volume?.h24)>Number(tokenTracked.currVolume)) {


                    var query = new Parse.Query(TokenTracker);
                    query.equalTo("pairAddress", tokenTracked.pairAddress); 

                    query.find().then((results) => {
                        console.log('Updating values')
                        results[0].set("currVolume", ''+pair?.volume?.h24);
                        results[0].set("currPrice", ''+pair?.priceUsd);
                        results[0].set("currmarketcap", ''+pair?.fdv);


                        if(pair?.liquidity?.usd < 10 || Number(pair?.fdv)<10){
                            results[0].set("track", false); 
                        }

                        if(tokenTracked.priceNative=== 'undefined'){
                            results[0].set("priceNative", ''+pair?.priceNative); 
                        }
                        if(tokenTracked.pairCreatedAt=== 'undefined'){
                            results[0].set("pairCreatedAt", ''+new Date().getTime()); 
                        }
                        if(tokenTracked.priceUsd=== 'undefined'){
                            results[0].set("priceUsd", ''+pair?.priceUsd); 
                        }
                        if(tokenTracked.marketcap=== 'undefined'){
                            results[0].set("marketcap", ''+pair?.fdv); 
                        }
                        if(tokenTracked.volume=== 'undefined'){
                            results[0].set("volume", ''+pair?.volume?.h24); 
                        }
                        if(tokenTracked.priceNative=== 'undefined'){
                            results[0].set("currmarketcap", ''+pair?.priceNative); 
                        }
                        results[0].save();
                      }).catch((error) =>  {
                        console.log("Error: " + error.code + " " + error.message);
                    });
 


                    try {


                        const embed = {
                            "channel_id": `1111242221673525281`,
                            "username": "JooMooner",
                            "content": 'Token Trending ' + tokenTracked.tokenName,
                            "tts": true,
                            "nonce": "32",
                            "embeds": [
                                {
                                    "type": "rich",
                                    "title": ` ${tokenTracked.tokenName}`,
                                    "description": "Address: " + tokenTracked.tokenAddress + "\n\n  DYOR before Investing in a Token, Crypto-Pi Is Not Responsible for any Honeypots you invest in \n\n",
                                    "color": 0x55ff00,
                                    "fields": [
                                        {
                                            "name": `Token Symbol`,
                                            "value": tokenTracked.tokenName,
                                            "inline": true
                                        },
                                        {
                                            "name": `Token Created`,
                                            "value": new Date(pair?.pairCreatedAt).toLocaleDateString(),
                                            "inline": true
                                        },
                                        {
                                            "name": `Token Liquidity (ETH)`,
                                            "value": "" + tokenTracked.ethLiquidity,
                                            "inline": true
                                        },
                                        {
                                            "name": `Launch Price (usd)`,
                                            "value": "" + tokenTracked.priceUsd,
                                            "inline": true
                                        },
                                        {
                                            "name": `Current Price (usd)`,
                                            "value": "" + pair.priceUsd,
                                            "inline": true
                                        },
                                        {
                                            "name": `Token MarketCap (24Hrs)`,
                                            "value": "" + tokenTracked.marketcap,
                                            "inline": true
                                        },
                                        {
                                            "name": `New MarketCap (24Hrs)`,
                                            "value": "" + pair.fdv,
                                            "inline": true
                                        },
                                        {
                                            "name": `Token Volume`,
                                            "value": "" + tokenTracked.volume,
                                            "inline": true
                                        },
                                        {
                                            "name": `New Volume`,
                                            "value": "" + pair?.volume?.h24,
                                            "inline": true
                                        },
                                        {
                                            "name": `Token Renounced`,
                                            "value": "" + renounced,
                                            "inline": true
                                        }
                                    ],
                                    "url": 'https://dexscreener.com/ethereum/' + tokenTracked.pairAddress
                                }
                            ]
                        };
                             webhookClient.send(embed)
                                .then(() => {
                                    console.log('Sent webhook successfully!')

                                 }
                                )
                                .catch(err => console.log(err));
                    } catch (err) {
                        console.log(err)
                    }

                }

               

            }).catch((err) => console.log(err.message));


        }

    }));



}, 30000)


