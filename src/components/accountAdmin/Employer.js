import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Card, Nav, Form, Button } from 'react-bootstrap';


export default class EmployerAdmin extends Component {

    state = {
        isEditMode: false,
        updatedBonusTargetRate: this.props.bonusTargetRate,
        updatedCurrentSalaryGrossAnnual: this.props.currentSalaryGrossAnnual,
        updatedCurrentSalaryNetPerPaycheck: this.props.currentSalaryNetPerPaycheck,
        updatedEmployerId: this.props.employerId,
        updatedEmployerRetirementAccount: this.props.employerRetirementAccount,
        updatedEmployerRetirementAccountDisplay: "burp",
        updatedHouseholdId: this.props.householdId,
        updatedMostRecentBonusDate: this.props.mostRecentBonusDate,
        updatedMostRecentPayday: this.props.mostRecentPayday,
        updatedNickName: this.props.nickName,
        updatedPayFrequency: this.props.payFrequency,
        updatedRetirementContributionRate: this.props.retirementContributionRate,
        updatedRetirementMatchRate: this.props.retirementMatchRate,
        assetAccounts: []
    }

    handleEmployerEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateEmployer(
            this.props.employerId,
            this.state.updatedNickName,
            this.state.updatedBonusTargetRate,
            this.state.updatedCurrentSalaryGrossAnnual,
            this.state.updatedCurrentSalaryNetPerPaycheck,
            this.state.updatedEmployerRetirementAccount,
            //this.state.updatedHouseholdId,
            this.state.updatedMostRecentBonusDate,
            this.state.updatedMostRecentPayday,
            this.state.updatedPayFrequency,
            this.state.updatedRetirementContributionRate,
            this.state.updatedRetirementMatchRate,
        );
    }



    onBonusTargetRateChange = event => this.setState({ "updatedBonusTargetRate": event.target.value });
    onCurrentSalaryGrossAnnualChange = event => this.setState({ "updatedCurrentSalaryGrossAnnual": event.target.value });
    onCurrentSalaryNetPerPaycheckChange = event => this.setState({ "updatedCurrentSalaryNetPerPaycheck": event.target.value });
    onNEmployerRetirementAccountChange = (event) => {
        this.setState({ "updatedEmployerRetirementAccount": event.target.value });
        this.updateRetirementAccountDisplayName(event.target.value);
    }
    onMostRecentBonusDateChange = event => this.setState({ "updatedMostRecentBonusDate": event.target.value });
    onMostRecentPaydayChange = event => this.setState({ "updatedMostRecentPayday": event.target.value });
    onNickNameChange = event => this.setState({ "updatedNickName": event.target.value });
    onPayFrequencyChange = event => this.setState({ "updatedPayFrequency": event.target.value });
    onRetirementContributionRateChange = event => this.setState({ "updatedRetirementContributionRate": event.target.value });
    onRetirementMatchRateChange = event => this.setState({ "updatedRetirementMatchRate": event.target.value });

    updateRetirementAccountDisplayName = async (accountId) => {
        var displayName = "Unknown";
        var list = this.state.assetAccounts;
        if (list.length < 1) list = this.props.assetAccounts;
        // alert(this.state.assetAccounts.length);
        for (var i = 0; i < list.length; i++) {
            var account = list[i];
            if (account.assetAccountId === accountId) {
                displayName = account.nickName;
            }
        }
        this.setState({
            assetAccounts: this.props.assetAccounts,
            updatedEmployerRetirementAccountDisplay: displayName
        });
    }

    componentDidMount = async () => {
        await this.updateRetirementAccountDisplayName(this.state.updatedEmployerRetirementAccount);
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
                                    <span className="account-card-form-label">Current annual gross salary:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter current annual gross salary"
                                        value={this.state.updatedCurrentSalaryGrossAnnual}
                                        onChange={this.onCurrentSalaryGrossAnnualChange}
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
                                    <span className="account-card-form-label">Bonus target rate:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter bonus target rate"
                                        value={this.state.updatedBonusTargetRate}
                                        onChange={this.onBonusTargetRateChange}
                                    />
                                    <span className="account-card-form-label">Net payment per paycheck:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter net payment per paycheck"
                                        value={this.state.updatedCurrentSalaryNetPerPaycheck}
                                        onChange={this.onCurrentSalaryNetPerPaycheckChange}
                                    />
                                    <span className="account-card-form-label">Employer retirement account ID:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control as="select"
                                        placeholder="Enter employer retirement account ID"
                                        value={this.state.updatedEmployerRetirementAccount}
                                        onChange={this.onNEmployerRetirementAccountChange}
                                    >
                                        {assetAccountsList}
                                    </Form.Control>

                                    <span className="account-card-form-label">Most recent bonus date:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="YYYY-MM-DD"
                                        value={this.state.updatedMostRecentBonusDate}
                                        onChange={this.onMostRecentBonusDateChange}
                                    />
                                    <span className="account-card-form-label">Most recent pay day:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="YYYY-MM-DD"
                                        value={this.state.updatedMostRecentPayday}
                                        onChange={this.onMostRecentPaydayChange}
                                    />
                                    <span className="account-card-form-label">Retirement contribution percent</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter retirement contribution percent"
                                        value={this.state.updatedRetirementContributionRate}
                                        onChange={this.onRetirementContributionRateChange}
                                    />
                                    <span className="account-card-form-label">Retirement match rate:</span><br style={{ marginTop: '1em' }} />
                                    <Form.Control type="text"
                                        placeholder="Enter retirement match rate"
                                        value={this.state.updatedRetirementMatchRate}
                                        onChange={this.onRetirementMatchRateChange}
                                    />

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
                                            <Nav.Link href="#first" onClick={this.handleEmployerEdit}>Edit</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#link" onClick={event => this.props.handleDeleteEmployer(this.props.assetAccountId, event)}>Delete</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Title>{this.props.nickName}</Card.Title>
                                <Card.Text>
                                    <span className="card-text card-text-emphasis">annual gross salary: <NumberFormat value={this.props.currentSalaryGrossAnnual} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">pay frequency: {this.props.payFrequency}</span><br />
                                    <span className="card-text">bonus target rate: {this.props.bonusTargetRate}</span><br />
                                    <span className="card-text">net per paycheck: <NumberFormat value={this.props.currentSalaryNetPerPaycheck} displayType={'text'} thousandSeparator={true} prefix={'$'} /></span><br />
                                    <span className="card-text">retirement account: {this.state.updatedEmployerRetirementAccountDisplay}</span><br />
                                    <span className="card-text">last bonus: {this.props.mostRecentBonusDate}</span><br />
                                    <span className="card-text">last pay day: {this.props.mostRecentPayday}</span><br />
                                    <span className="card-text">retirement contribution rate: {this.props.retirementContributionRate}</span><br />
                                    <span className="card-text">retirement match rate: {this.props.retirementMatchRate}</span><br />
                                    <span className="card-text">ID: {this.props.employerId}</span><br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                }
            </>
        )
    }
}
