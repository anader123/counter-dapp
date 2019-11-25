const Counter = artifacts.require("Counter");

module.exports = async function(deployer) {
  await deployer.deploy(Counter);
};