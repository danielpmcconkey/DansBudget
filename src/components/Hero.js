import React from 'react';
import WealthAreaChart from './WealthAreaChart';
import { Jumbotron, Container } from 'react-bootstrap';




export default function Hero(props) {

    return (
        <Jumbotron fluid className="hero">
            <Container className="hero-body">
                <h1>Track how your net worth grows</h1>
                <WealthAreaChart auth={props.auth} />
            </Container>
        </Jumbotron>
    )
}
