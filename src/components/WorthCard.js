import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card } from 'react-bootstrap';

export default class WorthCard extends Component {
    render() {
        return (
            <Card border="primary" className="account-card account-card-edit">
                <Card.Body>
                    <Card.Header><h3 className="account-card-header">{this.props.header}</h3></Card.Header>
                    <Card.Text>
                        <span className="account-card-form-label">
                            <strong>High-rate debt: </strong>
                            <NumberFormat
                                value={this.props.worthObject.highRateDebt}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />
                        <span className="account-card-form-label">
                            <strong>Low-rate debt: </strong>
                            <NumberFormat
                                value={this.props.worthObject.lowRateDebt}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />
                        <span className="account-card-form-label">
                            <strong>Taxable assets: </strong>
                            <NumberFormat
                                value={this.props.worthObject.taxableAssets}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />
                        <span className="account-card-form-label">
                            <strong>Tax-advantaged assets: </strong>
                            <NumberFormat
                                value={this.props.worthObject.taxAdvantagedAssets}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />
                        <span className="account-card-form-label">
                            <strong>Total property value: </strong>
                            <NumberFormat
                                value={this.props.worthObject.totalPropertyValue}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />
                        <span className="account-card-form-label">
                            <strong>Net worth: </strong>
                            <NumberFormat
                                value={this.props.worthObject.netWorth}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'} />
                        </span><br style={{ marginTop: '.25em' }} />

                    </Card.Text>
                </Card.Body>
            </Card>

        )
    }
}