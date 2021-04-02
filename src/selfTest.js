import Web3 from 'web3';



const address = "0x0092876a32cECFF4AdE06792FC1E473E16454960";
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "setMessage",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


async function test(){
    console.log('Testing');

    const web3 = new Web3(window.web3.currentProvider);
    await window.ethereum.enable();
    const inboxContract = new web3.eth.Contract(abi, address);

    let account = (await web3.eth.getAccounts())[0];
    console.log(`Accessing acount ${account}`);
    const newMessage = `nm ${Date.now()}`
    console.log(`Setting message in this instance: ${newMessage}`)
    console.log(await inboxContract.methods.message().call({from: account}));
    console.log(await inboxContract.methods.setMessage(newMessage).send({from: account}));
    setTimeout(async ()=>{
        console.log(`Verifying new message, it must be ${newMessage}`);
        console.log(await inboxContract.methods.message().call({from: account}));
    }, 10000);
    console.log('Escaping tests');
}
test();



export default 3;