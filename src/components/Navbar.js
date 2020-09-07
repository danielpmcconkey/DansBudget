import React, { Component } from 'react'
import { Auth } from 'aws-amplify';

export default class Navbar extends Component {
    handleLogOut = async event => {
        event.preventDefault();
        try {
            Auth.signOut();
            this.props.auth.setAuthStatus(false);
            this.props.auth.setUser(null);
        } catch (error) {
            console.log(error.message);
        }
    }
    render() {
        return (

            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        Dan's Budget
          </a>

                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">

                    <div className="navbar-start">
                        <a className="navbar-item" href="/">Home</a>
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                Manage household and accounts
              </a>
                            <div className="navbar-dropdown">
                                {this.props.auth.isAuthenticated && (
                                    <a href="/assetAccounts" className="navbar-item">
                                        Manage Asset Accounts
                                    </a>
                                )}
                                {this.props.auth.isAuthenticated && (
                                    <a href="/debtAccounts" className="navbar-item">
                                        Manage Debt Accounts
                                    </a>
                                )}
                                {this.props.auth.isAuthenticated && (
                                    <a href="/bills" className="navbar-item">
                                        Manage Bills
                                    </a>
                                )}
                                {this.props.auth.isAuthenticated && (
                                    <a href="/budgets" className="navbar-item">
                                        Manage Budgets
                                    </a>
                                )}
                                {this.props.auth.isAuthenticated && (
                                    <a href="/properties" className="navbar-item">
                                        Manage Properties
                                    </a>
                                )}
                                <hr className="navbar-divider"></hr>
                                {this.props.auth.isAuthenticated && (
                                    <a href="/Simulation" className="navbar-item">
                                        Run simulation
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            {this.props.auth.isAuthenticated && this.props.auth.user && (
                                <p>Hello {this.props.auth.user.username}</p>
                            )}
                            <div className="buttons">
                                {!this.props.auth.isAuthenticated && (
                                    <div>
                                        <a href="/register" className="button is-primary">
                                            <strong>Sign up</strong>
                                        </a>
                                        <a href="/login" className="button is-light">
                                            Log in
                </a>
                                    </div>
                                )}
                                {this.props.auth.isAuthenticated && (
                                    <a href="/" onClick={this.handleLogOut} className="button is-light">
                                        Log out
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </nav>
        )
    }
}
