import React, { Component, Fragment } from 'react';
import NumberFormat from 'react-number-format';



export default class PayScheduleTable extends Component {

    state = {
        payScheduleStateful: []
    }
    componentDidMount = async () => {
        await this.setState({ payScheduleStateful: this.props.payScheduleStateful });
    }

    render() {
        return (
            <Fragment>

                <div className="table-container">
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th>Key</th><th>Date</th>
                                <th>Account</th>
                                <th>Debits</th>
                                <th>Credits</th>
                                <th>Primary checking balance</th>
                                <th>Primary savings balance</th>
                                <th>Daily spending account balance</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.payScheduleStateful.map(function (item, key) {

                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{item.simulationRunDate}</td>
                                    <td>{item.accountName}</td>
                                    <td><NumberFormat value={item.debits} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.credits} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.checkingBal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.savingsBal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.spendingBal} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td>{item.comment}</td>
                                </tr>
                            )

                        })}</tbody>
                    </table>

                </div>
            </Fragment>
        )
    }
}