var Election = artifacts.require("./Election.sol");

const defaultCandidates = ['omkar','karan','rupesh','aniruddha','rohan'];
const defaultStartTime = 1616826600;
const defaultEndTime = 1616827800;
const title = "CR";

module.exports = function(deployer) {
  deployer.deploy(Election, defaultCandidates, defaultStartTime, defaultEndTime, title);
};
