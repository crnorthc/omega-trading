import {
    SEARCH_MADE,
    LIST_LOADING,
    NO_SEARCH,
    SECURITY_LOADED,
    SECURITY_UPDATED
} from '../actions/types'

const initialState = {
    noSearch: true,
    results: {
        count: null,
        result: null
    },
    security: null,
    securityLoaded: false,
    listLoading: false,
    symbol: null,
    current_value: null
}


export default function (state = initialState, action) {
    switch (action.type) {
        case SEARCH_MADE:
            return {
                ...state,
                results: action.payload,
                listLoading: false
            }
        case LIST_LOADING:
            return {
                ...state,
                noSearch: false,
                listLoading: true
            }
        case NO_SEARCH:
            return {
                ...state,
                noSearch: true
            }
        case SECURITY_LOADED:
            return {
                ...state,
                security: action.payload.data,
                securityLoaded: true,
                symbol: action.payload.symbol,
                current_value: action.payload.data[action.payload.data.length - 1].price
            }
        case SECURITY_UPDATED:
            return {
                ...state,
                current_value: action.payload
            }
        default:
            return state;
    }
}