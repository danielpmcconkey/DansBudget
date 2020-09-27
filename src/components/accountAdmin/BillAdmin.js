import React, { Component } from 'react';
import Bill from './Bill';
import axios from "axios";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class BillAdmin extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        newBill: {
            "billId": "",
            "householdId": "",
            "isOpen": true,
            "nickName": "",
            "amountDue": "",
            "lastPaidDate": "",
            "payFrequency": "MONTHLY"
        },
        bills: [],
        householdId: 'authVal',
    }

    resetNewBill = async () => {
        this.setState({
            newBill: {
                "billId": "",
                "householdId": "",
                "isOpen": true,
                "nickName": "",
                "amountDue": "",
                "lastPaidDate": "",
                "payFrequency": "MONTHLY"
            }
        });
    }

    handleAddBill = async (billId, event) => {
        event.preventDefault();
        try {
            const params = {
                "billId": 'newVal',
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": this.state.newBill.nickName,
                "amountDue": Number(this.state.newBill.amountDue),
                "lastPaidDate": this.state.newBill.lastPaidDate,
                "payFrequency": this.state.newBill.payFrequency
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlBill}/bills/newVal`, params, { headers: headers });
            this.state.newBill = res.data;
            this.setState({
                bills: multiSort.multiSort([...this.state.bills, this.state.newBill], "nickName", true)
            });
            await this.resetNewBill();
            this.props.onChangeMessage("Bill added", "success");
        } catch (err) {
            this.props.onChangeMessage(`Unable to add bill: ${err}`, "danger");
        }
    }

    handleUpdateBill = async (billId, nickName, amountDue, lastPaidDate, payFrequency) => {

        try {
            const params = {
                "billId": "pathVal",
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": nickName,
                "amountDue": Number(amountDue),
                "lastPaidDate": lastPaidDate,
                "payFrequency": payFrequency
            };
            //console.log(params);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            await axios.patch(`${config.api.invokeUrlBill}/bills/${billId}`, params, { headers: headers });
            const billToUpdate = [...this.state.bills].find(bill => bill.billId === billId);
            const updatedBills = [...this.state.bills].filter(bill => bill.billId !== billId);
            billToUpdate.nickName = nickName;
            billToUpdate.amountDue = amountDue;
            billToUpdate.lastPaidDate = lastPaidDate;
            billToUpdate.payFrequency = payFrequency;
            updatedBills.push(billToUpdate);

            this.setState({
                bills: multiSort.multiSort(updatedBills, "nickName", true)
            });
            this.props.onChangeMessage("Bill updated", "success");

        } catch (err) {
            this.props.onChangeMessage(`Unable to update bill: ${err}`, "danger");
        }
    }

    handleDeleteBill = async (billId, event) => {
        event.preventDefault();

        if (window.confirm("Please confirm that you want to delete this item.")) {
            // add call to AWS API Gateway delete bill endpoint here
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                };
                await axios.delete(`${config.api.invokeUrlBill}/bills/${billId}`, { headers: headers });
                const updatedBills = [...this.state.bills].filter(bill => bill.billId !== billId);
                this.setState({
                    bills: multiSort.multiSort(updatedBills, "nickName", true)
                });
                this.props.onChangeMessage("Bill deleted", "success");
            } catch (err) {
                this.props.onChangeMessage(`Unable to delete bill: ${err}`, "danger");
            }
        }
    }



    fetchBills = async () => {
        try {
            //console.log(`token: ${this.token}`);
            var url = `${config.api.invokeUrlBill}/bills`
            //console.log(idToken);

            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                data: null
            };

            const res = await axios.get(url, requestConfig);
            this.setState({
                bills: multiSort.multiSort(res.data, "nickName", true)
            });

        } catch (err) {
            this.props.onChangeMessage(`Unable to pull bills from database: ${err}`, "danger");
        }
    }

    onNickNameChange = event => this.setState({ newBill: { ...this.state.newBill, "nickName": event.target.value } });
    onAmountDueChange = event => this.setState({ newBill: { ...this.state.newBill, "amountDue": event.target.value } });
    onLastPaidDateChange = event => this.setState({ newBill: { ...this.state.newBill, "lastPaidDate": event.target.value } });
    onPayFrequencyChange = event => this.setState({ newBill: { ...this.state.newBill, "payFrequency": event.target.value } });


    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.fetchBills();
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
                                    <h3 className="new-account-form-header">Add a new bill</h3>
                                    <Form onSubmit={event => this.handleAddBill(this.state.newBill.billId, event)}>


                                        <p className="account-card-form-label">Nick name:</p>
                                        <Form.Control type="text"
                                            placeholder="enter nickname"
                                            value={this.state.newBill.nickName}
                                            onChange={this.onNickNameChange}
                                        />
                                        <p className="account-card-form-label">Enter amount due</p>
                                        <Form.Control type="text"
                                            value={this.state.newBill.amountDue}
                                            onChange={this.onAmountDueChange}
                                        />
                                        <p className="account-card-form-label">Enter last payment date</p>
                                        <Form.Control type="text"
                                            value={this.state.newBill.lastPaidDate}
                                            onChange={this.onLastPaidDateChange}
                                            placeholder="YYYY-MM-DD"
                                        />
                                        <p className="account-card-form-label">Enter pay frequency</p>
                                        <Form.Control as="select"
                                            value={this.state.newBill.payFrequency}
                                            onChange={this.onPayFrequencyChange}>
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="BIWEEKLY">Every other week</option>
                                            <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                                        </Form.Control>
                                        <Form.Group>
                                            <Button className="orangeButton" type="submit" style={{ marginTop: '1em' }} variant="primary">Add bill</Button>
                                        </Form.Group>
                                    </Form>

                                </div>
                            </Col>
                            <Col sm={8}>
                                <div>
                                    <h3 className="new-account-form-header">Your bills</h3>
                                    {
                                        this.state.bills.map((bill, index) =>
                                            <Bill
                                                isAdmin={true}
                                                handleUpdateBill={this.handleUpdateBill}
                                                handleDeleteBill={this.handleDeleteBill}
                                                nickName={bill.nickName}
                                                amountDue={bill.amountDue}
                                                lastPaidDate={bill.lastPaidDate}
                                                payFrequency={bill.payFrequency}
                                                billId={bill.billId}
                                                key={bill.billId}
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