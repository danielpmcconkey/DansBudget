import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navbar';
import Home from './components/Home';
import AssetAccountAdmin from './components/accountAdmin/AssetAccountAdmin';
import DebtAccountAdmin from './components/accountAdmin/DebtAccountAdmin';
import BillAdmin from './components/accountAdmin/BillAdmin';
import BudgetAdmin from './components/accountAdmin/BudgetAdmin';
import PropertyAdmin from './components/accountAdmin/PropertyAdmin';
import EmployerAdmin from './components/accountAdmin/EmployerAdmin';
import Simulation from './components/Simulation';
import Test from './components/Test';
import LogIn from './components/auth/LogIn';
import LogOut from './components/auth/LogOut';
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
import AlertDismissible from './components/AlertDismissable';

library.add(faEdit);

class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null,
    ResultsViewHeader: "Empty",
    ResultsViewMessage: "No current message to display",
    ResultsViewMode: "light", // 'primary','secondary','success', 'danger', 'warning', 'info', 'light', 'dark',
    shouldAlertShow: false
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }

  async componentDidMount() {
    try {
      const authData = await Auth.currentSession(); // idToken.payload.auth_time
      const authTime = authData.idToken.payload.auth_time;
      const nowTime = Date.now() / 1000;
      //console.log(`number of seconds since authN: ${nowTime - authTime} | ${JSON.stringify(authData.idToken.payload)}`);

      if (nowTime - authTime > (60 * 60 * 2)) {  // 2 hours
        // auto log out. no sessions allowed longer than 2 hours
        // this is to mitigate the fact that amplify seems to
        // refresh the token no matter what if expired
        Auth.signOut();
        this.setAuthStatus(false);
        this.setUser(null);
        this.setState({
          ResultsViewHeader: "Logged out",
          ResultsViewMessage: "You have been automatically logged out due to inactivity.",
          ResultsViewMode: "info",
          shouldAlertShow: true
        });

      } else {
        this.setAuthStatus(true)
        const user = await Auth.currentAuthenticatedUser();
        this.setUser(user);
      }



    } catch (error) {
      if (error === "No current user") {
        // swallow error
      }
      else {
        this.setState({
          ResultsViewMessage: `An error has occurred: ${error}`,
          ResultsViewMode: "danger",
          ResultsViewHeader: "Error",
          shouldAlertShow: true
        });
      }
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
    const onChangeMessage = (ResultsViewMessage, ResultsViewMode, ResultsViewHeader, shouldAlertShow) => {
      this.setState({
        ResultsViewMessage: ResultsViewMessage,
        ResultsViewMode: ResultsViewMode,
        ResultsViewHeader: ResultsViewHeader,
        shouldAlertShow: shouldAlertShow
      });
    }
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <div>
            <Navigation auth={authProps} />
            {/* <ResultsView ResultsViewMessage={this.state.ResultsViewMessage} ResultsViewMode={this.state.ResultsViewMode} /> */}
            <AlertDismissible
              ResultsViewHeader={this.state.ResultsViewHeader}
              ResultsViewMessage={this.state.ResultsViewMessage}
              ResultsViewMode={this.state.ResultsViewMode}
              shouldAlertShow={this.state.shouldAlertShow}
              onChangeMessage={onChangeMessage}
            />
            <Switch>
              <Route exact path="/" render={(props) => <Home {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/assetAccounts" render={(props) => <AssetAccountAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/debtAccounts" render={(props) => <DebtAccountAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/bills" render={(props) => <BillAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/budgets" render={(props) => <BudgetAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/properties" render={(props) => <PropertyAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/employers" render={(props) => <EmployerAdmin {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/simulation" render={(props) => <Simulation {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/Test" render={(props) => <Test {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/login" render={(props) => <LogIn {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/logout" render={(props) => <LogOut {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/register" render={(props) => <Register {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/forgotpasswordverification" render={(props) => <ForgotPasswordVerification {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/changepassword" render={(props) => <ChangePassword {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/changepasswordconfirmation" render={(props) => <ChangePasswordConfirm {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
              <Route exact path="/welcome" render={(props) => <Welcome {...props} auth={authProps} onChangeMessage={onChangeMessage} />} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
