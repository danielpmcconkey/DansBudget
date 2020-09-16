import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AssetAccountAdmin from './components/accounts/AssetAccountAdmin';
import DebtAccountAdmin from './components/accounts/DebtAccountAdmin';
import BillAdmin from './components/accounts/BillAdmin';
import BudgetAdmin from './components/accounts/BudgetAdmin';
import PropertyAdmin from './components/accounts/PropertyAdmin';
import Simulation from './components/accounts/Simulation';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ResultsView from './components/ResultsView';

library.add(faEdit);

class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
    ResultsViewMessage: "No current message to display",
    ResultsViewMode: "hidden" // hidden, danger, success, warning
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.setAuthStatus(true)
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);
    } catch (error) {
      console.log(error);
    }
    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    }
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <div>
            <Navbar auth={authProps} />
            <ResultsView message={this.state.ResultsViewMessage} mode={this.state.ResultsViewMode} />
            <Switch>
              <Route exact path="/" render={(props) => <Home {...props} auth={authProps} ResultsViewMessage={this.state.ResultsViewMessage} ResultsViewMode={this.state.ResultsViewMode} />} />
              <Route exact path="/assetAccounts" render={(props) => <AssetAccountAdmin {...props} auth={authProps} />} />
              <Route exact path="/debtAccounts" render={(props) => <DebtAccountAdmin {...props} auth={authProps} />} />
              <Route exact path="/bills" render={(props) => <BillAdmin {...props} auth={authProps} />} />
              <Route exact path="/budgets" render={(props) => <BudgetAdmin {...props} auth={authProps} />} />
              <Route exact path="/properties" render={(props) => <PropertyAdmin {...props} auth={authProps} />} />
              <Route exact path="/simulation" render={(props) => <Simulation {...props} auth={authProps} />} />
              <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} />} />
              <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} />} />
              <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} />} />
              <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} />} />
              <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} />} />
              <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} />} />
              <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} />} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
