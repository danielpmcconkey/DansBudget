import React, { Fragment } from 'react';
import Hero from './Hero';
import HomeContent from './HomeContent';
import UpcomingItems from './UpcomingItems';

export default function Home(props) {
    return (
        <Fragment>
            <Hero auth={props.auth} />
            <div className="box cta">
                <div className="has-text-centered">
                    <UpcomingItems auth={props.auth} />
                </div>
            </div>
            <HomeContent />
        </Fragment>
    )
}
