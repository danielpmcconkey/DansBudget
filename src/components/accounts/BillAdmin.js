import React, { Component, Fragment } from 'react';
import Bill from './Bill';
import axios from "axios";
var multiSort = require('./multiSort');
const config = require('../../config.json');


export default class BillAdmin extends Component {

  token = this.props.auth.user.signInUserSession.idToken.jwtToken;

  state = {
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
        'household-id': this.state.householdId,
        'Authorization': `Bearer ${this.token}`
      };
      const res = await axios.post(`${config.api.invokeUrlBill}/bills/newVal`, params, { headers: headers });
      this.state.newBill = res.data;
      this.setState({
        bills: multiSort.multiSort([...this.state.bills, this.state.newBill], "nickName", true)
      });
      await this.resetNewBill();
    } catch (err) {
      console.log(`Unable to add bill: ${err}`);
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
      console.log(params);
      const headers = {
        'Content-Type': 'application/json',
        'household-id': this.state.householdId,
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

    } catch (err) {
      console.log(`Unable to update bill: ${err}`);
    }
  }

  handleDeleteBill = async (billId, event) => {
    event.preventDefault();

    if (window.confirm("Please confirm that you want to delete this item.")) {
      // add call to AWS API Gateway delete bill endpoint here
      try {
        const headers = {
          'Content-Type': 'application/json',
          'household-id': this.state.householdId,
          'Authorization': `Bearer ${this.token}`
        };
        await axios.delete(`${config.api.invokeUrlBill}/bills/${billId}`, { headers: headers });
        const updatedBills = [...this.state.bills].filter(bill => bill.billId !== billId);
        this.setState({
          bills: multiSort.multiSort(updatedBills, "nickName", true)
        });
      } catch (err) {
        console.log(`Unable to delete bill: ${err}`);
      }
    }
  }



  fetchBills = async () => {
    //this.addemall();
    try {
      console.log(`token: ${this.token}`);
      var url = `${config.api.invokeUrlBill}/bills`
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
        bills: multiSort.multiSort(res.data, "nickName", true)
      });

    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onNickNameChange = event => this.setState({ newBill: { ...this.state.newBill, "nickName": event.target.value } });
  onAmountDueChange = event => this.setState({ newBill: { ...this.state.newBill, "amountDue": event.target.value } });
  onLastPaidDateChange = event => this.setState({ newBill: { ...this.state.newBill, "lastPaidDate": event.target.value } });
  onPayFrequencyChange = event => this.setState({ newBill: { ...this.state.newBill, "payFrequency": event.target.value } });


  componentDidMount = () => {

    this.fetchBills();
  }

  render() {
    return (
      <Fragment>


        <section className="section">
          <div className="container">
            <h1 className="title is-1">Manage Bills</h1>

            <div className="columns">
              <div className="column is-one-third has-background-grey-lighter">
                <form onSubmit={event => this.handleAddBill(this.state.newBill.billId, event)}>
                  <p className="subtitle is-5">Add a new bill using the form below:</p>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter name</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newBill.nickName}
                        onChange={this.onNickNameChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter amount due</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newBill.amountDue}
                        onChange={this.onAmountDueChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter last payment date</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newBill.lastPaidDate}
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
                        value={this.state.newBill.payFrequency}
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
                        Add bill
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-12 is-parent  is-vertical">
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}
