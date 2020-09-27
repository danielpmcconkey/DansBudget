import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card, Nav, Form, Button } from 'react-bootstrap';

export default class BudgetAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedAmount: this.props.amount,
    }

    handleBudgetEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateBudget(this.props.budgetId, this.state.updatedNickName, this.state.updatedAmount);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onAmountChange = event => this.setState({ "updatedAmount": event.target.value });



    render() {
        return (
            <>
                {
                    this.state.isEditMode
                        ?

                        <Card border="primary" className="account-card account-card-edit">
                            <Card.Body>
                                <Card.Header><h3 className="account-card-header">Edit this bill</h3></Card.Header>
                                <Card.Text>

                                    <span className="account-card-form-label">Nickname:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter name"
                                        value={this.state.updatedNickName}
                                        onChange={this.onNickNameChange}
                                    />
                                    <span className="account-card-form-label">Budgeted amount:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" type="text"
                                        placeholder="Enter minimum payment"
                                        value={this.state.updatedAmount}
                                        onChange={this.onAmountChange}
                                    />
                                    <Button className="orangeButton" style={{ marginTop: '1em' }} variant="primary" onClick={this.handleEditSave}>save</Button>


                                </Card.Text>
                            </Card.Body>
                        </Card>
                        : <Card border="primary" className="account-card">
                            <Card.Body>
                                <Card.Header>
                                    <Nav variant="pills" defaultActiveKey="#first">
                                        <Nav.Item>
                                            <Nav.Link href="#first" onClick={this.handleBudgetEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteBudget(this.props.assetAccountId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">amount: <NumberFormat value={this.props.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">ID: {this.props.budgetId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}
