import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CreateGame from './CreateGame'
import CurrentGames from './CurrentGames'
import Game from './Game'
import JoinGame from './JoinGame'
import NewGame from './NewGame'
import SearchGame from './SearchGame'
import Short from './Short'
import Long from './Long'
import Tournament from './Tournament'
import NewComp from './NewComp'

function GameLinks() {
    return (
        <Switch>                    
            <Route exact path='/games' component={Game} />    
            <Route exact path='/games/search' component={SearchGame} />
            <Route exact path='/games/current' component={CurrentGames} />
            <Route exact path='/games/new' component={NewGame} />
            <Route exact path='/games/new/short' component={Short} />
            <Route exact path='/games/new/competition' component={NewComp} />
            <Route exact path='/games/new/tournament' component={Tournament} />
            <Route exact path='/games/new/long' component={Long} />
            <Route exact path='/games/new/search' component={JoinGame} />      
            <Route exact path='/games/new/create' component={CreateGame} />    
        </Switch>
    )
}
//<Route exact path='/rules' component={NewRules} />

export default GameLinks