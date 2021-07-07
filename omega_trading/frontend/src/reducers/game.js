import {
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    NO_GAME
} from "../actions/types";


const initialState = {
    creating_game: false,
    game_created: false,
    game_loading: false,
    game_loaded: false,
    no_game: false,
    game: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATING_GAME:
            return {
                ...state,
                creating_game: true
            }
        case GAME_CREATED:
            return {
                ...state,
                creating_game: false,
                game_created: true,
                no_game: false,
                game: action.payload
            }
        case GAME_LOADING:
            return {
                ...state,
                game_loading: true
            }
        case GAME_LOADED:
            return {
                ...state,
                game_loading: false,
                game_loaded: true,
                game: action.payload
            }
        case GAME_JOINED:
            return {
                ...state,
                game_loading: false,
                game_loaded: true,
                game: action.payload.game
            }
        case NO_GAME:
            return {
                ...state,
                game_loading: false,
                no_game: true,
                game_loaded: true
            }
        default:
            return state;
    }
}