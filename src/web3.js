require("dotenv").config();
const Web3 = require("web3");
const web3Provider = new Web3.providers.HttpProvider(process.env.PETHERNET_URI);
const web3 = new Web3(web3Provider);
const PethernetContractMeta = require('./contracts/PethernetContract.json');

module.exports = { 
    web3, 
    PethernetContractMeta
};