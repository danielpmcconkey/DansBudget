import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';

export default class BudgetAdmin extends Component {

  state = {
    isEditMode: false,
    updatedNickName: this.props.nickName,
    updatedAmount: this.props.amount,
  }

  handleBudgetEdit = event => {
    event.preventDefault();
    this.setState({ isEditMode: true });
  }

  handleEditSave = event => {
    event.preventDefault();
    this.setState({ isEditMode: false });
    this.props.handleUpdateBudget(this.props.budgetId, this.state.updatedNickName, this.state.updatedAmount);
  }

  onNickNameChange = event => {
    this.setState({ "updatedNickName": event.target.value });
  }
  onAmountChange = event => this.setState({ "updatedAmount": event.target.value });



  render() {
    return (
      <div color="info" className="tile is-child box notification has-background-success has-text-light">
        {
          this.props.isAdmin &&
          <Fragment>
            <a href="/" onClick={this.handleBudgetEdit} className="account-edit-icon">
              <FontAwesomeIcon icon="edit" />
            </a>
            <button onClick={event => this.props.handleDeleteBudget(this.props.budgetId, event)} className="delete"></button>
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
              <p>Edit amount</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter minimum payment"
                value={this.state.updatedAmount}
                onChange={this.onAmountChange}
              />
              <p className="account-id">id: {this.props.budgetId}</p>
              <button type="submit"
                className="button is-info is-small"
                onClick={this.handleEditSave}
              >save</button>
            </div>
            : <div>
              <p className="account-title">{this.props.nickName}</p>
              <p className="account-id">amount: {this.props.amount}</p>
              <p className="account-id">ID: {this.props.budgetId}</p>
            </div>
        }
      </div>
    )
  }
}
