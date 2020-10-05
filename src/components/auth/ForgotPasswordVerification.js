import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Form, Nav, Container } from 'react-bootstrap';

class ForgotPasswordVerification extends Component {
    state = {
        verificationcode: "",
        email: "",
        newpassword: "",
        errors: []
    };

    validateFormState = async () => {
        var isValid = true;
        if (this.state.email === "") {
            await this.setState({
                errors: this.state.errors.concat('Email address field is blank.')
            });
            isValid = false;
        }
        if (this.state.verificationcode === "") {
            await this.setState({
                errors: this.state.errors.concat('Verification code field is blank.')
            });
            isValid = false;
        }
        if (this.state.newpassword === "") {
            await this.setState({
                errors: this.state.errors.concat('New password field is blank.')
            });
            isValid = false;
        }
        return isValid;
    }

    clearErrorState = async () => {
        const cleanSlate = [];
        await this.setState({ errors: cleanSlate });
    }

    handleSubmit = async event => {
        event.preventDefault();

        // Form validation
        await this.clearErrorState();


        alert(JSON.stringify(`errors: ${this.state.errors}`));
        const isValid = await this.validateFormState();
        if (isValid) {

            // AWS Cognito integration here
            try {
                await Auth.forgotPasswordSubmit(
                    this.state.email,
                    this.state.verificationcode,
                    this.state.newpassword
                );
                this.props.history.push('/ChangePasswordConfirmation');
            } catch (err) {
                this.props.onChangeMessage(`An error has occurred: ${err}`, "danger");
                //console.log(error);
            }
        }
        else {
            alert(JSON.stringify(`errors2: ${this.state.errors}`));
            var err = "";
            for (var i = 0; i < this.state.errors.length; i++) {
                err += this.state.errors[i];
            }
            this.props.onChangeMessage(`Error message(s): ${err}`, "danger", "Error validating verification form", true);
        }
    };

    onEmailChange = event => this.setState({ email: event.target.value });
    onVerificationCodeChange = event => this.setState({ verificationcode: event.target.value });
    onNewPasswordChange = event => this.setState({ newpassword: event.target.value });

    render() {
        return (
            <Container className="new-account-form">
                <h1>Set new password</h1>
                <p>
                    Please enter the verification code sent to your email address below,
                    your email address and a new password.
                </p>

                <Form>


                    <p className="account-card-form-label">Email address:</p>
                    <Form.Control
                        type="email"
                        className="input"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.onEmailChange}
                    />
                    <p className="account-card-form-label">Verification code:</p>
                    <Form.Control
                        type="text"
                        className="input"
                        id="verificationcode"
                        aria-describedby="verificationCodeHelp"
                        placeholder="Enter verification code"
                        value={this.state.verificationcode}
                        onChange={this.onVerificationCodeChange}
                    />
                    <p className="account-card-form-label">New password:</p>
                    <Form.Control
                        type="password"
                        className="input"
                        id="newpassword"
                        placeholder="New password"
                        value={this.state.newpassword}
                        onChange={this.onNewPasswordChange}
                    />

                </Form>
                <Form.Group>
                    <Nav variant="pills" defaultActiveKey="#first" style={{ marginTop: '1em' }}>
                        <Nav.Item style={{ marginRight: '1em' }}>
                            <Nav.Link className="orangeButton" href="#first" onClick={this.handleSubmit}>Submit</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Form.Group>
            </Container>

        );
    }
}

export default ForgotPasswordVerification;