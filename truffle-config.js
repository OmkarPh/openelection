const HDWalletProvider = require("truffle-hdwallet-provider");
const dotenv = require('dotenv');
dotenv.config();

const mnemonic = process.env.MNEMONIC;
const infura_access_token = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
  contracts_build_directory: "./src/contractBuild",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    rinkeby: {
        provider: function() { 
          return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infura_access_token}`);
        },
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000,
    }
  }
};
