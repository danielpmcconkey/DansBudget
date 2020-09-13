import React, { Component, Fragment } from 'react';
import Budget from './Budget';
import axios from "axios";
var multiSort = require('./multiSort');
const config = require('../../config.json');


export default class BudgetAdmin extends Component {

  token = this.props.auth.user.signInUserSession.idToken.jwtToken;

  state = {
    newBudget: {
      "budgetId": "",
      "householdId": "",
      "nickName": "",
      "amount": ""
    },
    budgets: [],
    householdId: 'authVal',
  }

  resetNewBudget = async () => {
    this.setState({
      newBudget: {
        "budgetId": "",
        "householdId": "",
        "nickName": "",
        "amount": ""
      }
    });
  }

  handleAddBudget = async (budgetId, event) => {
    event.preventDefault();
    try {
      const params = {
        "budgetId": 'newVal',
        "householdId": "headerVal",
        "nickName": this.state.newBudget.nickName,
        "amount": Number(this.state.newBudget.amount)
      };
      const headers = {
        'Content-Type': 'application/json',
        'household-id': this.state.householdId,
        'Authorization': `Bearer ${this.token}`
      };
      const res = await axios.post(`${config.api.invokeUrlBudget}/budgets/newVal`, params, { headers: headers });
      this.state.newBudget = res.data;
      this.setState({
        budgets: multiSort.multiSort([...this.state.budgets, this.state.newBudget], "nickName", true)
      });
      await this.resetNewBudget();
    } catch (err) {
      console.log(`Unable to add budget: ${err}`);
    }
  }

  handleUpdateBudget = async (budgetId, nickName, amount) => {

    try {
      const params = {
        "budgetId": "pathVal",
        "householdId": "headerVal",
        "nickName": nickName,
        "amount": Number(amount)
      };
      console.log(params);
      const headers = {
        'Content-Type': 'application/json',
        'household-id': this.state.householdId,
        'Authorization': `Bearer ${this.token}`
      };
      await axios.patch(`${config.api.invokeUrlBudget}/budgets/${budgetId}`, params, { headers: headers });
      const budgetToUpdate = [...this.state.budgets].find(budget => budget.budgetId === budgetId);
      const updatedBudgets = [...this.state.budgets].filter(budget => budget.budgetId !== budgetId);
      budgetToUpdate.nickName = nickName;
      budgetToUpdate.amount = amount;
      updatedBudgets.push(budgetToUpdate);

      this.setState({
        budgets: multiSort.multiSort(updatedBudgets, "nickName", true)
      });

    } catch (err) {
      console.log(`Unable to update budget: ${err}`);
    }
  }

  handleDeleteBudget = async (budgetId, event) => {
    event.preventDefault();

    if (window.confirm("Please confirm that you want to delete this item.")) {
      // add call to AWS API Gateway delete budget endpoint here
      try {
        const headers = {
          'Content-Type': 'application/json',
          'household-id': this.state.householdId,
          'Authorization': `Bearer ${this.token}`
        };
        await axios.delete(`${config.api.invokeUrlBudget}/budgets/${budgetId}`, { headers: headers });
        const updatedBudgets = [...this.state.budgets].filter(budget => budget.budgetId !== budgetId);
        this.setState({
          budgets: multiSort.multiSort(updatedBudgets, "nickName", true)
        });
      } catch (err) {
        console.log(`Unable to delete budget: ${err}`);
      }
    }
  }



  fetchBudgets = async () => {
    //this.addemall();
    try {
      console.log(`token: ${this.token}`);
      var url = `${config.api.invokeUrlBudget}/budgets`
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
        budgets: multiSort.multiSort(res.data, "nickName", true)
      });

    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onNickNameChange = event => this.setState({ newBudget: { ...this.state.newBudget, "nickName": event.target.value } });
  onAmountChange = event => this.setState({ newBudget: { ...this.state.newBudget, "amount": event.target.value } });

  componentDidMount = () => {
    this.fetchBudgets();
  }

  render() {
    return (
      <Fragment>


        <section className="section">
          <div className="container">
            <h1 className="title is-1">Manage Budgets</h1>

            <div className="columns">
              <div className="column is-one-third has-background-grey-lighter">
                <form onSubmit={event => this.handleAddBudget(this.state.newBudget.budgetId, event)}>
                  <p className="subtitle is-5">Add a new budget using the form below:</p>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter name</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newBudget.nickName}
                        onChange={this.onNickNameChange}
                      />
                    </div>
                  </div>
                  <div className="field has-addons">
                    <div className="control">
                      <p className="fieldLabel">Enter amount</p>
                      <input
                        className="input is-medium"
                        type="text"
                        value={this.state.newBudget.amount}
                        onChange={this.onAmountChange}
                      />
                    </div>
                  </div>

                  <div className="field has-addons">
                    <div className="control">
                      <button type="submit" className="button is-primary is-medium">
                        Add budget
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-12 is-parent  is-vertical">
                    {
                      this.state.budgets.map((budget, index) =>
                        <Budget
                          isAdmin={true}
                          handleUpdateBudget={this.handleUpdateBudget}
                          handleDeleteBudget={this.handleDeleteBudget}
                          nickName={budget.nickName}
                          amount={budget.amount}
                          budgetId={budget.budgetId}
                          key={budget.budgetId}
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
