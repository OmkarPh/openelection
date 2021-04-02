import React from 'react';
import {Container, Button} from 'react-bootstrap';
import web3 from '../web3';
import Election from '../Election';

const Admin = () => {
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

    return (
        <Container>
            <br/>
            <Button onClick={()=>prepareResults()}>
                Prepare leaderboard
            </Button>
        </Container>
    )
}

export default Admin
