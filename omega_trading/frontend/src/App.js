import Login from "./components/layouts/Login.js";
import SignUp from "./components/layouts/SignUp.js";
import VerifyAccount from "./components/layouts/VerifyAccount.js";
import ForgotPassword from "./components/layouts/ForgotPassword.js";
import ResetPassword from "./components/layouts/ResetPassword.js";
import ChartDisplay from "./components/layouts/ChartDisplay.js";
import MyNavbar from "./components/layouts/MyNavbar.js";
import Home from "./components/layouts/Home.js";
import Account from "./components/layouts/Account.js";
import Portfolio from "./components/layouts/Portfolio.js";
import Lobby from "./components/layouts/Lobby.js";
import Leaderboard from "./components/layouts/Leaderboard.js";
import React, { Fragment, useEffect, useState } from "react";
import { render } from "react-dom";
import { Route, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";
import "./custom.scss";
import "./variables.scss";

function App(props) {
    return (
        <Router>
            <MyNavbar />
            <Fragment>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/sign-up" component={SignUp} />
                    <Route exact path="/verify-account" component={VerifyAccount} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route exact path="/reset-password" component={ResetPassword} />
                    <Route exact path="/chart" component={ChartDisplay} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/portfolio" component={Portfolio} />
                    <Route exact path="/lobby" component={Lobby} />
                    <Route exaxt path="/leaderboard" component={Leaderboard} />
                </Switch>
            </Fragment>
        </Router>
    );
}

export default App;
