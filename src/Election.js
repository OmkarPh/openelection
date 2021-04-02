import web3 from './web3';
import electionBuild from './contractBuild/Election.json';

const address = electionBuild.networks[Object.keys(electionBuild.networks)[0]].address;
const abi = electionBuild.abi;

// const myContract = new web3.eth.Contract(abi);
// myContract.options.address = address;
// export default myContract;

export default new web3.eth.Contract(abi, address);