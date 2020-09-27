import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card, Nav, Form, Button } from 'react-bootstrap';

export default class AssetAccountAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedBalance: this.props.balance,
        updatedRate: this.props.rate,
        updatedIsTaxAdvantaged: this.props.isTaxAdvantaged,
    }

    handleAssetAccountEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateAssetAccount(this.props.assetAccountId, this.state.updatedNickName, this.state.updatedBalance, this.state.updatedRate, this.state.updatedIsTaxAdvantaged);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onBalanceChange = event => this.setState({ "updatedBalance": event.target.value });
    onRateChange = event => this.setState({ "updatedRate": event.target.value });
    onIsTaxAdvantagedChange = event => this.setState({ "updatedIsTaxAdvantaged": event.target.value });

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
                                    <span className="account-card-form-label">Is this a tax advantaged account?</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control size="lg" as="select"
                                        value={this.state.updatedIsTaxAdvantaged}
                                        onChange={this.onIsTaxAdvantagedChange}
                                    >
                                        <option value="NO">No</option>
                                        <option value="YES">Yes</option>
                                    </Form.Control>


                                    <Button
                                        className="orangeButton"
                                        style={{ marginTop: '1em' }}
                                        variant="primary"
                                        onClick={this.handleEditSave}>
                                        save
                                    </Button>

                                </Card.Text>
                            </Card.Body>
                        </Card>
                        : <Card border="primary" className="account-card">
                            <Card.Body>
                                <Card.Header>
                                    <Nav variant="pills" defaultActiveKey="#first">
                                        <Nav.Item>
                                            <Nav.Link href="#first" onClick={this.handleAssetAccountEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteAssetAccount(this.props.assetAccountId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">balance: <NumberFormat value={this.props.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">estimated rate of return: {this.props.rate}</span><br />
                                    <span className="card-text">tax advantaged?: {this.props.isTaxAdvantaged}</span><br />
                                    <span className="card-text">account ID: {this.props.assetAccountId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}
