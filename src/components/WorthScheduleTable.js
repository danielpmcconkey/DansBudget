import React, { Component, Fragment } from 'react';
import NumberFormat from 'react-number-format';



export default class WorthScheduleTable extends Component {

    state = {
        worthScheduleStateful: []
    }
    componentDidMount = () => {
        this.setState({worthScheduleStateful: this.props.worthScheduleStateful});
    }
    
    render() {
        return (
            <Fragment>

                <div className="table-container">
                    <table className="table">
                        <thead className="thead">
                            <tr>
                                <th>Key</th>
                                <th>Date</th>
                                <th>NetWorth</th>
                                <th>High-rate debt</th>
                                <th>Low-rate debt</th>
                                <th>Taxable assets</th>
                                <th>Tax advantaged assets</th>
                                <th>Property value</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.worthScheduleStateful.map(function (item, key) {

                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{item.simulationRunDate}</td>
                                    <td><NumberFormat value={item.netWorth} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.highRateDebt} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.lowRateDebt} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.taxableAssets} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.taxAdvantagedAssets} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                    <td><NumberFormat value={item.totalPropertyValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                                </tr>
                            )

                        })}</tbody>
                    </table>

                </div>
            </Fragment>
        )
    }
}