import React, { Component } from 'react';
import Hero from './Hero';
import UpcomingItems from './UpcomingItems';

//export default function Home(props) {
export default class Home extends Component {

    // state = {
    //     ResultsViewMessage: "No current message to display",
    //     ResultsViewMode: "hidden" // hidden, danger, success, warning
    // }
    componentDidMount = () => {
        // this.setState({
        //     ResultsViewMessage: this.props.ResultsViewMessage,
        //     ResultsViewMode: this.props.ResultsViewMode
        // });

        //this.setState({ ResultsViewMode: "danger" });

    }
    onChangeMessage = (ResultsViewMessage, ResultsViewMode) => {
        this.props.onChangeMessage(ResultsViewMessage, ResultsViewMode);
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
