import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class BillAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedAmountDue: this.props.amountDue,
        updatedLastPaidDate: this.props.lastPaidDate,
        updatedPayFrequency: this.props.payFrequency,
    }

    handleBillEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateBill(this.props.billId, this.state.updatedNickName, this.state.updatedAmountDue, this.state.updatedLastPaidDate, this.state.updatedPayFrequency);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onAmountDueChange = event => this.setState({ "updatedAmountDue": event.target.value });
    onLastPaidDateChange = event => this.setState({ "updatedLastPaidDate": event.target.value });
    onPayFrequencyChange = event => this.setState({ "updatedPayFrequency": event.target.value });


    render() {
        return (
            <div color="info" className="tile is-child box notification has-background-success has-text-light">
                {
                    this.props.isAdmin &&
                    <Fragment>
                        <a href="/" onClick={this.handleBillEdit} className="account-edit-icon">
                            <FontAwesomeIcon icon="edit" />
                        </a>
                        <button onClick={event => this.props.handleDeleteBill(this.props.billId, event)} className="delete"></button>
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
                            <p>Edit amount due</p>
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Enter minimum payment"
                                value={this.state.updatedAmountDue}
                                onChange={this.onAmountDueChange}
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
                            <p className="account-id">id: {this.props.billId}</p>
                            <button type="submit"
                                className="button is-info is-small"
                                onClick={this.handleEditSave}
                            >save</button>
                        </div>
                        : <div>
                            <p className="account-title">{this.props.nickName}</p>
                            <p className="account-id">amount due: {this.props.amountDue}</p>
                            <p className="account-id">last paid date: {this.props.lastPaidDate}</p>
                            <p className="account-id">pay frequency: {this.props.payFrequency}</p>
                            <p className="account-id">ID: {this.props.billId}</p>
                        </div>
                }
            </div>
        )
    }
}
