var HaraToken = artifacts.require("HaraToken");

module.exports = function(deployer) {
  deployer.deploy(HaraToken);
};