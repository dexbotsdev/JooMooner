import { Contract,  providers  } from 'ethers';
import { ERC20ABI } from './src/abis/index.js'; 
import { UniswapPairABI } from './src/abis/index.js';
import { getContractSrc } from './src/lib/helper.js';
import { formatEther } from 'ethers/lib/utils.js';
const provider = new providers.WebSocketProvider("wss://eth-mainnet.nodereal.io/ws/v1/c39cf5b992844862a28cf386f68d310e")

const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"

const tokenAddress="0xAE2E4b1458C1C9E14d3F28FE287b4c2aB351f9B7";
const pairAddress="0x3040E6a82c1B093836357282da24F6b6570f6A3A";
const wethAddress="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";


const getAllData= async (tokenAddress,pairAddress,wethAddress)=>{


	let ethContract = new Contract(wethAddress, ERC20ABI, provider);
	let tokenContract = new Contract(tokenAddress, ERC20ABI, provider);
	let pairContract = new Contract(pairAddress, UniswapPairABI.abi, provider);

const getOwner = async()=>{
	try {
		const value = await tokenContract.owner()
		return value
	} catch (e) {
		return null;
	}
}

const tokenName = async()=>{
	try {
		const value = await tokenContract.name()
		return value
	} catch (e) {
		return null;
	}
}
const getdecimals = async()=>{
	try {
		const value = await tokenContract.decimals()
		return value
	} catch (e) {
		return null;
	}
}
const symbol = async()=>{
	try {
		const value = await tokenContract.symbol()
		return value
	} catch (e) {
		return null;
	}
}
const ownerTokenBalance = async(owner)=>{
	try {
		const value = await tokenContract.balanceOf(owner)
		return value
	} catch (e) {
		return null;
	}
}
const ownerPairBalance = async(owner)=>{
	try {
		const value = await pairContract.balanceOf(owner)
		return value
	} catch (e) {
		return null;
	}
}

const totalSupply = async()=>{
	try {
		const value = await tokenContract.totalSupply()
		return value
	} catch (e) {
		return null;
	}
}
const pairTokenBalance = async()=>{
	try {
		const value = await tokenContract.balanceOf(pairAddress)
		return value
	} catch (e) {
		return null;
	}
}
const pairEthLiquidity = async()=>{
	try {
		const value = await ethContract.balanceOf(pairAddress)
		return value
	} catch (e) {
		return null;
	}
}


let owner = await getOwner();
let decimals = await getdecimals();
let src = await getContractSrc(tokenAddress);
console.log("Owner is "+ await getOwner())
console.log("Token Name is "+ await tokenName())
console.log("decimals is "+ decimals)
console.log("Token ownerBalance is "+ await ownerTokenBalance(owner))
console.log("Pair ownerBalance is "+ await ownerPairBalance(owner))
console.log("Token Supply is "+ await totalSupply())	
console.log("TokenBalance in Pair is "+ await pairTokenBalance())
console.log("Liquidity Added in Pair is "+ formatEther(await pairEthLiquidity()))
console.log("Liquidity POOL is  "+ 100 * (await pairTokenBalance()/await totalSupply()).toFixed(2))
console.log("Owner Token Balance is  "+ 100 * (await ownerTokenBalance(owner)/await totalSupply()).toFixed(2))
//console.log(src.data.result[0].SourceCode)
process.exit(0)


}


await getAllData(tokenAddress,pairAddress,wethAddress);




