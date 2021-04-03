import React, {useEffect, useState} from 'react';
import {Container, Button, Row, Col} from 'react-bootstrap';



function formatDateTime(timestamp){
    timestamp = Number(timestamp);
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    let date = new Date(timestamp);
    return `${date.toLocaleDateString(undefined, dateOptions)} - ${date.toLocaleTimeString([], timeOptions)}`;
}

const Info = ({details: {title, statusColor, status, startTime, endTime}}) => {
    return (
        <>
            <h3>
                {title}
            </h3>
            <h6 style={{color: statusColor}}>
                {status}
            </h6>
            <Row>
                <Col sm={9}>
                    <br/>
                        <h5> { startTime > new Date() ? 'Starts from ' : 'Started on '} </h5>
                        <h4>
                        { formatDateTime(startTime) }
                        </h4>
                        <br/>
                        <h5>{ endTime > new Date() ? 'Ending on ' : 'Ended on '}</h5>
                        <h4>
                        { formatDateTime(endTime) }
                        </h4>
                </Col>
            </Row>
            <br/><br/>
        </>
    )
}

export default Info
