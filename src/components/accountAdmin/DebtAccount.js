import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';

export default class DebtAccountAdmin extends Component {

  state = {
    isEditMode: false,
    updatedNickName: this.props.nickName,
    updatedBalance: this.props.balance,
    updatedRate: this.props.rate,
    updatedMinPayment: this.props.minPayment,
    updatedLastPaidDate: this.props.lastPaidDate,
    updatedPayFrequency: this.props.payFrequency,
  }

  handleDebtAccountEdit = event => {
    event.preventDefault();
    this.setState({ isEditMode: true });
  }

  handleEditSave = event => {
    event.preventDefault();
    this.setState({ isEditMode: false });
    this.props.handleUpdateDebtAccount(this.props.debtAccountId, this.state.updatedNickName, this.state.updatedBalance, this.state.updatedRate, this.state.updatedMinPayment, this.state.updatedLastPaidDate, this.state.updatedPayFrequency);
  }

  onNickNameChange = event => {
    this.setState({ "updatedNickName": event.target.value });
  }
  onBalanceChange = event => this.setState({ "updatedBalance": event.target.value });
  onRateChange = event => this.setState({ "updatedRate": event.target.value });
  onMinPaymentChange = event => this.setState({ "updatedMinPayment": event.target.value });
  onLastPaidDateChange = event => this.setState({ "updatedLastPaidDate": event.target.value });
  onPayFrequencyChange = event => this.setState({ "updatedPayFrequency": event.target.value });


  render() {
    return (
      <div color="info" className="tile is-child box notification has-background-success has-text-light">
        {
          this.props.isAdmin &&
          <Fragment>
            <a href="/" onClick={this.handleDebtAccountEdit} className="account-edit-icon">
              <FontAwesomeIcon icon="edit" />
            </a>
            <button onClick={event => this.props.handleDeleteDebtAccount(this.props.debtAccountId, event)} className="delete"></button>
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
              <p>Edit balance</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter balance"
                value={this.state.updatedBalance}
                onChange={this.onBalanceChange}
              />
              <p>Edit rate</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter rate"
                value={this.state.updatedRate}
                onChange={this.onRateChange}
              />
              <p>Edit minimum payment</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter minimum payment"
                value={this.state.updatedMinPayment}
                onChange={this.onMinPaymentChange}
              />
              <p>Edit last paid date</p>
              <input
                className="input is-medium"
                type="text"
                placeholder="YYYY-MM-DD"
                value={this.state.updatedLastPaidDate}
                onChange={this.onLastPaidDateChange}
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
              <p className="account-id">id: {this.props.debtAccountId}</p>
              <button type="submit"
                className="button is-info is-small"
                onClick={this.handleEditSave}
              >save</button>
            </div>
            : <div>
              <p className="account-title">{this.props.nickName}</p>
              <p className="account-title">balance: <NumberFormat value={this.props.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
              <p className="account-title">interest rate: {this.props.rate}</p>
              <p className="account-id">min payment: {this.props.minPayment}</p>
              <p className="account-id">last paid date: {this.props.lastPaidDate}</p>
              <p className="account-id">pay frequency: {this.props.payFrequency}</p>
              <p className="account-id">account ID: {this.props.debtAccountId}</p>
            </div>
        }
      </div>
    )
  }
}
