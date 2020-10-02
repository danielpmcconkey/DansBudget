import React from 'react';
import WealthAreaChart2 from './WealthAreaChart2';
import { Jumbotron, Container } from 'react-bootstrap';




export default function Hero(props) {

    return (
        <Jumbotron fluid className="hero">
            <Container className="hero-body">
                <h1>Track how your wealth grows</h1>
                <WealthAreaChart2 auth={props.auth} />
            </Container>
        </Jumbotron>
    )
}
