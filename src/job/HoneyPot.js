import fetchd from "./Fetcher.js";
import axios from "axios";


const honeypotChecker = async (tokenAddress, pairAddress) => {

    const result = await axios.get('https://api.honeypot.is/v1/IsHoneypot?pair=' + pairAddress + '&router=0x7a250d5630b4cf539739df2c5dacb4c659f2488d&chainID=1&address=' + tokenAddress).then(resp=>resp)
    .catch(error=>{console.log(error    )});

     return result?.data;
}

export default honeypotChecker;