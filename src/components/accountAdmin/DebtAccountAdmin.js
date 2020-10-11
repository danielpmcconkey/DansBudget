import React, { Component, Fragment } from 'react';
import DebtAccount from './DebtAccount';
import axios from "axios";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class DebtAccountAdmin extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        newDebtAccount: {
            "debtAccountid": "",
            "balance": "",
            "householdId": "",
            "isOpen": true,
            "nickName": "",
            "rate": "",
            "minPayment": "",
            "lastPaidDate": "",
            "payFrequency": "MONTHLY"
        },
        debtAccounts: [],
        householdId: 'authVal',
    }

    resetNewDebtAccount = async () => {
        this.setState({
            newDebtAccount: {
                "debtAccountid": "",
                "balance": "",
                "householdId": "",
                "isOpen": true,
                "nickName": "",
                "rate": "",
                "minPayment": "",
                "lastPaidDate": "",
                "payFrequency": "MONTHLY"
            }
        });
    }
    handleAddDebtAccount = async (debtAccountId, event) => {
        event.preventDefault();
        try {
            const params = {
                "debtAccountId": 'newVal',
                "balance": Number(this.state.newDebtAccount.balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": this.state.newDebtAccount.nickName,
                "rate": Number(this.state.newDebtAccount.rate),
                "minPayment": Number(this.state.newDebtAccount.minPayment),
                "lastPaidDate": this.state.newDebtAccount.lastPaidDate,
                "payFrequency": this.state.newDebtAccount.payFrequency
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlDebtAccount}/debt-accounts/newVal`, params, { headers: headers });
            this.state.newDebtAccount = res.data;
            this.setState({
                debtAccounts: multiSort.multiSort([...this.state.debtAccounts, this.state.newDebtAccount], "balance", false)
            });
            await this.resetNewDebtAccount();
            this.props.onChangeMessage("Debit account added", "success");
        } catch (err) {
            this.props.onChangeMessage(`Unable to add debit account: ${err}`, "danger");
        }
    }
    handleUpdateDebtAccount = async (debtAccountId, nickName, balance, rate, minPayment, lastPaidDate, payFrequency) => {

        try {
            const params = {
                "debtAccountId": "pathVal",
                "balance": Number(balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": nickName,
                "rate": Number(rate),
                "minPayment": Number(minPayment),
                "lastPaidDate": lastPaidDate,
                "payFrequency": payFrequency
            };
            // console.log(params);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            await axios.patch(`${config.api.invokeUrlDebtAccount}/debt-accounts/${debtAccountId}`, params, { headers: headers });
            const debtAccountToUpdate = [...this.state.debtAccounts].find(debtAccount => debtAccount.debtAccountId === debtAccountId);
            const updatedDebtAccounts = [...this.state.debtAccounts].filter(debtAccount => debtAccount.debtAccountId !== debtAccountId);
            debtAccountToUpdate.nickName = nickName;
            debtAccountToUpdate.balance = balance;
            debtAccountToUpdate.rate = rate;
            debtAccountToUpdate.minPayment = minPayment;
            debtAccountToUpdate.lastPaidDate = lastPaidDate;
            debtAccountToUpdate.payFrequency = payFrequency;
            updatedDebtAccounts.push(debtAccountToUpdate);
            this.setState({
                debtAccounts: multiSort.multiSort(updatedDebtAccounts, "balance", false)
            });
            this.props.onChangeMessage("Debit account updated", "success");

        } catch (err) {
            this.props.onChangeMessage(`Unable to update debit account: ${err}`, "danger");
        }
    }
    handleDeleteDebtAccount = async (debtAccountId, event) => {
        event.preventDefault();

        if (window.confirm("Please confirm that you want to delete this item.")) {
            // add call to AWS API Gateway delete debtAccount endpoint here
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                };
                await axios.delete(`${config.api.invokeUrlDebtAccount}/debt-accounts/${debtAccountId}`, { headers: headers });
                const updatedDebtAccounts = [...this.state.debtAccounts].filter(debtAccount => debtAccount.debtAccountId !== debtAccountId);
                this.setState({
                    debtAccounts: multiSort.multiSort(updatedDebtAccounts, "balance", false)
                });
                this.props.onChangeMessage("Debit account deleted", "success");
            } catch (err) {
                this.props.onChangeMessage(`Unable to delete debit account: ${err}`, "danger");
            }
        }
    }
    fetchDebtAccounts = async () => {
        //this.addemall();
        try {
            // console.log(`token: ${this.token}`);
            var url = `${config.api.invokeUrlDebtAccount}/debt-accounts`

            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                data: null
            };

            const res = await axios.get(url, requestConfig);
            this.setState({
                //debtAccounts: multiSort.multiSort(res.data, "balance", false)
                debtAccounts: multiSort.multiSort(res.data, "rate", false)
            });

        } catch (err) {
            this.props.onChangeMessage(`Unable to pull debit accounts from database: ${err}`, "danger");
        }
    }

    onNickNameChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "nickName": event.target.value } });
    onBalanceChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "balance": event.target.value } });
    onRateChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "rate": event.target.value } });
    onMinPaymentChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "minPayment": event.target.value } });
    onLastPaidDateChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "lastPaidDate": event.target.value } });
    onPayFrequencyChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "payFrequency": event.target.value } });
    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.fetchDebtAccounts();
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.isUserAuthenticated ?
                    <Container fluid>
                        <Row>
                            <Col sm={4}>
                                <div className="new-account-form">
                                    <h3 className="new-account-form-header">Add a new debt account</h3>
                                    <Form onSubmit={event => this.handleAddDebtAccount(this.state.newDebtAccount.debtAccountId, event)}>
                                        <p className="account-card-form-label">Nick name:</p>
                                        <Form.Control type="text"
                                            placeholder="enter nickname"
                                            value={this.state.newDebtAccount.nickName}
                                            onChange={this.onNickNameChange}
                                        />
                                        <p className="account-card-form-label">Current balance:</p>
                                        <Form.Control type="text"
                                            placeholder="enter balance"
                                            value={this.state.newDebtAccount.balance}
                                            onChange={this.onBalanceChange}
                                        />
                                        <p className="account-card-form-label">Interest rate:</p>
                                        <Form.Control type="text"
                                            placeholder="enter rate"
                                            value={this.state.newDebtAccount.rate}
                                            onChange={this.onRateChange}
                                        />
                                        <p className="account-card-form-label">Minimum payment</p>
                                        <Form.Control type="text"
                                            placeholder="minimum payment"
                                            value={this.state.newDebtAccount.minPayment}
                                            onChange={this.onMinPaymentChange}
                                        />

                                        <p className="account-card-form-label">Last payment date</p>
                                        <Form.Control type="text"
                                            value={this.state.newDebtAccount.lastPaidDate}
                                            onChange={this.onLastPaidDateChange}
                                            placeholder="YYYY-MM-DD"
                                        />

                                        <p className="account-card-form-label">Pay frequency</p>
                                        <Form.Control as="select"
                                            value={this.state.newDebtAccount.payFrequency}
                                            onChange={this.onPayFrequencyChange}>
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="BIWEEKLY">Every other week</option>
                                            <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                                        </Form.Control>

                                        <Form.Group>
                                            <Button className="orangeButton" type="submit" style={{ marginTop: '1em' }} variant="primary">Add debt account</Button>
                                        </Form.Group>

                                    </Form>
                                </div>
                            </Col>
                            <Col sm={8}>
                                <div>
                                    <h3 className="new-account-form-header">Your debt accounts</h3>
                                    {
                                        this.state.debtAccounts.map((debtAccount, index) =>
                                            <DebtAccount
                                                isAdmin={true}
                                                handleUpdateDebtAccount={this.handleUpdateDebtAccount}
                                                handleDeleteDebtAccount={this.handleDeleteDebtAccount}
                                                nickName={debtAccount.nickName}
                                                balance={debtAccount.balance}
                                                rate={debtAccount.rate}
                                                minPayment={debtAccount.minPayment}
                                                lastPaidDate={debtAccount.lastPaidDate}
                                                payFrequency={debtAccount.payFrequency}
                                                debtAccountId={debtAccount.debtAccountId}
                                                key={debtAccount.debtAccountId}
                                            />)
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    : <div><p>You must log in to view this content</p></div>
                }
            </Fragment>
        )
    }
}
