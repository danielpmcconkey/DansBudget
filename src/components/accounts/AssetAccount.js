import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';

export default class AssetAccountAdmin extends Component {

    state = {
        isEditMode: false,
        updatedNickName: this.props.nickName,
        updatedBalance: this.props.balance,
        updatedRate: this.props.rate,
        updatedIsTaxAdvantaged: this.props.isTaxAdvantaged,
    }

    handleAssetAccountEdit = event => {
        event.preventDefault();
        this.setState({ isEditMode: true });
    }

    handleEditSave = event => {
        event.preventDefault();
        this.setState({ isEditMode: false });
        this.props.handleUpdateAssetAccount(this.props.assetAccountId, this.state.updatedNickName, this.state.updatedBalance, this.state.updatedRate, this.state.updatedIsTaxAdvantaged);
    }

    onNickNameChange = event => {
        this.setState({ "updatedNickName": event.target.value });
    }
    onBalanceChange = event => this.setState({ "updatedBalance": event.target.value });
    onRateChange = event => this.setState({ "updatedRate": event.target.value });
    onIsTaxAdvantagedChange = event => this.setState({ "updatedIsTaxAdvantaged": event.target.value });

    render() {
        return (
            <div color="info" className="tile is-child box notification has-background-success has-text-light">
                {
                    this.props.isAdmin &&
                    <Fragment>
                        <a href="/" onClick={this.handleAssetAccountEdit} className="account-edit-icon">
                            <FontAwesomeIcon icon="edit" />
                        </a>
                        <button onClick={event => this.props.handleDeleteAssetAccount(this.props.assetAccountId, event)} className="delete"></button>
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
                            <p>Is this a tax advantaged account?</p>
                            <select
                                className="select is-medium"
                                value={this.state.updatedIsTaxAdvantagedy}
                                onChange={this.onIsTaxAdvantagedChange}>
                                <option value="NO">No</option>
                                <option value="YES">Yes</option>
                            </select>
                            <p className="assetAccount-id">id: {this.props.assetAccountId}</p>
                            <button type="submit"
                                className="button is-info is-small"
                                onClick={this.handleEditSave}
                            >save</button>
                        </div>
                        : <div>
                            <p className="account-title">{this.props.nickName}</p>
                            <p className="account-title">balance: <NumberFormat value={this.props.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                            <p className="account-title">estimated rate of return: {this.props.rate}</p>
                            <p className="account-title">tax advantaged?: {this.props.isTaxAdvantaged}</p>
                            <p className="account-id">account ID: {this.props.assetAccountId}</p>
                        </div>
                }
            </div>
        )
    }
}
