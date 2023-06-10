
const analyzeHp = (src)=>{

    const text = src.toLowerCase();
    let hpFlag=false;
    let fattokenFlag=false;
    const hpCheck = [ 
        "servicepayer",
        "setaccounting",
        "approved", 
        "feesupdated", 
        "libraryaddress",
        "renounceownrship",
        "ownr",
        "_rewardsapplied",
        "adjusted",
        "analyze",
        "pppoopoo",
        "suckmydick",
        "_fffklist",
        "_allowances[sender][msg.sender]",
        "_allowances[sender][_msgSender()]"
      ];
const fattokenCheck = [
        "transferdelayenabled",
        "_preventswapbefore",
        "tradingopen",
        "swapenabled",
        "manualswap",  
        "setselfees",
        "feesupdated",
        "removelimits", 
      ];

      const regexA = new RegExp(hpCheck.join("|"));
      const regexB = new RegExp(fattokenCheck.join("|"));

      if (regexA.test(text)) {
        hpFlag = true;
      } else {
        hpFlag =false;
      }

      if (regexB.test(text)) {
        fattokenFlag = true;
      } else {
        fattokenFlag =false;
      }

      let tokenType = 'CLEAN';

      if(hpFlag && fattokenFlag){
        tokenType = 'HONEYPOT'
      } else if(hpFlag && !fattokenFlag){
        tokenType = 'HONEYPOT'
      } else if (!hpFlag && fattokenFlag){
        tokenType='FATTOKEN (Use AstroSniper)'
      } else if (!hpFlag && !fattokenFlag){
        tokenType='GOOD TO TRADE'
      }

      return tokenType;
}


export default analyzeHp;