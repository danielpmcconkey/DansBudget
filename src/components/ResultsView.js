import React, { Component, Fragment } from 'react';


export default class ResultsView extends Component {

    // state = {
    //     ResultsViewMessage: "Original message",
    //     ResultsViewMode: "danger",
    // }
    // componentDidMount = () => {
    //     this.setState({
    //         ResultsViewMessage: this.props.ResultsViewMessage,
    //         ResultsViewMode: this.props.ResultsViewMode
    //     });
    // }

    render() {
        return (
            <Fragment>
                {this.props.ResultsViewMode === "danger" ?
                    <article className="message is-danger">
                        <div className="message-header">
                            <p>Error</p>
                        </div>
                        <div className="message-body">
                            {this.props.ResultsViewMessage}
                        </div>
                    </article>
                    :
                    this.props.ResultsViewMode === "success" ?
                        <article className="message is-success">
                            <div className="message-header">
                                <p>Success</p>
                            </div>
                            <div className="message-body">
                                {this.props.ResultsViewMessage}
                            </div>
                        </article>
                        :
                        this.props.ResultsViewMode === "warning" ?
                            <article className="message is-warning">
                                <div className="message-header">
                                    <p>Warning</p>
                                </div>
                                <div className="message-body">
                                    {this.props.ResultsViewMessage}
                                </div>
                            </article>
                            :
                            <p className="ResultsViewNoDisplay">{this.props.ResultsViewMessage}</p>
                }
            </Fragment>
        )
    }
}