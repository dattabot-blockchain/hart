var HDWalletProvider = require("truffle-hdwallet-provider"); 
var mnemonic = process.env.MNEMONIC;

require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require('babel-polyfill');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: process.env.DEVELOPMENT_HOST,
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4700000
    },
    rinkeby: {
      provider: function() { 
               return new HDWalletProvider(mnemonic, process.env.RINKEBY_HOST) 
             },
      network_id: 4, // Match any network id
      gas: 4700000,
      from: process.env.ADDRESS
    },
  },
  solc: {
   optimizer: {
     enabled: true,
     runs: 200
   }
 }
};
