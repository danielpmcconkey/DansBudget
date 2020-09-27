import React, { Component } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

export default class Navigation extends Component {





    render() {
        return (
            <div>
                <Navbar className="navbar" expand="lg">
                    <Navbar.Brand href="/"><img src="dansbudgetlogo.png" alt="Dan's Budget" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            {this.props.auth.isAuthenticated && (
                                <NavDropdown title="Actions" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/assetAccounts">Manage Asset Accounts</NavDropdown.Item>
                                    <NavDropdown.Item href="/debtAccounts">Manage Debt Accounts</NavDropdown.Item>
                                    <NavDropdown.Item href="/bills" >Manage Bills</NavDropdown.Item>
                                    <NavDropdown.Item href="/budgets" >Manage Budgets</NavDropdown.Item>
                                    <NavDropdown.Item href="/properties" >Manage Properties</NavDropdown.Item>
                                    <NavDropdown.Item href="/employers" >Manage Employers</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/Simulation" >Run simulation</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                    {this.props.auth.isAuthenticated !== true && (
                        <>
                            <Button className="orangeButton" href="/register">Sign up</Button> &nbsp;
                            <Button className="orangeButtonOutline" href="/login">Log in</Button>
                        </>
                    )}
                    {this.props.auth.isAuthenticated && this.props.auth.user && (
                        <Navbar.Text>Logged in as: {this.props.auth.user.username}&nbsp;</Navbar.Text>
                    )}
                    {this.props.auth.isAuthenticated && (
                        <>
                            <Button className="logoutButton" href="/logout">Log out</Button>
                        </>
                    )}
                </Navbar>
            </div>

        )
    }
}
