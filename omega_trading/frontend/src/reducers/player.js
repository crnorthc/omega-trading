import {
    CREATING_GAME,
} from '../actions/types'

const initialState = {
    game: null,
    portfolio: null,
    small_charts: null,
    holdings: null
}

export default function (state = initialState, action) {
    switch (action.type) {
    case CREATING_GAME:
        return {
            ...state,
            creating_game: true,
        }
    default:
        return state
    }
}
