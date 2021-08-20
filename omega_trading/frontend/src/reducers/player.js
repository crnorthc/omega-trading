import {
    GAME_SELECTED, SELECTING_GAME,
} from '../actions/types'

const initialState = {
    game: null,
    portfolio: null,
    small_charts: null,
    holdings: null,
    selecting_game: false
}

export default function (state = initialState, action) {
    switch (action.type) {
    case SELECTING_GAME:
        return {
            ...state,
            selecting_game: true
        }
    case GAME_SELECTED:
        return {
            ...state,
            game: action.payload.game,
            portfolio: action.payload.portfolio,
            small_charts: action.payload.small_charts,
            selecting_game: false
        }
    default:
        return state
    }
}
