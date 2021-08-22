import {
    LOGOUT_SUCCESS,
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    HISTORY_LOADED,
    GAME_INFO_LOADED,
    HISTORY_LOADING,
    NO_HISTORY,
    NO_GAME,
    GAMES_LOADED,
    SEARCH_LOADED,
    MAKING_SEARCH,
    TYPE_CHANGING,
    GAME_ERROR,
    MAKING_EDIT
} from '../actions/types'

const initialState = {
    creating_game: false,
    game_loading: false,
    game_loaded: false,
    game_created: false,
    no_game: false,
    no_history: false,
    history: null,
    history_loading: false,
    game: null,
    games: null,
    preview: null,
    search: null,
    search_made: false,
    making_edit: false,
    error: null
}

export default function (state = initialState, action) {
    switch (action.type) {
    case LOGOUT_SUCCESS:
        return initialState
    case GAME_ERROR:
        return {
            ...state,
            creating_game: false,
            error: action.payload
        }
    case CREATING_GAME:
        return {
            ...state,
            creating_game: true,
        }
    case TYPE_CHANGING:
        return {
            ...state,
            game: action.payload,
            type_changing: true
        }
    case MAKING_EDIT:
        return {
            ...state,
            making_edit: true
        }
    case GAME_CREATED:
        return {
            ...state,
            creating_game: false,
            game_created: true,
            no_game: false,
            game: action.payload,
        }
    case GAME_LOADING:
        return {
            ...state,
            game_loading: true,
        }
    case GAME_LOADED:
        return {
            ...state,
            game_loading: false,
            game_loaded: true,
            making_edit: false,
            game: action.payload,
        }
    case GAME_INFO_LOADED: 
        return {
            ...state,
            preview: action.payload
        }
    case MAKING_SEARCH: 
        return {
            ...state,
            search_made: false,
            making_search: true
        }
    case SEARCH_LOADED:
        var searched_games = action.payload
        if (searched_games.length == 0) {
            searched_games = 'empty'
        }
        return {
            ...state,
            search: searched_games,
            search_made: true,
            making_search: false
        }
    case GAMES_LOADED:
        var game_list = action.payload
        if (game_list.length == 0) {
            game_list = false
        }
        return {
            ...state,
            games: game_list
        }
    case GAME_JOINED:
        if (action.payload.unadd) {
            return {
                ...state,
                game_loading: false,
                game_loaded: false,
                game: null,
                no_game: true,
            }
        } else {
            return {
                ...state,
                game_loading: false,
                game_loaded: true,
                game: action.payload.game,
                no_game: false,
            }
        }
    case NO_GAME:
        return {
            ...state,
            game_loading: false,
            no_game: true,
            game_loaded: true,
            game: null
        }
    case HISTORY_LOADING:
        return {
            ...state,
            history_loading: true,
        }
    case HISTORY_LOADED:
        return {
            ...state,
            history_loading: false,
            history: action.payload,
        }
    case NO_HISTORY:
        return {
            ...state,
            history_loading: false,
            no_history: true,
            history_loaded: true,
        }
    default:
        return state
    }
}
