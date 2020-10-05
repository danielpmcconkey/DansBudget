import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Form, Nav, Container } from 'react-bootstrap';

class ChangePassword extends Component {
    state = {
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
        errors: []
    }

    validateFormState = async () => {
        var isValid = true;

        if (this.state.oldpassword === "") {
            await this.setState({
                errors: this.state.errors.concat('Old password field is blank.')
            });
            isValid = false;
        }
        if (this.state.newpassword === "") {
            await this.setState({
                errors: this.state.errors.concat('New password field is blank.')
            });
            isValid = false;
        }
        if (this.state.confirmpassword === "") {
            await this.setState({
                errors: this.state.errors.concat('Confirm password field is blank.')
            });
            isValid = false;
        }
        if (this.state.confirmpassword !== this.state.newpassword) {
            await this.setState({
                errors: this.state.errors.concat('New password and confirm password fields do not match.')
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
                const user = await Auth.currentAuthenticatedUser();
                // console.log(user);
                await Auth.changePassword(
                    user,
                    this.state.oldpassword,
                    this.state.newpassword,
                );
                this.props.history.push('/ChangePasswordConfirmation');
            } catch (error) {
                this.props.onChangeMessage(`An error has occurred: ${error}`, "danger");

            }
        }
        else {
            var err = "";
            for (var i = 0; i < this.state.errors.length; i++) {
                err += this.state.errors[i];
            }
            this.props.onChangeMessage(`Error message(s): ${err}`, "danger", "Error validating change password form", true);
        }
    };

    onOldPasswordChange = event => this.setState({ oldpassword: event.target.value });
    onNewPasswordChange = event => this.setState({ newpassword: event.target.value });
    onConfirmPasswordChange = event => this.setState({ confirmpassword: event.target.value });

    render() {
        return (
            <Container className="new-account-form">
                <h1>Change Password</h1>


                <Form>
                    <p className="account-card-form-label">Old password:</p>
                    <Form.Control type="password"
                        placeholder="Old password"
                        value={this.state.oldpassword}
                        onChange={this.onOldPasswordChange}
                        id="oldpassword"
                    />
                    <p className="account-card-form-label">New password:</p>
                    <Form.Control type="password"
                        placeholder="New password"
                        value={this.state.newpassword}
                        onChange={this.onNewPasswordChange}
                        id="newpassword"
                    />
                    <p className="account-card-form-label">Confirm password:</p>
                    <Form.Control type="password"
                        placeholder="Confirm password"
                        value={this.state.confirmpassword}
                        onChange={this.onConfirmPasswordChange}
                        id="confirmpassword"
                    />
                </Form>
                <Form.Group>
                    <Nav variant="pills" defaultActiveKey="#first" style={{ marginTop: '1em' }}>
                        <Nav.Item style={{ marginRight: '1em' }}>
                            <Nav.Link className="orangeButton" href="#first" onClick={this.handleSubmit}>Change password</Nav.Link>
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

export default ChangePassword;