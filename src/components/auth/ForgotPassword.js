import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Form, Nav, Container } from 'react-bootstrap';

class ForgotPassword extends Component {
    state = {
        email: "",
        errors: []
    }

    validateFormState = async () => {
        var isValid = true;
        if (this.state.email === "") {
            await this.setState({
                errors: this.state.errors.concat('Email address field is blank.')
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
                await Auth.forgotPassword(this.state.email);
                this.props.history.push('ForgotPasswordVerification');
            } catch (err) {
                // console.log(err);
                this.props.onChangeMessage(`An error has occurred: ${err}`, "danger", "Error", true);
            }
        }
        else {
            var err = "";
            for (var i = 0; i < this.state.errors.length; i++) {
                err += this.state.errors[i];
            }
            this.props.onChangeMessage(`Error message(s): ${err}`, "danger", "Error validating log in form", true);
        }
    }
    onEmailChange = event => this.setState({ email: event.target.value });



    render() {
        return (
            <Container className="new-account-form">
                <h1>Forgot your password?</h1>
                <p>Please enter the email address associated with your account and we'll
                email you a password reset link.</p>


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

export default ForgotPassword;