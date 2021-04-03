import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import web3 from '../web3';
import Election from '../Election';

import {Row, Col, Container, Button, Card, ListGroup} from 'react-bootstrap';
import Loader from './Loader';

// import sd from '../selfTest';

import Info from './Info';
import HashLoader from 'react-spinners/HashLoader';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faClipboardList } from '@fortawesome/free-solid-svg-icons';


const Listing = () => {
    const [election, setElection] = useState(undefined); 
    const [candidates, setCandidates] = useState(undefined);
    const [leaderBoard, setLeaderBoard] = useState(undefined);
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
        electionDetails.status = "Ongoing";
        electionDetails.statusColor = "green";
        if(Date.now() < electionDetails.startTime){
            electionDetails.status = "Election not started yet";
            electionDetails.statusColor = "orange";
        }else if(Date.now() > electionDetails.endTime){
            electionDetails.status = "Election ended";
            electionDetails.statusColor = "red";
        }
        setElection(electionDetails);
        return electionDetails.totalCandidates;
    }

    async function fetchCandidateDetails(apiConfig, totalCandidates){
        let candidates = [];
        for(let i=0; i<totalCandidates; i++)
            candidates.push(await Election.methods.candidates(i).call(apiConfig));
        setCandidates(candidates);
        return candidates;
    }

    async function viewResults(){
        let account = (await web3.eth.getAccounts())[0];
        let results = {};
        for(let candidate of candidates)
            results[candidate] = await Election.methods.leaderBoard(candidate).call({from: account});
        console.log(results);        
    }

    async function fetchLeaderboard(apiConfig, candidates){
        let leaderboard = [];
        for(let candidate of candidates)
            leaderboard.push({
                candidate,
                votes: await Election.methods.leaderBoard(candidate).call(apiConfig)
            })
        leaderboard.sort((candidate1, candidate2) => candidate2.votes - candidate1.votes);
        setLeaderBoard(leaderboard);
    }

    async function registerVote(candidate){
        let account = (await web3.eth.getAccounts())[0];
        console.log(account);
        let result = await Election.methods.vote(candidate).send({
            from: account
        })
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
            let candidates = await fetchCandidateDetails(callConfig, candidateCount);

            const resultStatus = await Election.methods.leaderBoardStatus().call(callConfig);
            if(resultStatus)
                await fetchLeaderboard(callConfig, candidates);
        }
        setTimeout(fetchDetails, 2000);
        setInterval(fetchDetails, 30000);
    }, []);

    return (
        election ?
        <Container>
            <br/>
            <Info details={election} />
            <h4>
                {
                    leaderBoard ? "Voting results:" : "Candidates:"
                }
            </h4>
            <br/>

            <Card fluid>
            {
                leaderBoard ?
                <>
                    <ListGroup variant="flush">
                        {
                            leaderBoard.map(({candidate, votes})=>{
                                return (
                                    <>
                                        <ListGroup.Item className="text-dark" key={candidate}>
                                            <Row>
                                                <Col md={9}>
                                                    <h4>
                                                        { candidate }
                                                    </h4>
                                                </Col>
                                                <Col>
                                                    <h4>
                                                        {votes} votes
                                                    </h4>
                                                </Col>                 
                                            </Row>          
                                        </ListGroup.Item>
                                    </>        
                                )         
                            })
                        }
                    </ListGroup>
                </>
                :
                candidates ?
                <>
                    <ListGroup variant="flush">
                        {
                            candidates.map(candidate => {
                                return (
                                    <ListGroup.Item className="text-dark" key={candidate}>
                                        <Row>
                                            <Col md={9}>
                                                <h4>
                                                    <Link as={Button} className="text-body" onClick={()=>setProceedVote(candidate)}>
                                                        { candidate }
                                                    </Link>
                                                </h4>
                                            </Col>
                                            <Col>
                                                {
                                                    Date.now() < election.startTime ?
                                                    'Election not started yet' :
                                                    Date.now()  > election.endTime?
                                                    "Election finished, You can't vote" :
                                                    <Button onClick={()=>setProceedVote(candidate)}>
                                                        Vote
                                                    </Button>                                            
                                                }
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
                </>
                :
                <Loader>
                    <HashLoader color={"#13f043"} loading={true} size={150} speedMultiplier={0.2}/>
                </Loader>
            }
            </Card>
            <br/><br/><br/>                
        </Container>
        : 
        <Loader>
            <HashLoader color={"#0466cf"} loading={true} size={150} speedMultiplier={0.2}/>
        </Loader>
    )
}

export default Listing