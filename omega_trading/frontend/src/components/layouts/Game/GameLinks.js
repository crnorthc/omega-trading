import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CurrentGames from './CurrentGames'
import Game from './Game'
import NewGame from './NewGame'
import SearchGame from './SearchGame'
import ShortGame from './ShortGame'
import LongGame from './LongGame'
import Tournament from './Tournament'
import GameMode from './GameMode'
import GameLength from './GameLength'

function GameLinks() {
    return (
        <Switch>                    
            <Route exact path='/games' component={Game} />    
            <Route exact path='/games/search' component={SearchGame} />
            <Route exact path='/games/current' component={CurrentGames} />
            <Route exact path='/games/new' component={NewGame} />
            <Route exact path='/games/create' component={GameMode} />
            <Route exact path='/games/create/length' component={GameLength} /> 
            <Route exact path='/games/create/short' component={ShortGame} />
            <Route exact path='/games/create/long' component={LongGame} />   
            <Route exact path='/games/create/tournament' component={Tournament} />     
        </Switch>
    )
}
//<Route exact path='/rules' component={NewRules} />

export default GameLinks