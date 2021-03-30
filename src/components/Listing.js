import React, {useEffect, useState} from 'react'
import web3 from '../web3';
import Election from '../Election'

const Listing = () => {
    const [election, setElection] = useState(undefined); 
    const [candidates, setCandidates] = useState(undefined);

    useEffect(() => {
        async function tmp(){
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            const callConfig = {
                from: accounts[0],
                gas: 200000,
                gasPrice: 200000
            }

            const electionDetails = {
                title: await Election.methods.title().call(callConfig),
                startTime: await Election.methods.startTime().call(callConfig),
                endTime: await Election.methods.endTime().call(callConfig),
                totalCandidates: await Election.methods.candidateCount().call(callConfig),
                resultsOut: await Election.methods.leaderBoardStatus().call(callConfig),
                isOwner: await Election.methods.isOwner().call(callConfig)
            };
            setElection(electionDetails);
            console.log(electionDetails);

            let candidates = [];
            for(let i=0; i<electionDetails.totalCandidates; i++)
                candidates.push(await Election.methods.candidates(i).call(callConfig));
            setCandidates(candidates);
            console.log(candidates);
        }
        tmp();
        return () => {
            // cleanup
        }
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Listing