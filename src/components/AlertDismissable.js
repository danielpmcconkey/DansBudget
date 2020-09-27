import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class AlertDismissible extends Component {

    render() {

        return (
            <>
                {
                    this.props.shouldAlertShow
                        ?
                        <Alert
                            variant={this.props.ResultsViewMode}
                            onClose={() => this.props.onChangeMessage("No current message to display", "light", "Empty", false)}
                            dismissible>
                            <Alert.Heading>{this.props.ResultsViewHeader}</Alert.Heading>
                            <p>{this.props.ResultsViewMessage}</p>
                        </Alert>
                        : <p className="ResultsViewNoDisplay" >Welcome to Dan's Budget</p>
                }</>
        )
    }
}

