import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import { Form, Nav, Container } from 'react-bootstrap';


class LogIn extends Component {
    state = {
        username: "",
        password: "",
        errors: []
    };
    validateFormState = async () => {
        var isValid = true;
        if (this.state.username === "") {
            await this.setState({
                errors: this.state.errors.concat('User name field is blank.')
            });
            isValid = false;
        }
        if (this.state.password === "") {
            await this.setState({
                errors: this.state.errors.concat('Password field is blank.')
            });
            isValid = false;
        }
        return isValid;
    }
    handleSubmit = async event => {
        event.preventDefault();

        // Form validation
        // clear error state
        await this.setState({ errors: [] });
        const isValid = await this.validateFormState();
        if (isValid) {
            // AWS Cognito integration here
            try {
                const user = await Auth.signIn(this.state.username, this.state.password);
                this.props.auth.setAuthStatus(true);
                this.props.auth.setUser(user);
                this.props.history.push("/");
            } catch (err) {
                this.props.onChangeMessage(`Error message: ${err.message}`, "danger", "Error submitting log in form", true);
            }
        }
        else {
            var err = "";
            for (var i = 0; i < this.state.errors.length; i++) {
                err += this.state.errors[i];
            }
            this.props.onChangeMessage(`Error message(s): ${err}`, "danger", "Error validating log in form", true);
        }
    };


    onUserNameChange = event => this.setState({ username: event.target.value });
    onPasswordChange = event => this.setState({ password: event.target.value });

    render() {
        return (
            <Container className="new-account-form">
                <h1>Log in</h1>
                <Form onSubmit={this.handleSubmit}>
                    <p className="account-card-form-label">User name:</p>
                    <Form.Control type="text"
                        placeholder="Enter username"
                        value={this.state.username}
                        onChange={this.onUserNameChange}
                        id="username"
                    />
                    <p className="account-card-form-label">Password:</p>
                    <Form.Control type="password"
                        placeholder="Enter password"
                        value={this.state.password}
                        onChange={this.onPasswordChange}
                        id="password"
                    />
                </Form>
                <Form.Group>
                    <Nav variant="pills" defaultActiveKey="#first" style={{ marginTop: '1em' }}>
                        <Nav.Item style={{ marginRight: '1em' }}>
                            <Nav.Link className="orangeButton" href="#first" onClick={this.handleSubmit}>Log in</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="orangeButtonOutline" href="/forgotpassword">Forgot password?</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Form.Group>
            </Container>

        );
    }
}

export default LogIn;