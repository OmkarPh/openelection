import web3 from './web3';
import electionBuild from './contractBuild/Election.json';

const address = electionBuild.networks[Object.keys(electionBuild.networks)[0]].address;
const abi = electionBuild.abi;

export default new web3.eth.Contract(abi, address);