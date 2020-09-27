import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card, Nav, Form, Button } from 'react-bootstrap';

export default class PropertyAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedHousingValueIncreaseRate: this.props.housingValueIncreaseRate,
        updatedHomeValue: this.props.homeValue
    }

    handlePropertyEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateProperty(this.props.propertyId, this.state.updatedNickName,
            this.state.updatedHousingValueIncreaseRate, this.state.updatedHomeValue);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onHomeValueChange = event => this.setState({ "updatedHomeValue": event.target.value });
    onHousingValueIncreaseRateChange = event => this.setState({ "updatedHousingValueIncreaseRate": event.target.value });


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
                                    <Form.Control type="text"
                                        placeholder="Enter nickname"
                                        value={this.state.updatedNickName}
                                        onChange={this.onNickNameChange}
                                    />
                                    <span className="account-card-form-label">Home value:</span><br style={{ marginTop: '1em' }} />
                                    <input
                                        className="input is-medium"
                                        type="text"
                                        placeholder="Enter home value"
                                        value={this.state.updatedHomeValue}
                                        onChange={this.onHomeValueChange}
                                    />
                                    <span className="account-card-form-label">Housing value increase rate:</span><br style={{ marginTop: '1em' }} />
                                    <input
                                        className="input is-medium"
                                        type="text"
                                        placeholder="Enter housing value increase rate"
                                        value={this.state.updatedHousingValueIncreaseRate}
                                        onChange={this.onHousingValueIncreaseRateChange}
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
                                            <Nav.Link href="#first" onClick={this.handlePropertyEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteProperty(this.props.propertyId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">home value: <NumberFormat value={this.props.homeValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">housing value increase rate: {this.props.housingValueIncreaseRate}</span><br />
                                    <span className="card-text">account ID: {this.props.propertyId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}