 
const isWalletBlockerFound= (src)=>{

const text = src.toLowerCase();

if(text.indexOf('multicall')>0 && text.indexOf('rewards')>0) return true;
else return false;

}

export default isWalletBlockerFound;