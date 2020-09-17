import React, { Component } from 'react'
import { Auth } from 'aws-amplify';
import { Redirect } from 'react-router-dom';



export default class Navbar extends Component {


    addListenerToHamburger = () => {
        var burger = document.querySelector('.navbar-burger');
        var menu = document.querySelector('.navbar-menu');
        burger.addEventListener('click', function () {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
    componentDidMount = () => {
        this.addListenerToHamburger();
    }


    render() {
        return (

            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        Dan's Budget
                     </a>
                    {/* note: do not put an href in the below anchor, despite what it says in compiler warnings
                    doing so will break the burger's "expand" ability. the below comment will tell the
                    compiler to ignore it */}
                    {/* eslint-disable-next-line */}
                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item" href="/">Home</a>
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

                        {this.props.auth.isAuthenticated && (
                            <a href="/Simulation" className="navbar-item">
                                Run simulation
                            </a>
                        )}
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
                                    <a href="/logout" className="button is-light">
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
