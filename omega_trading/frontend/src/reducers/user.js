import {
    WALLETS_LOADED,
    USER_LOADED,
    USERS_LOADED,
    LOGOUT_SUCCESS,
    LOGIN_SUCCESS,
    HIDE_RESULTS,
    UPDATE_USER,
    GAME_JOINED,
    LOADING,
    NO_USER,
    LEADERBOARD_LOADED
} from '../actions/types'


const initialState = {
    user: null,
    userLoaded: false,
    users: null,
    users_loaded: false,
    invites_sent: null,
    loading: false,
    leaderboard: null,
    wallets: null
}

export default function (state = initialState, action) {
    switch (action.type) {
    case LOGOUT_SUCCESS:
        return initialState
    case LOGIN_SUCCESS:
        return {
            ...state,
            user: action.payload
        }
    case WALLETS_LOADED:
        return {
            ...state,
            wallets: action.payload
        }
    case LOADING:
        return {
            ...state,
            loading: true
        }
    case USER_LOADED:
        return {
            ...state,
            userLoaded: true,
            user: action.payload.Success
        }
    case NO_USER:
        return {
            ...state,
            user_loaded: true,
            user: null
        }
    case USERS_LOADED:
        console.log('here')
        console.log(action.payload.Success)
        return {
            ...state,
            users: action.payload.Success,
            users_loaded: true
        }
    case HIDE_RESULTS:
        return {
            ...state,
            users_loaded: false
        }
    case GAME_JOINED:
        return {
            ...state,
            user: action.payload.user
        }
    case UPDATE_USER:
        return {
            ...state,
            user: action.payload.Success
        }
    case LEADERBOARD_LOADED:
        return {
            ...state,
            loading: false,
            leaderboard: action.payload
        }
    default:
        return state
    }
}