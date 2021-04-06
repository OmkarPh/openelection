import React, {useEffect, useState} from 'react';
import {Container, Button, Form, FormGroup, Modal} from 'react-bootstrap';
import web3 from '../web3';
import Election from '../Election';

import Loader from './Loader';
import HashLoader from 'react-spinners/HashLoader';

import Info from './Info';
import CandidateInput from './CandidateInput';

const Admin = () => {
    const [details, setDetails] = useState(undefined);

    const [preparingResults, setPreparingResults] = useState(false);
    const [canPrepareResults, setCanPrepareResults] = useState(true);
    const [resetting, setResetting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalDetails, setModal] = useState({title: 'Error !!', message: 'Error message'});
    const setModalDetails = (title, message="") => {
        setModal({title, message});
        setShowModal(true);
    };


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

        if(electionDetails.resultsOut)
            setCanPrepareResults(false);
        else if(Date.now() < electionDetails.endTime)
            setCanPrepareResults(false);

        setDetails(electionDetails);
    }

    async function prepareResults(){
        try{
            setPreparingResults(true);
            let account = (await web3.eth.getAccounts())[0];
            await Election.methods.displayLeaderboard().send({from: account});
            setPreparingResults(false);
            window.location.reload();
        }catch(error){
            console.log(error);
            if(error.code && error.code === 4001)
                setModalDetails("Permission denied !", error.message);
            else
                setModalDetails("Request rejected by contract", error.message.split('\n')[0]);
            setPreparingResults(false);
        }
    }

    async function resetEverything(){
        try{
            setResetting(true);
            let account = (await web3.eth.getAccounts())[0];
            await Election.methods.reset().send({from: account});
            setResetting(false);
            window.location.reload();
        }catch(error){
            console.log(error);
            if(error.code && error.code === 4001)
                setModalDetails("Permission denied !", error.message);
            else
                setModalDetails("Request rejected by contract", error.message.split('\n')[0]);
            setResetting(false);
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

    console.log(details);
    return (
        details ?
        <Container>
            <br/>
            <Info details={details} />
            Leader board status: &nbsp;&nbsp;
            <span style={{color:details.statusColor}}>
               {details.status}
            </span>
            <br/><br/>

            <Button onClick={prepareResults} disabled={preparingResults || !canPrepareResults}>
                {
                    preparingResults ? "Preparing results..." : "Prepare results"
                }                
            </Button>
            <br/><br/>
            {
                details.resultsOut ?
                    <>
                        <Button onClick={resetEverything} disabled={resetting}>
                            {
                                resetting ? "Resetting in progress ..." : "Reset everything"
                            }
                            <br/>
                        </Button>
                        <CandidateInput />
                    </>
                : 
                "Previous election results must be processed to reset / restart a new election"
            }
            <Modal show={showModal} onHide={()=>setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalDetails.title}</Modal.Title>
                </Modal.Header>
                    <Modal.Body>{modalDetails.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        :
        <Loader>
            <HashLoader color={"#0466cf"} loading={true} size={150} speedMultiplier={0.2}/>
        </Loader>
    )
}

export default Admin
