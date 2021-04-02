import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import web3 from '../web3';
import Election from '../Election';

import {Row, Col, Container, Button, Card, ListGroup} from 'react-bootstrap';
import Loader from './Loader';

// import sd from '../selfTest';

import HashLoader from 'react-spinners/HashLoader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

function formatDateTime(timestamp){
    timestamp = Number(timestamp);
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    let date = new Date(timestamp);
    return `${date.toLocaleDateString(undefined, dateOptions)} ${date.toLocaleTimeString([], timeOptions)}`;
}

const Listing = () => {
    const [election, setElection] = useState(undefined); 
    const [candidates, setCandidates] = useState(undefined);
    const [proceedVote, setProceedVote] = useState('');

    async function fetchElectionDetails(apiConfig){
        const electionDetails = {
            title: await Election.methods.title().call(apiConfig),
            startTime: Number(await Election.methods.startTime().call(apiConfig)),
            endTime: Number(await Election.methods.endTime().call(apiConfig)),
            totalCandidates: await Election.methods.candidateCount().call(apiConfig),
            resultsOut: await Election.methods.leaderBoardStatus().call(apiConfig),
            isOwner: await Election.methods.isOwner().call(apiConfig)
        };
        setElection(electionDetails);
        return electionDetails.totalCandidates;
    }

    async function fetchCandidateDetails(apiConfig, totalCandidates){
        let candidates = [];
        for(let i=0; i<totalCandidates; i++)
            candidates.push(await Election.methods.candidates(i).call(apiConfig));
        setCandidates(candidates);
    }

    async function registerVote(candidate){
        let account = (await web3.eth.getAccounts())[0];
        console.log(account);
        let result = await Election.methods.vote(candidate).send({
            from: account
        })
    }
    async function viewResultStatus(){
        let account = (await web3.eth.getAccounts())[0];
        const result = await Election.methods.leaderBoardStatus().call({from: account});
        alert(`Leaderboard status: ${result ? "Results out" : "Results not ready"}`);
    }
    async function viewResults(){
        let account = (await web3.eth.getAccounts())[0];
        let results = {};
        for(let candidate of candidates)
            results[candidate] = await Election.methods.leaderBoard(candidate).call({from: account});
        console.log(results);        
    }
    useEffect(() => {
        async function fetchDetails(){
            const accounts = await web3.eth.getAccounts();

            const callConfig = {
                from: accounts[0],
                gas: 200000,
                gasPrice: 200000
            }

            let candidateCount = await fetchElectionDetails(callConfig);
            await fetchCandidateDetails(callConfig, candidateCount);
        }
        setTimeout(fetchDetails, 2000);
    }, []);

    return (
        election ?
        <Container>
            <br/>
            <h3>
                {election.title}
            </h3>
            <Row>
                <Col sm={10}>
                    <p>
                        { election.startTime > new Date() ? 'Starts from ' : 'Started on '}
                        { formatDateTime(election.startTime) }
                        <br/>
                        { election.endTime > new Date() ? 'Ending on ' : 'Ended on '}
                        { formatDateTime(election.endTime) }
                    </p>
                </Col>
                <Col sm={2}>
                    {/* <Button disabled={!election.resultsOut}> */}
                    <Button onClick={()=>viewResults()}>
                        View results &nbsp;
                        <FontAwesomeIcon icon={faClipboardList} />
                    </Button>
                    <Button onClick={()=>viewResultStatus()}>
                        Get leaderboard status
                    </Button>
                </Col>
            </Row>
            <br/><br/>
            <h4>Candidates:</h4>
            <br/>
            {
                candidates ?
                <Card fluid>
                    <ListGroup variant="flush">
                        {
                            candidates.map(candidate => {
                                return (
                                    <ListGroup.Item className="text-dark" key={candidate}>
                                        <Row>
                                            <Col md={10}>
                                                <h4>
                                                    <Link as={Button} className="text-body" onClick={()=>setProceedVote(candidate)}>
                                                        { candidate }
                                                    </Link>
                                                </h4>
                                            </Col>
                                            <Col sm={2}>
                                                <Button onClick={()=>setProceedVote(candidate)}>Vote</Button>
                                            </Col>
                                        </Row>
                                        {
                                            proceedVote == candidate ?
                                            <Container>
                                                <br/>
                                                Note: You can only vote once with a given address !
                                                &nbsp;&nbsp;
                                                <Button onClick={()=>registerVote(candidate)}>
                                                    Proceed to vote
                                                </Button>
                                                
                                            </Container>
                                            : null
                                        }
                                        
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </Card>
                :
                <Loader>
                    <HashLoader color={"#13f043"} loading={true} size={150} speedMultiplier={0.2}/>
                </Loader>
            }
        </Container>
        : 
        <Loader>
            <HashLoader color={"#0466cf"} loading={true} size={150} speedMultiplier={0.2}/>
        </Loader>
    )
}

export default Listing