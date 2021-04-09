import React, {useState} from 'react'
import {Container, Button, Form, FormGroup, Modal} from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';

const CandidateInput = ({submitElection, restarting}) => {

    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now()+1800000));

    const [candidateUsername, setCandidateUsername] = useState('');
    const [newCandidates, setNewCandidates] = useState([]);

    const addNewCandidate = () => {
        let newCandidate = candidateUsername.trim();
        if(newCandidate === "")
            return alert('Invalid username provided !!');
        if(newCandidates.includes(newCandidate))
            return alert(`Username already in the list ! Two or more users can't share the same username`);
        setNewCandidates(candidates => [...candidates, newCandidate]);
        setCandidateUsername('');
    }
    const removeCandidate = (candidate) => {
        if(candidate === "")
            return alert('Invalid username provided !!');
        console.log('Removing');
        setNewCandidates(candidates => candidates.filter(username => username !== candidate));
    }

    const submitForm = () => {
        submitElection({
            title,
            candidates: newCandidates,
            startTime: startTime.getTime(),
            endTime: endTime.getTime()
        })
    }


    return (
        <Container>
            <Form onSubmit={e=>{
                // submitForm();
                e.preventDefault();
            }}>
                <FormGroup className="p-3">
                    Election title: 
                    <Form.Control 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required />
                    <br/>    
                    New Candidates:
                    <Form.Control 
                        value={candidateUsername}
                        onChange={e => setCandidateUsername(e.target.value)}
                        type="text" 
                        placeholder="Enter candidate's username"
                        onKeyDown={e => {
                            if(e.key === 'Enter'){
                                addNewCandidate();
                                e.preventDefault();
                            }
                        }} 
                    />
                    <Button 
                        onClick={addNewCandidate}
                        variant="success">
                        Add +
                    </Button>
                    <ol>
                        {
                            newCandidates.map(newCandidate => {
                                return (
                                    <li>
                                        {newCandidate} &nbsp;&nbsp;
                                        <button onClick={()=>removeCandidate(newCandidate)}>Remove</button> 
                                    </li>
                                );
                            })
                        }
                    </ol>
                    Start election on
                    <DateTimePicker
                        onChange={setStartTime}
                        value={startTime}
                    />
                    <br/>
                    End election on
                    <DateTimePicker
                        onChange={setEndTime}
                        value={endTime}
                    />

                    <Button onClick={submitForm} type="submit">
                        Restart Election
                    </Button>            
                </FormGroup>
            </Form>

        </Container>
    )
}

export default CandidateInput
