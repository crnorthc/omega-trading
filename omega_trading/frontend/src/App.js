import Login from './components/layouts/Auth/Login.js'
import SignUp from './components/layouts/Auth/SignUp.js'
import VerifyAccount from './components/layouts/Auth/VerifyAccount.js'
import ForgotPassword from './components/layouts/Auth/ForgotPassword.js'
import ResetPassword from './components/layouts/Auth/ResetPassword.js'
import Symbol from './components/layouts/Securities/Symbol.js'
import MyNavbar from './components/layouts/MyNavbar.js'
import AccountLinks from './components/layouts/Account/AccountLinks'
import NewHome from './components/layouts/NewHome.js'
import Auth from './components/layouts/Auth/Auth'
import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'



import './variables.scss'
import GameLinks from './components/layouts/Game/GameLinks.js'

function App() {
    return (
        <Router>
            <MyNavbar />
            <Auth>
                <Switch>                    
                    <Route exact path='/chart' component={Symbol} />
                    <Route exact path='/reset-password' component={ResetPassword} />
                    <Route path='/account' component={AccountLinks} />
                    <Route path='/games' component={GameLinks} />                
                </Switch>
            </Auth>
            <Switch>
                <Route exact path='/' component={NewHome} />
                <Route exact path='/forgot-password' component={ForgotPassword} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/sign-up' component={SignUp} />
                <Route exact path='/verify-account' component={VerifyAccount} />
            </Switch>
        </Router>
    )
}
//<Route exact path='/rules' component={NewRules} />

export default App
