import React, { Component, Fragment } from 'react';
import Employer from './Employer';
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
    }
  }

  render() {
    return (
      <Fragment>
        {this.state.isUserAuthenticated ?

          <section className="section">
            <div className="container">
              <h1 className="title is-1">Manage Employers</h1>

              <div className="columns">
                <div className="column is-one-third has-background-grey-lighter">
                  <form onSubmit={event => this.handleAddEmployer(this.state.newEmployer.employerId, event)}>
                    <p className="subtitle is-5">Add a new employer using the form below:</p>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter nickname</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter name"
                          value={this.state.updatedNickName}
                          onChange={this.onNickNameChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter current annual gross salary</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter current annual gross salary"
                          value={this.state.updatedCurrentSalaryGrossAnnual}
                          onChange={this.onCurrentSalaryGrossAnnualChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter payment frequency</p>
                        <select
                          className="select is-medium"
                          value={this.state.updatedPayFrequency}
                          onChange={this.onPayFrequencyChange}>
                          <option value="MONTHLY">Monthly</option>
                          <option value="WEEKLY">Weekly</option>
                          <option value="BIWEEKLY">Every other week</option>
                          <option value="FIRSTANDFIFTHTEENTH">1st and 15th of the month</option>
                        </select>
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter bonus target rate</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter bonus target rate"
                          value={this.state.updatedBonusTargetRate}
                          onChange={this.onBonusTargetRateChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter net payment per paycheck</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter net payment per paycheck"
                          value={this.state.updatedCurrentSalaryNetPerPaycheck}
                          onChange={this.onCurrentSalaryNetPerPaycheckChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter employer retirement account ID</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter employer retirement account ID"
                          value={this.state.updatedEmployerRetirementAccount}
                          onChange={this.onNEmployerRetirementAccountChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter most recent bonus date</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={this.state.updatedMostRecentBonusDate}
                          onChange={this.onMostRecentBonusDateChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter most recent pay day</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={this.state.updatedMostRecentPayday}
                          onChange={this.onMostRecentPaydayChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter retirement contribution percent</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter retirement contribution percent"
                          value={this.state.updatedRetirementContributionRate}
                          onChange={this.onRetirementContributionRateChange}
                        />
                      </div>
                    </div>
                    <div className="field has-addons">
                      <div className="control">
                        <p className="fieldLabel">Enter retirement match rate</p>
                        <input
                          className="input is-medium"
                          type="text"
                          placeholder="Enter retirement match rate"
                          value={this.state.updatedRetirementMatchRate}
                          onChange={this.onRetirementMatchRateChange}
                        />
                      </div>
                    </div>

                    <div className="field has-addons">
                      <div className="control">
                        <button type="submit" className="button is-primary is-medium">
                          Add employer
                      </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="column is-two-thirds">
                  <div className="tile is-ancestor">
                    <div className="tile is-12 is-parent  is-vertical">
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
                            employerId={employer.employerId}
                            employerRetirementAccount={employer.employerRetirementAccount}
                            householdId={employer.householdId}
                            mostRecentBonusDate={employer.mostRecentBonusDate}
                            mostRecentPayday={employer.mostRecentPayday}
                            nickName={employer.nickName}
                            payFrequency={employer.payFrequency}
                            retirementContributionRate={employer.retirementContributionRate}
                            retirementMatchRate={employer.retirementMatchRate}
                          />)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          : <div><p>You must log in to view this content</p></div>
        }
      </Fragment>
    )
  }
}
