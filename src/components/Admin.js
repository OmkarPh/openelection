import React, {useEffect, useState} from 'react';
import {Container, Button, Form, FormGroup} from 'react-bootstrap';
import web3 from '../web3';
import Election from '../Election';

import Loader from './Loader';
import HashLoader from 'react-spinners/HashLoader';

import Info from './Info';

const Admin = () => {
    const [details, setDetails] = useState(undefined);

    async function fetchDetails(apiConfig){
        const electionDetails = {
            title: await Election.methods.title().call(apiConfig),
            startTime: Number(await Election.methods.startTime().call(apiConfig)),
            endTime: Number(await Election.methods.endTime().call(apiConfig)),
            totalCandidates: await Election.methods.candidateCount().call(apiConfig),
            resultsOut: await Election.methods.leaderBoardStatus().call(apiConfig),
            isOwner: await Election.methods.isOwner().call(apiConfig)
        };
        electionDetails.status = "Ongoing";
        electionDetails.statusColor = "green";
        if(Date.now() < electionDetails.startTime){
            electionDetails.status = "Election not started yet";
            electionDetails.statusColor = "orange";
        }else if(Date.now() > electionDetails.endTime){
            electionDetails.status = "Election ended";
            electionDetails.statusColor = "red";
        }
        console.log(electionDetails);
        setDetails(electionDetails);
    }

    async function prepareResults(){
        try{
            let account = (await web3.eth.getAccounts())[0];
            await Election.methods.displayLeaderboard().send({from: account});
            console.log('Preparing leaderboard...');
        }catch(error){
            console.log(error);
            console.log(error.message);
            console.log(typeof error.message);
            alert(error.message.split('\n')[0]);
        }
    }

    useEffect(()=>{
        async function fetch(){
            const accounts = await web3.eth.getAccounts();
            const callConfig = {
                from: accounts[0],
                gas: 200000,
                gasPrice: 200000
            }

            await fetchDetails(callConfig);
        }
        fetch();
    }, []);

    return (
        details ?
        <Container>
            <br/>
            <Info details={details} />
            Leader board status: {}
            <Button onClick={()=>prepareResults()}>
                Prepare leaderboard
            </Button>
            <br/>
            <Button>
                Reset everything
            </Button>
            <br/>
            <FormGroup>
            
            </FormGroup>
            <Button>
                Restart Election
            </Button>
        </Container>
        :
        <Loader>
            <HashLoader color={"#0466cf"} loading={true} size={150} speedMultiplier={0.2}/>
        </Loader>
    )
}

export default Admin
