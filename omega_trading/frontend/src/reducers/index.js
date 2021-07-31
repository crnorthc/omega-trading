import { combineReducers } from 'redux'
import auth from './auth'
import securities from './securities'
import user from './user.js'
import game from './game'
import portfolio from './portfolio'

export default combineReducers({
    auth,
    securities,
    user,
    game,
    portfolio
})