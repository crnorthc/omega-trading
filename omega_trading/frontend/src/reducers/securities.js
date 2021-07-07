import {
    SEARCH_MADE,
    LIST_LOADING,
    NO_SEARCH,
    SECURITY_LOADED,
    LOGOUT_SUCCESS,
    SECURITY_UPDATED,
    SECURITY_LOADING,
    PORTFOLIO_LOADED,
    FRIENDS_LOADED,
    FRIEND_LOADED
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
    current_value: null,
    securityLoading: true,
    portfolio: null,
    small_charts: null,
    holdings: null
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
        case SECURITY_LOADED:
            var temp_securities = initialState.securities
            temp_securities[action.payload.symbol] = action.payload.data
            return {
                ...state,
                securities: temp_securities,
                symbol: action.payload.symbol,
                securityLoaded: true,
                securityLoading: false,
                current_value: action.payload.data[action.payload.data.length - 1].price
            }
        case SECURITY_LOADING:
            return {
                ...state,
                securityLoaded: false,
                securityLoading: true
            }
        case FRIENDS_LOADED:
            return {
                ...state,
                securityLoading: false
            }
        case FRIEND_LOADED:
            return {
                ...state,
                securityLoading: false,
                portfolio: action.payload.data,
                small_charts: action.payload.small_charts,
                holdings: action.payload.holdings

            }
        case PORTFOLIO_LOADED:
            return {
                ...state,
                securityLoading: false
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