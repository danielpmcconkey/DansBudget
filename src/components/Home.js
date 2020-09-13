import React, { Fragment } from 'react';
import Hero from './Hero';
import HomeContent from './HomeContent';

export default function Home(props) {
    return (
        <Fragment>
            <Hero auth={props.auth} />
            <div className="box cta">
                <p className="has-text-centered">

                    Placeholder text
        </p>
            </div>
            <HomeContent />
        </Fragment>
    )
}
