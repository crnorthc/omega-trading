import {
    LOGOUT_SUCCESS,
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    HISTORY_LOADED,
    HISTORY_LOADING,
    QUOTE_LOADED,
    NO_HISTORY,
    NO_GAME,
} from "../actions/types";

const initialState = {
    creating_game: false,
    game_created: false,
    game_loading: false,
    game_loaded: false,
    no_game: false,
    no_history: false,
    history: null,
    history_loading: false,
    history_loaded: false,
    game: null,
    etherQuote: null,
    gasQuote: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            return initialState;
        case CREATING_GAME:
            return {
                ...state,
                creating_game: true,
            };
        case GAME_CREATED:
            return {
                ...state,
                creating_game: false,
                game_created: true,
                no_game: false,
                game: action.payload,
            };
        case GAME_LOADING:
            return {
                ...state,
                game_loading: true,
            };
        case GAME_LOADED:
            return {
                ...state,
                game_loading: false,
                game_loaded: true,
                game: action.payload,
            };
        case GAME_JOINED:
            if (action.payload.unadd) {
                return {
                    ...state,
                    game_loading: false,
                    game_loaded: false,
                    game: null,
                    no_game: true,
                };
            } else {
                return {
                    ...state,
                    game_loading: false,
                    game_loaded: true,
                    game: action.payload.game,
                    no_game: false,
                };
            }
        case NO_GAME:
            return {
                ...state,
                game_loading: false,
                no_game: true,
                game_loaded: true,
            };
        case HISTORY_LOADING:
            return {
                ...state,
                history_loading: true,
            };
        case HISTORY_LOADED:
            return {
                ...state,
                history_loaded: true,
                history_loading: false,
                history: action.payload,
            };
        case NO_HISTORY:
            return {
                ...state,
                history_loading: false,
                no_history: true,
                history_loaded: true,
            };
        case QUOTE_LOADED:
            if ("gasQuote" in action.payload) {
                return {
                    ...state,
                    gasQuote: action.payload["gasQuote"],
                };
            } else {
                return {
                    ...state,
                    etherQuote: action.payload["etherQuote"],
                };
            }
        default:
            return state;
    }
}
