import axios from 'axios';
import { load } from 'cheerio';

const url = 'https://www.dexanalyzer.io/eth/0x823f5d8343926a4154e7C42e62F30db4dc4491f2#';

axios.get(url)
  .then(response => {
    if (response.status === 200) {
      const html = response.data;
      const $ = load(html);

      // Use Cheerio selectors to extract the desired information from the HTML
      // For example:
      const tokenName = $().text();
      const tokenSymbol = $('.token-symbol').text();

      console.log('Token Name:', $.html());
      console.log('Token Symbol:', tokenSymbol);

      // Continue extracting other relevant information as needed

    } else {
      console.log('Error:', response.status);
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
 


 

//const data2= await get('https://api.dexanalyzer.io/full/eth/0x8450f31AB1ce21100b99c13c07eC8785eB02FAe7')
// await axios.get('https://api.moonarch.app/1.0/tokens/ETH/details/0x3e544eec1fde17fa17da148bbcfad9be2003e838')
//await axios.get('https://api.moonarch.app/1.0/tokens/ETH/details/0x823f5d8343926a4154e7C42e62F30db4dc4491f2')
//console.log(data2)
 


