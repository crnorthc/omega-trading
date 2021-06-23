import {
    SEARCH_MADE
} from '../actions/types'

const initialState = {
    results: null
}


export default function (state = initialState, action) {
    switch (action.type) {
        case SEARCH_MADE:
            return {
                ...state,
                results: action.payload
            }
        default:
            return state;
    }
}