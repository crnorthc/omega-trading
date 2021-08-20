import { combineReducers } from 'redux'
import auth from './auth'
import securities from './securities'
import user from './user.js'
import game from './game'
import player from './player'

export default combineReducers({
    auth,
    securities,
    user,
    game,
    player
})