
const analyzeHp = (src)=>{

    const text = src.toLowerCase();
    let hpFlag=false;
    const stringsToCheck = [
        "transferdelayenabled",
        "_preventswapbefore",
        "tradingopen",
        "swapenabled",
        "manualswap",
        "servicepayer",
        "setaccounting",
        "approved",
        "setfees",
        "feesupdated",
        "removelimits", 
        "libraryaddress",
        "renounceownrship",
        "ownr",
        "_rewardsapplied",
        "adjusted",
        "analyze",
        "pppoopoo",
        "suckmydick"
      ];


      const regex = new RegExp(stringsToCheck.join("|"));

      if (regex.test(text)) {
        hpFlag = true;
      } else {
        hpFlag =false;
      }

      return hpFlag;


}


export default analyzeHp;