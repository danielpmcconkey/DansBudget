import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import { Form, Nav, Container } from 'react-bootstrap';

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
        errors: []
    }

    validateFormState = async () => {
        var isValid = true;
        if (this.state.username === "") {
            await this.setState({
                errors: this.state.errors.concat('User name field is blank.')
            });
            isValid = false;
        }
        if (this.state.email === "") {
            await this.setState({
                errors: this.state.errors.concat('Email field is blank.')
            });
            isValid = false;
        }
        if (this.state.password === "") {
            await this.setState({
                errors: this.state.errors.concat('Password field is blank.')
            });
            isValid = false;
        }
        if (this.state.confirmpassword === "") {
            await this.setState({
                errors: this.state.errors.concat('Password confirmation field is blank.')
            });
            isValid = false;
        }
        if (this.state.password !== this.state.confirmpassword) {
            await this.setState({
                errors: this.state.errors.concat('Password fields do not match.')
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
            const { username, email, password } = this.state;
            try {
                await Auth.signUp({
                    username,
                    password,
                    attributes: {
                        email: email
                    }
                });
                // this.props.onChangeMessage(signUpResponse, "success", "Registration success", true);
                this.props.history.push("/welcome");
            } catch (err) {
                this.props.onChangeMessage(`Error message: ${err.message}`, "danger", "Error submitting registration form", true);
            }
        }
        else {
            var err = "";
            for (var i = 0; i < this.state.errors.length; i++) {
                err += this.state.errors[i];
            }
            this.props.onChangeMessage(`Error message(s): ${err}`, "danger", "Error validating registration form", true);
        }
    };

    onUserNameChange = event => this.setState({ username: event.target.value });
    onEmailChange = event => this.setState({ email: event.target.value });
    onPasswordChange = event => this.setState({ password: event.target.value });
    onConfirmpasswordChange = event => this.setState({ confirmpassword: event.target.value });

    render() {
        return (
            <Container className="new-account-form">
                <h1>Register</h1>
                {/* <FormErrors formerrors={this.state.errors} /> */}

                <Form onSubmit={this.handleSubmit}>
                    <p className="account-card-form-label">User name:</p>
                    <Form.Control type="text"
                        placeholder="Enter username"
                        value={this.state.username}
                        onChange={this.onUserNameChange}
                        id="username"
                    />
                    <p className="account-card-form-label">Email:</p>
                    <Form.Control type="text"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        id="email"
                    />
                    <p className="account-card-form-label">Password:</p>
                    <Form.Control type="password"
                        placeholder="Enter password"
                        value={this.state.password}
                        onChange={this.onPasswordChange}
                        id="password"
                    />
                    <p className="account-card-form-label">Confirm password:</p>
                    <Form.Control type="password"
                        placeholder="Confirm password"
                        value={this.state.confirmpassword}
                        onChange={this.onConfirmpasswordChange}
                        id="confirmpassword"
                    />

                    <Form.Group>
                        <Nav variant="pills" defaultActiveKey="#first" style={{ marginTop: '1em' }}>
                            <Nav.Item style={{ marginRight: '1em' }}>
                                <Nav.Link className="orangeButton" href="#first" onClick={this.handleSubmit}>Register</Nav.Link>
                                {/* <Button
                                    className="orangeButton"
                                    type="submit"
                                    style={{ marginTop: '1em' }}
                                    variant="primary">
                                    Register
                            </Button> */}
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="orangeButtonOutline" href="/forgotpassword">Forgot password?</Nav.Link>
                                {/* <Button className="orangeButtonOutline" href="/forgotpassword">Forgot password?</Button> */}
                            </Nav.Item>
                        </Nav>




                    </Form.Group>
                </Form>
            </Container>

        );
    }
}

export default Register;