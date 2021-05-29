import Login from "./components/layouts/Login.js";
import SignUp from "./components/layouts/SignUp.js";
import VerifyAccount from "./components/layouts/VerifyAccount.js";
import ForgotPassword from "./components/layouts/ForgotPassword.js";
import ResetPassword from "./components/layouts/ResetPassword.js";
import Chart from "./components/layouts/Chart.js"
import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import {
    Route,
    Switch,
    Redirect,
    BrowserRouter as Router
} from "react-router-dom";
import './custom.scss';

// State Stuff
import { Provider } from 'react-redux';
import store from './store';


class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Fragment>
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/sign-up' component={SignUp} />
                        <Route exact path='/verify-account' component={VerifyAccount} />
                        <Route exact path='/forgot-password' component={ForgotPassword} />
                        <Route exact path='/reset-password' component={ResetPassword} />
                        <Route exact path='/chart' component={Chart} />
                    </Switch>
                </Fragment>
            </Router>

        );
    }
}

export default App;