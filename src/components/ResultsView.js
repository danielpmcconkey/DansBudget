import React, { Component, Fragment } from 'react';


export default class ResultsView extends Component {

    state = {
        message: "",
        mode: "danger",
    }
    componentDidMount = () => {
        this.setState({
            message: this.props.message,
            mode: this.props.mode
        });
    }

    render() {
        return (
            <Fragment>
                {this.state.mode === "danger" ?
                    <article className="message is-danger">
                        <div className="message-header">
                            <p>Error</p>
                        </div>
                        <div className="message-body">
                            {this.state.message}
                        </div>
                    </article>
                    :
                    this.state.mode === "success" ?
                        <article className="message is-success">
                            <div className="message-header">
                                <p>Success</p>
                            </div>
                            <div className="message-body">
                                {this.state.message}
                            </div>
                        </article>
                        :
                        this.state.mode === "warning" ?
                            <article className="message is-warning">
                                <div className="message-header">
                                    <p>Warning</p>
                                </div>
                                <div className="message-body">
                                    {this.state.message}
                                </div>
                            </article>
                            :
                            <p className="ResultsViewNoDisplay">{this.state.message}</p>
                }
            </Fragment>
        )
    }
}