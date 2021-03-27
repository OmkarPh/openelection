var Election = artifacts.require('./Election.sol');

const defaultCandidates = ['omkar','karan','rupesh','aniruddha','rohan'];
const defaultStartTime = 1616826600;
const defaultEndTime = 1616827800;
const title = "CR";

contract("Election", function(accounts){
    describe("Election", ()=>{

        it("initializes with correct default values", async ()=>{
            let instance = await Election.deployed();
            let candidateCount = await instance.candidateCount();
            assert.equal(defaultCandidates.length, candidateCount);
        })

    });
})