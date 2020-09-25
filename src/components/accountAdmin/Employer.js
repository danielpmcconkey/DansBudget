import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class EmployerAdmin extends Component {

    state = {
        isEditMode: false,
        updatedBonusTargetRate: this.props.bonusTargetRate,
        updatedCurrentSalaryGrossAnnual: this.props.currentSalaryGrossAnnual,
        updatedCurrentSalaryNetPerPaycheck: this.props.currentSalaryNetPerPaycheck,
        updatedEmployerId: this.props.employerId,
        updatedEmployerRetirementAccount: this.props.employerRetirementAccount,
        updatedHouseholdId: this.props.householdId,
        updatedMostRecentBonusDate: this.props.mostRecentBonusDate,
        updatedMostRecentPayday: this.props.mostRecentPayday,
        updatedNickName: this.props.nickName,
        updatedPayFrequency: this.props.payFrequency,
        updatedRetirementContributionRate: this.props.retirementContributionRate,
        updatedRetirementMatchRate: this.props.retirementMatchRate,
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
    onNEmployerRetirementAccountChange = event => this.setState({ "updatedEmployerRetirementAccount": event.target.value });
    onMostRecentBonusDateChange = event => this.setState({ "updatedMostRecentBonusDate": event.target.value });
    onMostRecentPaydayChange = event => this.setState({ "updatedMostRecentPayday": event.target.value });
    onNickNameChange = event => this.setState({ "updatedNickName": event.target.value });
    onPayFrequencyChange = event => this.setState({ "updatedPayFrequency": event.target.value });
    onRetirementContributionRateChange = event => this.setState({ "updatedRetirementContributionRate": event.target.value });
    onRetirementMatchRateChange = event => this.setState({ "updatedRetirementMatchRate": event.target.value });


    render() {
        return (
            <div color="info" className="tile is-child box notification has-background-success has-text-light">
                {
                    this.props.isAdmin &&
                    <Fragment>
                        <a href="/" onClick={this.handleEmployerEdit} className="account-edit-icon">
                            <FontAwesomeIcon icon="edit" />
                        </a>
                        <button onClick={event => this.props.handleDeleteEmployer(this.props.employerId, event)} className="delete"></button>
                    </Fragment>
                }
                {
                    this.state.isEditMode
                        ? <div>
                            <p>Edit nickname</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter name"
                                value={this.state.updatedNickName}
                                onChange={this.onNickNameChange}
                            />
                            <p>Edit current annual gross salary</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter current annual gross salary"
                                value={this.state.updatedCurrentSalaryGrossAnnual}
                                onChange={this.onCurrentSalaryGrossAnnualChange}
                            />
                            <p>Edit payment frequency</p>
                            <select
                                className="select is-medium"
                                value={this.state.updatedPayFrequency}
                                onChange={this.onPayFrequencyChange}>
                                <option value="MONTHLY">Monthly</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="BIWEEKLY">Every other week</option>
                                <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                            </select>
                            <p>Edit bonus target rate</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter bonus target rate"
                                value={this.state.updatedBonusTargetRate}
                                onChange={this.onBonusTargetRateChange}
                            />
                            <p>Edit net payment per paycheck</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter net payment per paycheck"
                                value={this.state.updatedCurrentSalaryNetPerPaycheck}
                                onChange={this.onCurrentSalaryNetPerPaycheckChange}
                            />
                            <p>Edit employer retirement account ID</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter employer retirement account ID"
                                value={this.state.updatedEmployerRetirementAccount}
                                onChange={this.onNEmployerRetirementAccountChange}
                            />
                            <p>Edit most recent bonus date</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="YYYY-MM-DD"
                                value={this.state.updatedMostRecentBonusDate}
                                onChange={this.onMostRecentBonusDateChange}
                            />
                            <p>Edit most recent pay day</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="YYYY-MM-DD"
                                value={this.state.updatedMostRecentPayday}
                                onChange={this.onMostRecentPaydayChange}
                            />
                            <p>Edit retirement contribution percent</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter retirement contribution percent"
                                value={this.state.updatedRetirementContributionRate}
                                onChange={this.onRetirementContributionRateChange}
                            />
                            <p>Edit retirement match rate</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter retirement match rate"
                                value={this.state.updatedRetirementMatchRate}
                                onChange={this.onRetirementMatchRateChange}
                            />
                            <p className="account-id">id: {this.props.employerId}</p>
                            <button type="submit"
                                className="button is-info is-small"
                                onClick={this.handleEditSave}
                            >save</button>
                        </div>
                        : <div>
                            <p className="account-title">{this.props.nickName}</p>
                            <p className="account-title">annual gross salary: {this.props.currentSalaryGrossAnnual}</p>
                            <p className="account-id">pay frequency: {this.props.payFrequency}</p>
                            <p className="account-id">bonus target rate: {this.props.bonusTargetRate}</p>
                            <p className="account-id">net per paycheck: {this.props.currentSalaryNetPerPaycheck}</p>
                            <p className="account-id">retirement account: {this.props.employerRetirementAccount}</p>
                            <p className="account-id">last bonus: {this.props.mostRecentBonusDate}</p>
                            <p className="account-id">last pay day: {this.props.mostRecentPayday}</p>
                            <p className="account-id">retirement contribution rate: {this.props.retirementContributionRate}</p>
                            <p className="account-id">retirement match rate: {this.props.retirementMatchRate}</p>
                            <p className="account-id">ID: {this.props.employerId}</p>
                        </div>
                }
            </div>
        )
    }
}
