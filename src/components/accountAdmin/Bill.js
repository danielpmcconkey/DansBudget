import React, { Component } from 'react';
import { Card, Nav, Form, Button } from 'react-bootstrap';

export default class BillAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedAmountDue: this.props.amountDue,
        updatedLastPaidDate: this.props.lastPaidDate,
        updatedPayFrequency: this.props.payFrequency,
    }

    handleBillEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateBill(this.props.billId, this.state.updatedNickName, this.state.updatedAmountDue, this.state.updatedLastPaidDate, this.state.updatedPayFrequency);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onAmountDueChange = event => this.setState({ "updatedAmountDue": event.target.value });
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
                                    <span className="account-card-form-label">Nickname:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter name"
                                        value={this.state.updatedNickName}
                                        onChange={this.onNickNameChange}
                                    />
                                    <span className="account-card-form-label">Amount due:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter minimum payment"
                                        value={this.state.updatedAmountDue}
                                        onChange={this.onAmountDueChange}
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
                                            <Nav.Link href="#first" onClick={this.handleBillEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteBill(this.props.billId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">balance: amount due: {this.props.amountDue}</span><br />
                                    <span className="card-text">last paid date: {this.props.lastPaidDate}</span><br />
                                    <span className="card-text">pay frequency: {this.props.payFrequency}</span><br />
                                    <span className="card-text">ID: {this.props.billId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}
