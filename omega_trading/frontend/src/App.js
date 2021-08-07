import Login from './components/layouts/Login.js';
import SignUp from './components/layouts/SignUp.js';
import VerifyAccount from './components/layouts/VerifyAccount.js';
import ForgotPassword from './components/layouts/ForgotPassword.js';
import ResetPassword from './components/layouts/ResetPassword.js';
import Symbol from './components/layouts/Symbol.js';
import MyNavbar from './components/layouts/MyNavbar.js';
import Home from './components/layouts/Home.js';
import Account from './components/layouts/Account.js';
import Portfolio from './components/layouts/Portfolio.js';
import Lobby from './components/layouts/Lobby.js';
import Leaderboard from './components/layouts/Leaderboard.js';
import React, { Fragment } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import './custom.scss';
import './variables.scss';

function App() {
  return (
    <Router>
      <MyNavbar />
      <Fragment>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/sign-up' component={SignUp} />
          <Route exact path='/verify-account' component={VerifyAccount} />
          <Route exact path='/forgot-password' component={ForgotPassword} />
          <Route exact path='/reset-password' component={ResetPassword} />
          <Route exact path='/chart' component={Symbol} />
          <Route exact path='/account' component={Account} />
          <Route exact path='/portfolio' component={Portfolio} />
          <Route exact path='/lobby' component={Lobby} />
          <Route exaxt path='/leaderboard' component={Leaderboard} />
        </Switch>
      </Fragment>
    </Router>
  );
}

export default App;
