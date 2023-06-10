import { GoPlusLabs } from "@normalizex/gopluslabs-api";
import { getContractSrc } from "./src/lib/helper.js";


 getContractSrc("0x0843FE2e8b8087B02089486F8c79AB375c38beB9").then((resp)=>{

     console.log(resp);
 })