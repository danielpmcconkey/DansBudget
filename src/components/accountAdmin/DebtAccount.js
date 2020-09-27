import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card, Nav, Form, Button } from 'react-bootstrap';

export default class DebtAccountAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedBalance: this.props.balance,
        updatedRate: this.props.rate,
        updatedMinPayment: this.props.minPayment,
        updatedLastPaidDate: this.props.lastPaidDate,
        updatedPayFrequency: this.props.payFrequency,
    }

    handleDebtAccountEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateDebtAccount(this.props.debtAccountId, this.state.updatedNickName, this.state.updatedBalance, this.state.updatedRate, this.state.updatedMinPayment, this.state.updatedLastPaidDate, this.state.updatedPayFrequency);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onBalanceChange = event => this.setState({ "updatedBalance": event.target.value });
    onRateChange = event => this.setState({ "updatedRate": event.target.value });
    onMinPaymentChange = event => this.setState({ "updatedMinPayment": event.target.value });
    onLastPaidDateChange = event => this.setState({ "updatedLastPaidDate": event.target.value });
    onPayFrequencyChange = event => this.setState({ "updatedPayFrequency": event.target.value });


    render() {
        return (
            <>

                {
                    this.state.isEditMode
                        ?

                        <Card border="primary" className="account-card account-card-edit">
                            <Card.Body>
                                <Card.Header><h3 className="account-card-header">Edit this account</h3></Card.Header>
                                <Card.Text>
                                    <span className="account-card-form-label">Nick name:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter name"
                                        value={this.state.updatedNickName}
                                        onChange={this.onNickNameChange}
                                    />
                                    <span className="account-card-form-label">Current balance:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter balance"
                                        value={this.state.updatedBalance}
                                        onChange={this.onBalanceChange}
                                    />
                                    <span className="account-card-form-label">Interest rate:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter rate"
                                        value={this.state.updatedRate}
                                        onChange={this.onRateChange}
                                    />
                                    <span className="account-card-form-label">Minimum payment:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter minimum payment"
                                        value={this.state.updatedMinPayment}
                                        onChange={this.onMinPaymentChange}
                                    />
                                    <span className="account-card-form-label">Last paid date:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="YYYY-MM-DD"
                                        value={this.state.updatedLastPaidDate}
                                        onChange={this.onLastPaidDateChange}
                                    />
                                    <span className="account-card-form-label">Payment frequency:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" as="select"
                                        value={this.state.updatedPayFrequency}
                                        onChange={this.onPayFrequencyChange}>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="BIWEEKLY">Every other week</option>
                                        <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                                    </Form.Control>
                                    <Button className="orangeButton" style={{ marginTop: '1em' }} variant="primary" onClick={this.handleEditSave}>save</Button>

                                </Card.Text>
                            </Card.Body>
                        </Card>
                        : <Card border="primary" className="account-card">
                            <Card.Body>
                                <Card.Header>
                                    <Nav variant="pills" defaultActiveKey="#first">
                                        <Nav.Item>
                                            <Nav.Link href="#first" onClick={this.handleDebtAccountEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteDebtAccount(this.props.debtAccountId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">balance: <NumberFormat value={this.props.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">interest rate: {this.props.rate}</span><br />
                                    <span className="card-text">min payment: {this.props.minPayment}</span><br />
                                    <span className="card-text">last paid date: {this.props.lastPaidDate}</span><br />
                                    <span className="card-text">pay frequency: {this.props.payFrequency}</span><br />
                                    <span className="card-text">account ID: {this.props.debtAccountId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}