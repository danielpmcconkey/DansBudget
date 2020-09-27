import React, { Component, Fragment } from 'react';


//export default function Home(props) {
export default class Test extends Component {


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
            <Fragment>
                <p>Testing</p>
            </Fragment>
        )
    }
}
