import React, { Component } from 'react';
import AssetAccount from './AssetAccount';
import axios from "axios";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class AssetAccountAdmin extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        newAssetAccount: {
            "assetAccountid": "",
            "balance": "",
            "householdId": "",
            "isOpen": true,
            "nickName": "",
            "rate": "",
            "isTaxAdvantaged": "NO"
        },
        assetAccounts: [],
        householdId: 'authVal',
    }

    resetNewAssetAccount = async () => {
        this.setState({
            newAssetAccount: {
                "assetAccountid": "",
                "balance": "",
                "householdId": "",
                "isOpen": true,
                "nickName": "",
                "rate": "",
                "isTaxAdvantaged": "NO"
            }
        });
    }

    handleAddAssetAccount = async (assetAccountId, event) => {
        event.preventDefault();
        try {
            const params = {
                "assetAccountId": 'newVal',
                "balance": Number(this.state.newAssetAccount.balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": this.state.newAssetAccount.nickName,
                "rate": Number(this.state.newAssetAccount.rate),
                "isTaxAdvantaged": this.state.newAssetAccount.isTaxAdvantaged
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlAssetAccount}/asset-accounts/newVal`, params, { headers: headers });
            this.state.newAssetAccount = res.data;
            this.setState({
                assetAccounts: multiSort.multiSort([...this.state.assetAccounts, this.state.newAssetAccount], "balance", false)
            });
            await this.resetNewAssetAccount();
            this.props.onChangeMessage("Asset account saved", "success", "Success", true);
        } catch (err) {
            this.props.onChangeMessage(`Unable to add asset account: ${err}`, "danger", "Error", true);
        }
    }

    handleUpdateAssetAccount = async (assetAccountId, nickName, balance, rate, isTaxAdvantaged) => {

        try {
            const params = {
                "assetAccountId": "pathVal",
                "balance": Number(balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": nickName,
                "rate": Number(rate),
                "isTaxAdvantaged": isTaxAdvantaged
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            await axios.patch(`${config.api.invokeUrlAssetAccount}/asset-accounts/${assetAccountId}`, params, { headers: headers });
            const assetAccountToUpdate = [...this.state.assetAccounts].find(assetAccount => assetAccount.assetAccountId === assetAccountId);
            const updatedAssetAccounts = [...this.state.assetAccounts].filter(assetAccount => assetAccount.assetAccountId !== assetAccountId);
            assetAccountToUpdate.nickName = nickName;
            assetAccountToUpdate.balance = balance;
            assetAccountToUpdate.rate = rate;
            assetAccountToUpdate.isTaxAdvantaged = isTaxAdvantaged;
            updatedAssetAccounts.push(assetAccountToUpdate);
            this.setState({
                assetAccounts: multiSort.multiSort(updatedAssetAccounts, "balance", false)
            });
            this.props.onChangeMessage("Asset account updated", "success", "Success", true);

        } catch (err) {
            this.props.onChangeMessage(`Unable to update asset account: ${err}`, "danger", "Error", true);
        }
    }

    handleDeleteAssetAccount = async (assetAccountId, event) => {
        event.preventDefault();

        if (window.confirm("Please confirm that you want to delete this item.")) {
            // add call to AWS API Gateway delete assetAccount endpoint here
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                };
                await axios.delete(`${config.api.invokeUrlAssetAccount}/asset-accounts/${assetAccountId}`, { headers: headers });
                const updatedAssetAccounts = [...this.state.assetAccounts].filter(assetAccount => assetAccount.assetAccountId !== assetAccountId);
                this.setState({
                    assetAccounts: multiSort.multiSort(updatedAssetAccounts, "balance", false)
                });
                this.props.onChangeMessage("Asset account deleted", "success", "Success", true);
            } catch (err) {
                this.props.onChangeMessage(`Unable to delete asset account: ${err}`, "danger", "Error", true);
            }
        }
    }

    fetchAssetAccounts = async () => {
        //this.addemall();
        try {

            //console.log(`token: ${this.token}`);
            var url = `${config.api.invokeUrlAssetAccount}/asset-accounts`
            const res = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                data: null
            });
            this.setState({
                assetAccounts: multiSort.multiSort(res.data, "balance", false)
            });

        } catch (err) {
            this.props.onChangeMessage(`Error pulling asset accounts from database: ${err}`, "danger", "Error", true);
        }
    }

    onNickNameChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "nickName": event.target.value } });
    onBalanceChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "balance": event.target.value } });
    onRateChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "rate": event.target.value } });
    onIsTaxAdvantagedChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "isTaxAdvantaged": event.target.value } });


    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.fetchAssetAccounts();
        }
    }

    render() {
        return (
            <>
                {this.state.isUserAuthenticated ?
                    <Container fluid>
                        <Row>
                            <Col sm={4}>
                                <div className="new-account-form">
                                    <h3 className="new-account-form-header">Add a new asset account</h3>
                                    <Form onSubmit={event => this.handleAddAssetAccount(this.state.newAssetAccount.assetAccountId, event)}>

                                        <p className="account-card-form-label">Nickname:</p>
                                        <Form.Control type="text"
                                            placeholder="enter nickname"
                                            value={this.state.newAssetAccount.nickName}
                                            onChange={this.onNickNameChange}
                                        />
                                        <p className="account-card-form-label">Current balance:</p>
                                        <Form.Control type="text"
                                            placeholder="enter balance"
                                            value={this.state.newAssetAccount.balance}
                                            onChange={this.onBalanceChange}
                                        />
                                        <p className="account-card-form-label">Estimated rate of return:</p>
                                        <Form.Control type="text"
                                            placeholder="enter rate"
                                            value={this.state.newAssetAccount.rate}
                                            onChange={this.onRateChange}
                                        />
                                        <p className="account-card-form-label">Is this a tax advantaged account?</p>
                                        <Form.Control as="select"
                                            value={this.state.newAssetAccount.isTaxAdvantaged}
                                            onChange={this.onIsTaxAdvantagedChange}
                                        >
                                            <option value="NO">No</option>
                                            <option value="YES">Yes</option>
                                        </Form.Control>
                                        <Form.Group>
                                            <Button
                                                className="orangeButton"
                                                type="submit"
                                                style={{ marginTop: '1em' }}
                                                variant="primary">
                                                Add asset account
                                            </Button>
                                        </Form.Group>
                                    </Form>

                                </div>
                            </Col>
                            <Col sm={8}>
                                <div>
                                    <h3 className="new-account-form-header">Your asset accounts</h3>
                                    {
                                        this.state.assetAccounts.map((assetAccount, index) =>
                                            <AssetAccount
                                                isAdmin={true}
                                                handleUpdateAssetAccount={this.handleUpdateAssetAccount}
                                                handleDeleteAssetAccount={this.handleDeleteAssetAccount}
                                                nickName={assetAccount.nickName}
                                                balance={assetAccount.balance}
                                                rate={assetAccount.rate}
                                                isTaxAdvantaged={assetAccount.isTaxAdvantaged}
                                                assetAccountId={assetAccount.assetAccountId}
                                                key={assetAccount.assetAccountId}
                                            />)
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    : <div><p>You must log in to view this content</p></div>
                }
            </>
        )
    }
}
