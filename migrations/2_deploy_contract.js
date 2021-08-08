const PethernetContract = artifacts.require("PethernetContract");

module.exports = function(deployer) {
  deployer.deploy(PethernetContract);
};
