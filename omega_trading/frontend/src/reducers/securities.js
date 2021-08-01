import {
    SEARCH_MADE,
    LIST_LOADING,
    NO_SEARCH,
    SECURITY_LOADED,
    LOGOUT_SUCCESS,
    SECURITY_UPDATED,
    SECURITY_LOADING,
    NEW_SECURITY
} from '../actions/types'

const initialState = {
    noSearch: true,
    results: {
        count: null,
        result: null
    },
    securities: {},
    securityLoaded: false,
    listLoading: false,
    symbol: null,
    securityLoading: true,
    portfolio: null,
    small_charts: null,
    holdings: null,
    data: null
}


export default function (state = initialState, action) {
    switch (action.type) {
    case LOGOUT_SUCCESS:
        return initialState
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
    case NEW_SECURITY:
        return {
            ...state,
            data: null
        }
    case SECURITY_LOADED:
        return {
            ...state,
            data: {
                periods: action.payload.periods,
                path: action.payload.path,
            },
            symbol: action.payload.symbol,
            securityLoaded: true,
            securityLoading: false,
        }
    case SECURITY_LOADING:
        return {
            ...state,
            securityLoaded: false,
            securityLoading: true
        }
    case SECURITY_UPDATED:
        return {
            ...state,
            current_value: action.payload
        }
    default:
        return state
    }
}