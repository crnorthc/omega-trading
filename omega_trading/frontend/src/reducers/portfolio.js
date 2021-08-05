import {
    PORTFOLIO_LOADING,
    DAY_LOADED,
    WEEK_LOADED,
    MONTH_LOADED,
    THREE_MONTH_LOADED,
    YEAR_LOADED,
    FIVE_YEAR_LOADED,
    FRIENDS_LOADING,
    FRIENDS_LOADED,
    CLEAR
} from '../actions/types'

const initialState = {
    day: null,
    week: null,
    month: null,
    threeMonth: null,
    year: null, 
    fiveYear: null,
    charts: null,
    portfolio_loading: false,
    friends_loading: false,
    friends: null,
    cleared: false
}

export default function (state = initialState, action) {
    switch (action.type) {
    case PORTFOLIO_LOADING:
        return {
            ...state,
            loading: true
        }
    case FRIENDS_LOADING:
        return {
            ...state,
            friends_loading: true
        }
    case FRIENDS_LOADED:
        var friends = null
        if (Object.keys(action.payload).length != 0) {
            friends = action.payload
        }
        return {
            ...state,
            friends: friends,
            friends_loading: false
        }
    case CLEAR:
        return {
            ...state,
            day: null,
            week: null,
            month: null,
            threeMonth: null,
            year: null, 
            fiveYear: null,
            charts: null,
            cleared: true
        }
    case DAY_LOADED:
        return {
            ...state,
            day: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }         
    case WEEK_LOADED:        
        return {
            ...state,
            week: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }                    
    case MONTH_LOADED:        
        return {
            ...state,
            month: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }                    
    case THREE_MONTH_LOADED:        
        return {
            ...state,
            threeMonth: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }                    
    case YEAR_LOADED:        
        return {
            ...state,
            year: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }                    
    case FIVE_YEAR_LOADED:        
        return {
            ...state,
            fiveYear: {
                path: action.payload.path,
                periods: action.payload.periods
            },
            charts: action.payload.charts,
            loading: false
        }                    
    default:
        return state
    }
}
    
