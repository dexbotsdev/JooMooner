import fetchd from "./Fetcher.js";


export const tokenSecurity = async (tokenAddress,pairAddr) => {

   // const token_security = await axios.get('https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=' + tokenAddress);

    const token_security = await fetchd('https://io.dexscreener.com/dex/pair-details/ethereum/'+pairAddr+'?security=1&tokenAddress=' + tokenAddress);
 
    console.log('Returning token_security ')
    const before = token_security;
    console.log(before)
    return before;
};
