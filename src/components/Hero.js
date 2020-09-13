import React from 'react';
import WealthAreaChart from './WealthAreaChart';



export default function Hero(props) {

    return (
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    <WealthAreaChart auth={props.auth} />
                </div>
            </div>
        </section>


    )
}
