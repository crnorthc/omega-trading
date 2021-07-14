import {
    BOUGHT,
    USER_LOADED,
    USERS_LOADED,
    PORTFOLIO_LOADED,
    LOGOUT_SUCCESS,
    HIDE_RESULTS,
    UPDATE_USER,
    FRIENDS_LOADED,
    HISTORY_SAVED,
    GAME_JOINED,
    LOADING,
    LEADERBOARD_LOADED
} from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    user: null,
    userLoaded: false,
    portfolio: null,
    small_charts: null,
    users: null,
    users_loaded: false,
    invites_sent: null,
    friends_charts: null,
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
        case FRIENDS_LOADED:
            return {
                ...state,
                friends_charts: action.payload
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
        case PORTFOLIO_LOADED:
            var charts = action.payload.small_charts
            if (Object.keys(charts).length == 0) {
                charts = null
            }
            return {
                ...state,
                portfolio: action.payload.data,
                small_charts: charts
            }
        case LEADERBOARD_LOADED:
            return {
                ...state,
                loading: false,
                leaderboard: action.payload
            }
        default:
            return state;
    }
}