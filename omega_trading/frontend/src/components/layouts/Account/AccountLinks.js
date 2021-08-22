import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Account from './Account'
import Wallet from './Wallets'

function GameLinks() {
    return (
        <Switch>                    
            <Route exact path='/account' component={Account} />    
            <Route exact path='/account/wallets' component={Wallet} />
        </Switch>
    )
}
//<Route exact path='/rules' component={NewRules} />

export default GameLinks