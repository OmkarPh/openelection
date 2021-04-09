import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

// window.ethereum.enable();

// export default new Web3(window.web3.currentProvider);

const mnemonic = process.env.REACT_APP_MNEMONIC;
const infura_access_token = process.env.REACT_APP_INFURA_ACCESS_TOKEN;

let web3, provider;
if(typeof window.web3 !== 'undefined'){
    // Metamask or other provider has already injected web3
    provider = window.web3.currentProvider;
    web3 = new Web3(provider);
    window.ethereum.enable();
    console.log('Using injected web3')
 }else{ 
    console.log('Using web3 hdwallet')
    provider = new HDWalletProvider({
            mnemonic: {
                phrase: mnemonic
            },
            providerOrUrl: `https://rinkeby.infura.io/v3/${infura_access_token}`
        });      
    web3 = new Web3(provider);
    console.log('Using hdwallet provider')
}
export default web3;