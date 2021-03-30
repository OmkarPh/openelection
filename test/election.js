var Election = artifacts.require('./Election.sol');

const defaultCandidates = ['omkar','karan','rupesh','aniruddha','rohan'];
const defaultStartTime = 1616826600;
const defaultEndTime = 1616827800;
const title = "CR";

contract("Election", function(accounts){
    describe("Election", ()=>{
        it("initializes with correct default values", async ()=>{
            let instance = await Election.deployed();
            
            for(let i=0; i<defaultCandidates.length; i++)
                assert.equal(defaultCandidates[i], await instance.candidates(i));                
            assert.equal(defaultCandidates.length, await instance.candidateCount());
            assert.equal(title, await instance.title());
            assert.equal(defaultStartTime, await instance.startTime());
            assert.equal(defaultEndTime, await instance.endTime());
        });
    });
})