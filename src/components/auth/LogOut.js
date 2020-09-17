import React, { Component } from 'react';
import { Auth } from "aws-amplify";


class LogOut extends Component {

    componentDidMount = () => {
        try {
            Auth.signOut();
            this.props.auth.setAuthStatus(false);
            this.props.auth.setUser(null);
            this.props.history.push("/");
        } catch (error) {
            this.props.onChangeMessage(`An error occurred on log out: ${error}`, "danger");
        }

    }
    render() {
        return (
            <section className="section auth">
                <div className="container">
                    <h1>You are logge out.</h1>
                    <p>If your browser did not redirect you automatically, click <a href="/">here</a> to go to the home page.</p>
                </div>
            </section>
        );
    }
}

export default LogOut;