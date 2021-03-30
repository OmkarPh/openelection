var Election = artifacts.require("./Election.sol");

const defaultCandidates = ['omkar','karan','rupesh','aniruddha','rohan'];
const defaultStartTime = 1617082601;
const defaultEndTime = 1617169001;
const title = "CR";

module.exports = function(deployer) {
  deployer.deploy(Election, defaultCandidates, defaultStartTime, defaultEndTime, title);
};
