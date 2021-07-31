import {
    USER_LOADED,
    USERS_LOADED,
    LOGOUT_SUCCESS,
    HIDE_RESULTS,
    UPDATE_USER,
    HISTORY_SAVED,
    GAME_JOINED,
    LOADING,
    LEADERBOARD_LOADED
} from '../actions/types'


const initialState = {
    user: null,
    userLoaded: false,
    users: null,
    users_loaded: false,
    invites_sent: null,
    loading: false,
    leaderboard: null
}

export default function (state = initialState, action) {
    switch (action.type) {
    case LOGOUT_SUCCESS:
        return initialState
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
    case HISTORY_SAVED:
        return {
            ...state
        }
    case USERS_LOADED:
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