var Election = artifacts.require("./Election.sol");

const defaultCandidates = ['omkar','karan','rupesh','aniruddha','rohan'];
const defaultStartTime = 1617168134000;
const defaultEndTime = 1617153734000;
const title = "CR";

module.exports = function(deployer) {
  deployer.deploy(Election, defaultCandidates, defaultStartTime, defaultEndTime, title);
};
