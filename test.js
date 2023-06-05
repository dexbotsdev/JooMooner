import { GoPlusLabs } from "@normalizex/gopluslabs-api";


const gp = new GoPlusLabs();


gp.tokenSecurity(1,"0x119aab144a3fa2a0b26bbbd94bc22e05c590ef50").then(result=>{

    console.log(Object.values(result)[1])
})

