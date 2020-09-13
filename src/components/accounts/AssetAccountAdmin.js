import React, { Component, Fragment } from 'react';
import AssetAccount from './AssetAccount';
import axios from "axios";
const multiSort = require('../sharedFunctions/multiSort');
const config = require('../../config.json');


export default class AssetAccountAdmin extends Component {

    token = "";

    state = {
        isUserAuthenticated: false,
        newAssetAccount: {
            "assetAccountid": "",
            "balance": "",
            "householdId": "",
            "isOpen": true,
            "nickName": "",
            "rate": "",
            "isTaxAdvantaged": "NO"
        },
        assetAccounts: [],
        householdId: 'authVal',
    }

    resetNewAssetAccount = async () => {
        this.setState({
            newAssetAccount: {
                "assetAccountid": "",
                "balance": "",
                "householdId": "",
                "isOpen": true,
                "nickName": "",
                "rate": "",
                "isTaxAdvantaged": "NO"
            }
        });
    }

    handleAddAssetAccount = async (assetAccountId, event) => {
        event.preventDefault();
        try {
            const params = {
                "assetAccountId": 'newVal',
                "balance": Number(this.state.newAssetAccount.balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": this.state.newAssetAccount.nickName,
                "rate": Number(this.state.newAssetAccount.rate),
                "isTaxAdvantaged": this.state.isTaxAdvantaged
            };
            const headers = {
                'Content-Type': 'application/json',
                'household-id': this.state.householdId,
                'Authorization': `Bearer ${this.token}`
            };
            const res = await axios.post(`${config.api.invokeUrlAssetAccount}/asset-accounts/newVal`, params, { headers: headers });
            this.state.newAssetAccount = res.data;
            this.setState({
                assetAccounts: multiSort.multiSort([...this.state.assetAccounts, this.state.newAssetAccount], "balance", false)
            });
            await this.resetNewAssetAccount();
        } catch (err) {
            console.log(`Unable to add asset account: ${err}`);
        }
    }

    handleUpdateAssetAccount = async (assetAccountId, nickName, balance, rate, isTaxAdvantaged) => {

        try {
            const params = {
                "assetAccountId": "pathVal",
                "balance": Number(balance),
                "householdId": "headerVal",
                "isOpen": true,
                "nickName": nickName,
                "rate": Number(rate),
                "isTaxAdvantaged": isTaxAdvantaged
            };
            const headers = {
                'Content-Type': 'application/json',
                'household-id': this.state.householdId,
                'Authorization': `Bearer ${this.token}`
            };
            await axios.patch(`${config.api.invokeUrlAssetAccount}/asset-accounts/${assetAccountId}`, params, { headers: headers });
            const assetAccountToUpdate = [...this.state.assetAccounts].find(assetAccount => assetAccount.assetAccountId === assetAccountId);
            const updatedAssetAccounts = [...this.state.assetAccounts].filter(assetAccount => assetAccount.assetAccountId !== assetAccountId);
            assetAccountToUpdate.nickName = nickName;
            assetAccountToUpdate.balance = balance;
            assetAccountToUpdate.rate = rate;
            assetAccountToUpdate.isTaxAdvantaged = isTaxAdvantaged;
            updatedAssetAccounts.push(assetAccountToUpdate);
            this.setState({
                assetAccounts: multiSort.multiSort(updatedAssetAccounts, "balance", false)
            });

        } catch (err) {
            console.log(`Unable to update asset account: ${err}`);
        }
    }

    handleDeleteAssetAccount = async (assetAccountId, event) => {
        event.preventDefault();

        if (window.confirm("Please confirm that you want to delete this item.")) {
            // add call to AWS API Gateway delete assetAccount endpoint here
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'household-id': this.state.householdId,
                    'Authorization': `Bearer ${this.token}`
                };
                await axios.delete(`${config.api.invokeUrlAssetAccount}/asset-accounts/${assetAccountId}`, { headers: headers });
                const updatedAssetAccounts = [...this.state.assetAccounts].filter(assetAccount => assetAccount.assetAccountId !== assetAccountId);
                this.setState({
                    assetAccounts: multiSort.multiSort(updatedAssetAccounts, "balance", false)
                });
            } catch (err) {
                console.log(`Unable to delete asset account: ${err}`);
            }
        }
    }

    fetchAssetAccounts = async () => {
        //this.addemall();
        try {

            console.log(`token: ${this.token}`);
            var url = `${config.api.invokeUrlAssetAccount}/asset-accounts`
            const res = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'household-id': this.state.householdId,
                    'Authorization': `Bearer ${this.token}`
                },
                data: null
            });
            this.setState({
                assetAccounts: multiSort.multiSort(res.data, "balance", false)
            });

        } catch (err) {
            console.log(`An error has occurred: ${err}`);
        }
    }

    onNickNameChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "nickName": event.target.value } });
    onBalanceChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "balance": event.target.value } });
    onRateChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "rate": event.target.value } });
    onIsTaxAdvantagedChange = event => this.setState({ newAssetAccount: { ...this.state.newAssetAccount, "isTaxAdvantaged": event.target.value } });


    componentDidMount = () => {
        if (this.props.auth.user !== null) {
            this.token = this.props.auth.user.signInUserSession.idToken.jwtToken;
            this.setState(
                { isUserAuthenticated: true }
            );
            this.fetchAssetAccounts();
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.isUserAuthenticated ?
                    <section className="section">
                        <div className="container">
                            <h1 className="title is-1">Manage Asset Accounts</h1>

                            <div className="columns">
                                <div className="column is-one-third">
                                    <form onSubmit={event => this.handleAddAssetAccount(this.state.newAssetAccount.assetAccountId, event)}>
                                        <p className="subtitle is-5">Add a new asset account using the form below:</p>
                                        <div className="field has-addons">
                                            <div className="control">
                                                <input
                                                    className="input is-medium"
                                                    type="text"
                                                    placeholder="Enter name"
                                                    value={this.state.newAssetAccount.nickName}
                                                    onChange={this.onNickNameChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="field has-addons">
                                            <div className="control">
                                                <input
                                                    className="input is-medium"
                                                    type="text"
                                                    placeholder="Enter current balance"
                                                    value={this.state.newAssetAccount.balance}
                                                    onChange={this.onBalanceChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="field has-addons">
                                            <div className="control">
                                                <input
                                                    className="input is-medium"
                                                    type="text"
                                                    placeholder="Enter estimated rate of return"
                                                    value={this.state.newAssetAccount.rate}
                                                    onChange={this.onRateChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="field has-addons">
                                            <div className="control">
                                                <select
                                                    className="select is-medium"
                                                    value={this.state.newAssetAccount.isTaxAdvantaged}
                                                    onChange={this.onIsTaxAdvantagedChange}>
                                                    <option value="NO">No</option>
                                                    <option value="YES">Yes</option>
                                                </select>


                                            </div>
                                        </div>

                                        <div className="field has-addons">
                                            <div className="control">
                                                <button type="submit" className="button is-primary is-medium">
                                                    Add asset  account
                      </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="column is-two-thirds">
                                    <div className="tile is-ancestor">
                                        <div className="tile is-12 is-parent  is-vertical">
                                            {
                                                this.state.assetAccounts.map((assetAccount, index) =>
                                                    <AssetAccount
                                                        isAdmin={true}
                                                        handleUpdateAssetAccount={this.handleUpdateAssetAccount}
                                                        handleDeleteAssetAccount={this.handleDeleteAssetAccount}
                                                        nickName={assetAccount.nickName}
                                                        balance={assetAccount.balance}
                                                        rate={assetAccount.rate}
                                                        isTaxAdvantaged={assetAccount.isTaxAdvantaged}
                                                        assetAccountId={assetAccount.assetAccountId}
                                                        key={assetAccount.assetAccountId}
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
