import React, { Component, Fragment } from 'react';
import DebtAccount from './DebtAccount';
import axios from "axios";
import Cookies from 'js-cookie';
var multiSort = require('./multiSort');
const config = require('../../config.json');


export default class DebtAccountAdmin extends Component {

  token = this.props.auth.user.signInUserSession.idToken.jwtToken;

  state = {
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
    householdId: Cookies.get('householdid'),
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
        'household-id': this.state.householdId,
        'Authorization': `Bearer ${this.token}`
      };
      const res = await axios.post(`${config.api.invokeUrlDebtAccount}/debt-accounts/newVal`, params, { headers: headers });
      this.state.newDebtAccount = res.data;
      this.setState({
        debtAccounts: multiSort.multiSort([...this.state.debtAccounts, this.state.newDebtAccount], "balance", false)
      });
      await this.resetNewDebtAccount();
    } catch (err) {
      console.log(`Unable to add debt account: ${err}`);
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
      console.log(params);
      const headers = {
        'Content-Type': 'application/json',
        'household-id': this.state.householdId,
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

    } catch (err) {
      console.log(`Unable to update debt account: ${err}`);
    }
  }

  handleDeleteDebtAccount = async (debtAccountId, event) => {
    event.preventDefault();

    if (window.confirm("Please confirm that you want to delete this item.")) {
      // add call to AWS API Gateway delete debtAccount endpoint here
      try {
        const headers = {
          'Content-Type': 'application/json',
          'household-id': this.state.householdId,
          'Authorization': `Bearer ${this.token}`
        };
        await axios.delete(`${config.api.invokeUrlDebtAccount}/debt-accounts/${debtAccountId}`, { headers: headers });
        const updatedDebtAccounts = [...this.state.debtAccounts].filter(debtAccount => debtAccount.debtAccountId !== debtAccountId);
        this.setState({
          debtAccounts: multiSort.multiSort(updatedDebtAccounts, "balance", false)
        });
      } catch (err) {
        console.log(`Unable to delete debt account: ${err}`);
      }
    }
  }

  handleUpdateHouseholdIdCookie = (event) => {
    Cookies.set('householdid', this.state.householdId, { expires: 365 });
  }

  fetchDebtAccounts = async () => {
    //this.addemall();
    try {
      console.log(`token: ${this.token}`);
      var url = `${config.api.invokeUrlDebtAccount}/debt-accounts`
      var idToken = `Bearer ${this.token}`;
      console.log(idToken);

      const requestConfig = {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "household-id": this.state.householdId
        },
        data: null
      };

      const res = await axios.get(url, requestConfig);
      this.setState({
        debtAccounts: multiSort.multiSort(res.data, "balance", false)
      });

    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onNickNameChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "nickName": event.target.value } });
  onBalanceChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "balance": event.target.value } });
  onRateChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "rate": event.target.value } });
  onMinPaymentChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "minPayment": event.target.value } });
  onLastPaidDateChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "lastPaidDate": event.target.value } });
  onPayFrequencyChange = event => this.setState({ newDebtAccount: { ...this.state.newDebtAccount, "payFrequency": event.target.value } });
  onHouseholdIdChange = (event) => this.setState({ householdId: event.target.value });


  componentDidMount = () => {
    // only fetch accounts if authenticated
    // this isn't true security. authenticate
    // in lambda, too
    this.fetchDebtAccounts();
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h3 className="title">Household ID:</h3>
            <form onSubmit={event => this.handleUpdateHouseholdIdCookie(event)}>
              <div className="field ">
                <div className="control">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter household ID"
                    value={this.state.householdId}
                    onChange={this.onHouseholdIdChange}
                  />
                </div>
              </div>
              <p>
                <button type="submit" className="button is-primary is-medium">
                  Update household ID
              </button>
              </p>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h1 className="title is-1">Manage Debt Accounts</h1>

            <div className="columns">
              <div className="column is-one-third has-background-grey-lighter">
                <form onSubmit={event => this.handleAddDebtAccount(this.state.newDebtAccount.debtAccountId, event)}>
                  <p className="subtitle is-5">Add a new debt account using the form below:</p>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter name</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newDebtAccount.nickName}
                        onChange={this.onNickNameChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter current balance</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newDebtAccount.balance}
                        onChange={this.onBalanceChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter interest rate</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newDebtAccount.rate}
                        onChange={this.onRateChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter minimum payment</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newDebtAccount.minPayment}
                        onChange={this.onMinPaymentChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter last payment date</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newDebtAccount.lastPaidDate}
                        onChange={this.onLastPaidDateChange}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter pay frequency</p>
                      <select
                        className="select is-medium"
                        value={this.state.newDebtAccount.payFrequency}
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
                      <button type="submit" className="button is-primary is-medium">
                        Add debt account
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-12 is-parent  is-vertical">
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}
