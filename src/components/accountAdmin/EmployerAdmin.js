import React, { Component } from 'react';
import Employer from './Employer';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from "axios";
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class EmployerAdmin extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        newEmployer: {
            "bonusTargetRate": "",
            "currentSalaryGrossAnnual": "",
            "currentSalaryNetPerPaycheck": "",
            "employerId": "",
            "employerRetirementAccount": "",
            "householdId": "",
            "mostRecentBonusDate": "",
            "mostRecentPayday": "",
            "nickName": "",
            "payFrequency": "MONTHLY",
            "retirementContributionRate": "",
            "retirementMatchRate": "",
        },
        employers: [],
        householdId: 'authVal',
        assetAccounts: []
    }

    resetNewEmployer = async () => {
        this.setState({
            newEmployer: {
                "bonusTargetRate": "",
                "currentSalaryGrossAnnual": "",
                "currentSalaryNetPerPaycheck": "",
                "employerId": "",
                "employerRetirementAccount": "",
                "householdId": "",
                "mostRecentBonusDate": "",
                "mostRecentPayday": "",
                "nickName": "",
                "payFrequency": "MONTHLY",
                "retirementContributionRate": "",
                "retirementMatchRate": "",
            }
        });
    }

    handleAddEmployer = async (employerId, event) => {
        event.preventDefault();
        try {
            const params = {
                "bonusTargetRate": Number(this.state.newEmployer.bonusTargetRate),
                "currentSalaryGrossAnnual": Number(this.state.newEmployer.currentSalaryGrossAnnual),
                "currentSalaryNetPerPaycheck": Number(this.state.newEmployer.currentSalaryNetPerPaycheck),
                "employerId": 'newVal',
                "employerRetirementAccount": this.state.newEmployer.employerRetirementAccount,
                "householdId": "headerVal",
                "mostRecentBonusDate": this.state.newEmployer.mostRecentBonusDate,
                "mostRecentPayday": this.state.newEmployer.mostRecentPayday,
                "nickName": this.state.newEmployer.nickName,
                "payFrequency": this.state.newEmployer.payFrequency,
                "retirementContributionRate": Number(this.state.newEmployer.retirementContributionRate),
                "retirementMatchRate": Number(this.state.newEmployer.retirementMatchRate),
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlEmployer}/employers/newVal`, params, { headers: headers });
            this.state.newEmployer = res.data;
            this.setState({
                employers: multiSort.multiSort([...this.state.employers, this.state.newEmployer], "nickName", true)
            });
            await this.resetNewEmployer();
            this.props.onChangeMessage("Employer added", "success");
        } catch (err) {
            this.props.onChangeMessage(`Unable to add employer: ${err}`, "danger");
        }
    }

    handleUpdateEmployer = async (
        employerId,
        nickName,
        bonusTargetRate,
        currentSalaryGrossAnnual,
        currentSalaryNetPerPaycheck,
        employerRetirementAccount,
        //householdId,
        mostRecentBonusDate,
        mostRecentPayday,
        payFrequency,
        retirementContributionRate,
        retirementMatchRate) => {

        try {
            const params = {
                "bonusTargetRate": Number(bonusTargetRate),
                "currentSalaryGrossAnnual": Number(currentSalaryGrossAnnual),
                "currentSalaryNetPerPaycheck": Number(currentSalaryNetPerPaycheck),
                "employerId": "pathVal",
                "employerRetirementAccount": employerRetirementAccount,
                //"householdId": "headerVal",
                "mostRecentBonusDate": mostRecentBonusDate,
                "mostRecentPayday": mostRecentPayday,
                "nickName": nickName,
                "payFrequency": payFrequency,
                "retirementContributionRate": Number(retirementContributionRate),
                "retirementMatchRate": Number(retirementMatchRate),
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            };
            await axios.patch(`${config.api.invokeUrlEmployer}/employers/${employerId}`, params, { headers: headers });
            const employerToUpdate = [...this.state.employers].find(employer => employer.employerId === employerId);
            const updatedEmployers = [...this.state.employers].filter(employer => employer.employerId !== employerId);
            employerToUpdate.bonusTargetRate = bonusTargetRate;
            employerToUpdate.currentSalaryGrossAnnual = currentSalaryGrossAnnual;
            employerToUpdate.currentSalaryNetPerPaycheck = currentSalaryNetPerPaycheck;
            employerToUpdate.employerRetirementAccount = employerRetirementAccount;
            //employerToUpdate.householdId = householdId;
            employerToUpdate.mostRecentBonusDate = mostRecentBonusDate;
            employerToUpdate.mostRecentPayday = mostRecentPayday;
            employerToUpdate.nickName = nickName;
            employerToUpdate.payFrequency = payFrequency;
            employerToUpdate.retirementContributionRate = retirementContributionRate;
            employerToUpdate.retirementMatchRate = retirementMatchRate;
            updatedEmployers.push(employerToUpdate);

            this.setState({
                employers: multiSort.multiSort(updatedEmployers, "nickName", true)
            });
            this.props.onChangeMessage("Employer updated", "success");

        } catch (err) {
            this.props.onChangeMessage(`Unable to update employer: ${err}`, "danger");
        }
    }

    handleDeleteEmployer = async (employerId, event) => {
        event.preventDefault();

        if (window.confirm("Please confirm that you want to delete this item.")) {
            // add call to AWS API Gateway delete employer endpoint here
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                };
                await axios.delete(`${config.api.invokeUrlEmployer}/employers/${employerId}`, { headers: headers });
                const updatedEmployers = [...this.state.employers].filter(employer => employer.employerId !== employerId);
                this.setState({
                    employers: multiSort.multiSort(updatedEmployers, "nickName", true)
                });
                this.props.onChangeMessage("Employer deleted", "success");
            } catch (err) {
                this.props.onChangeMessage(`Unable to delete employer: ${err}`, "danger");
            }
        }
    }



    fetchEmployers = async () => {
        try {
            //console.log(`token: ${this.token}`);
            var url = `${config.api.invokeUrlEmployer}/employers`
            //console.log(idToken);

            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                data: null
            };

            const res = await axios.get(url, requestConfig);
            this.setState({
                employers: multiSort.multiSort(res.data, "nickName", true)
            });

        } catch (err) {
            this.props.onChangeMessage(`Unable to pull employers from database: ${err}`, "danger");
        }
    }

    fetchAssetAccounts = async () => {
        try {
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


    onBonusTargetRateChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "bonusTargetRate": event.target.value } });
    onCurrentSalaryGrossAnnualChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "currentSalaryGrossAnnual": event.target.value } });
    onCurrentSalaryNetPerPaycheckChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "currentSalaryNetPerPaycheck": event.target.value } });
    onNEmployerRetirementAccountChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "employerRetirementAccount": event.target.value } });
    onMostRecentBonusDateChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "mostRecentBonusDate": event.target.value } });
    onMostRecentPaydayChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "mostRecentPayday": event.target.value } });
    onNickNameChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "nickName": event.target.value } });
    onPayFrequencyChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "payFrequency": event.target.value } });
    onRetirementContributionRateChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "retirementContributionRate": event.target.value } });
    onRetirementMatchRateChange = event => this.setState({ newEmployer: { ...this.state.newEmployer, "retirementMatchRate": event.target.value } });


    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.fetchEmployers();
            this.fetchAssetAccounts();
        }
    }

    render() {
        const { assetAccounts } = this.state;
        let assetAccountsList = assetAccounts.length > 0
            && assetAccounts.map((item, i) => {
                return (
                    <option key={i} value={item.assetAccountId}>{item.nickName}</option>
                )
            }, this);

        return (
            <>
                {this.state.isUserAuthenticated ?
                    <Container fluid>
                        <Row>
                            <Col sm={4}>
                                <div className="new-account-form">
                                    <h3 className="new-account-form-header">Add a new employer</h3>
                                    <Form onSubmit={event => this.handleAddEmployer(this.state.newEmployer.employerId, event)}>
                                        <p className="account-card-form-label">Nickname:</p>
                                        <Form.Control type="text"
                                            placeholder="enter nickname"
                                            value={this.state.newEmployer.nickName}
                                            onChange={this.onNickNameChange}
                                        />


                                        <p className="account-card-form-label">Current annual gross salary:</p>
                                        <Form.Control type="text"
                                            placeholder="Enter current annual gross salary"
                                            value={this.state.newEmployer.currentSalaryGrossAnnual}
                                            onChange={this.onCurrentSalaryGrossAnnualChange}
                                        />

                                        <p className="account-card-form-label">Payment frequency:</p>
                                        <Form.Control as="select"
                                            value={this.state.newEmployer.payFrequency}
                                            onChange={this.onPayFrequencyChange}>
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="BIWEEKLY">Every other week</option>
                                            <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                                        </Form.Control>

                                        <p className="account-card-form-label">Bonus target rate:</p>
                                        <Form.Control type="text"
                                            placeholder="Enter bonus target rate"
                                            value={this.state.newEmployer.bonusTargetRate}
                                            onChange={this.onBonusTargetRateChange}
                                        />

                                        <p className="account-card-form-label">Net payment per paycheck:</p>
                                        <Form.Control type="text"
                                            placeholder="Enter net payment per paycheck"
                                            value={this.state.newEmployer.currentSalaryNetPerPaycheck}
                                            onChange={this.onCurrentSalaryNetPerPaycheckChange}
                                        />

                                        <p className="account-card-form-label">Employer retirement account ID:</p>
                                        <Form.Control as="select"
                                            placeholder="Enter employer retirement account ID"
                                            value={this.state.newEmployer.employerRetirementAccount}
                                            onChange={this.onNEmployerRetirementAccountChange}>
                                            {assetAccountsList}
                                        </Form.Control>

                                        <p className="account-card-form-label">Most recent bonus date:</p>
                                        <Form.Control type="text"
                                            placeholder="YYYY-MM-DD"
                                            value={this.state.newEmployer.mostRecentBonusDate}
                                            onChange={this.onMostRecentBonusDateChange}
                                        />

                                        <p className="account-card-form-label">Most recent pay day:</p>
                                        <Form.Control type="text"
                                            placeholder="YYYY-MM-DD"
                                            value={this.state.newEmployer.mostRecentPayday}
                                            onChange={this.onMostRecentPaydayChange}
                                        />

                                        <p className="account-card-form-label">Retirement contribution percent:</p>
                                        <Form.Control type="text"
                                            placeholder="Enter retirement contribution percent"
                                            value={this.state.newEmployer.retirementContributionRate}
                                            onChange={this.onRetirementContributionRateChange}
                                        />

                                        <p className="account-card-form-label">Retirement match rate:</p>
                                        <Form.Control type="text"
                                            placeholder="Enter retirement match rate"
                                            value={this.state.newEmployer.retirementMatchRate}
                                            onChange={this.onRetirementMatchRateChange}
                                        />
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
                                        this.state.employers.map((employer, index) =>
                                            <Employer
                                                isAdmin={true}
                                                handleUpdateEmployer={this.handleUpdateEmployer}
                                                handleDeleteEmployer={this.handleDeleteEmployer}
                                                employerId={employer.employerId}
                                                key={employer.employerId}
                                                bonusTargetRate={employer.bonusTargetRate}
                                                currentSalaryGrossAnnual={employer.currentSalaryGrossAnnual}
                                                currentSalaryNetPerPaycheck={employer.currentSalaryNetPerPaycheck}
                                                employerRetirementAccount={employer.employerRetirementAccount}
                                                householdId={employer.householdId}
                                                mostRecentBonusDate={employer.mostRecentBonusDate}
                                                mostRecentPayday={employer.mostRecentPayday}
                                                nickName={employer.nickName}
                                                payFrequency={employer.payFrequency}
                                                retirementContributionRate={employer.retirementContributionRate}
                                                retirementMatchRate={employer.retirementMatchRate}
                                                assetAccounts={assetAccounts}
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
