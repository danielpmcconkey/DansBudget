import React, { Component } from 'react';
import Hero from './Hero';
import UpcomingItems from './UpcomingItems';

export default class Home extends Component {


    onChangeMessage = (ResultsViewMessage, ResultsViewMode, ResultsViewHeader, shouldAlertShow) => {
        this.props.onChangeMessage(ResultsViewMessage, ResultsViewMode, ResultsViewHeader, shouldAlertShow);
    }

    render() {
        return (
            <>
                <Hero fluid auth={this.props.auth} onChangeMessage={this.onChangeMessage} />
                <div className="box cta">
                    <div className="has-text-centered">
                        <UpcomingItems auth={this.props.auth} onChangeMessage={this.onChangeMessage} />
                    </div>
                </div>
            </>
        )
    }
}
