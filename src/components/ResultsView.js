import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';


export default class ResultsView extends Component {

    render() {

        return (

            <Alert
                dismissible
                variant={this.props.ResultsViewMode}>
                {this.props.ResultsViewMessage}</Alert>
        )
    }
}