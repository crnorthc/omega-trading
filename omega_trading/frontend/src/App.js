import Login from './components/layouts/Auth/Login.js'
import SignUp from './components/layouts/Auth/SignUp.js'
import VerifyAccount from './components/layouts/Auth/VerifyAccount.js'
import ForgotPassword from './components/layouts/Auth/ForgotPassword.js'
import ResetPassword from './components/layouts/Auth/ResetPassword.js'
import CurrentGames from './components/layouts/Game/CurrentGames.js'
import Symbol from './components/layouts/Securities/Symbol.js'
import MyNavbar from './components/layouts/Nav/MyNavbar.js'
import Account from './components/layouts/Account.js'
import NewHome from './components/layouts/NewHome.js'
import Auth from './components/layouts/Auth/Auth'
import React  from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import './custom.scss'
import './variables.scss'
import NewGame from './components/layouts/Game/NewGame.js'
import Game from './components/layouts/Game/Game.js'


function App() {
    return (
        <Router>
            <MyNavbar />
            <Auth>
                <Switch>
                    <Route exact path="/" component={NewHome} />
                    <Route exact path="/chart" component={Symbol} />                                                        
                    <Route exact path="/reset-password" component={ResetPassword} />
                    <Route exact path="/account" component={Account} />
                    <Route exact path="/game" component={Game} />
                    <Route exact path="/games" component={CurrentGames} />
                    <Route exact path="/join" component={NewGame} />                    
                </Switch>                                        
            </Auth>           
            <Switch>
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/sign-up" component={SignUp} />
                <Route exact path="/verify-account" component={VerifyAccount} />
            </Switch>   
        </Router>
    )
}
//<Route exact path='/rules' component={NewRules} />

export default App
