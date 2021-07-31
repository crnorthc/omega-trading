import axios from 'axios'
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
} from './types'

function getCookie() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${'OmegaToken'}=`)
    var cookie = ''
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + cookie,
        },
    }

    var path = window.location.pathname + window.location.search

    const body = JSON.stringify({ path })

    axios.post('/users/history', body, config)

    return cookie
}

export const loadPortfolio = (period) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }
    
    dispatch({
        type: PORTFOLIO_LOADING,
    })

    const body = JSON.stringify({period})

    axios.post('/users/portfolio', body, config).then((res) => {
        if (res.data.Error) {
            console.log('ooops')
        } else {            
            switch(period) {
            case 'day':
                dispatch({
                    type: DAY_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'week':
                dispatch({
                    type: WEEK_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'month':
                dispatch({
                    type: MONTH_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case '3m':
                dispatch({
                    type: THREE_MONTH_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'y':
                dispatch({
                    type: YEAR_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case '5y':
                dispatch({
                    type: FIVE_YEAR_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            }        
        }
    })
}

export const friendsPortfolios = () => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }
    
    dispatch({
        type: FRIENDS_LOADING,
    })

    const body = JSON.stringify()

    axios.post('/users/friends-portfolio', body, config).then((res) => {
        if (res.data.Error) {
            console.log('ooops')
        } else {               
            dispatch({
                type: FRIENDS_LOADED,
                payload: res.data.Success,
            })        
        }
    })
}


export const friendPortfolio = (period, username) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({period, username})

    axios.post('/users/friend-portfolio', body, config).then((res) => {          
        if (res.data.Error) {
            console.log('ooops')
        } else {     
            switch(period) {
            case 'day':
                dispatch({
                    type: DAY_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'week':
                dispatch({
                    type: WEEK_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'month':
                dispatch({
                    type: MONTH_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case '3m':
                dispatch({
                    type: THREE_MONTH_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case 'y':
                dispatch({
                    type: YEAR_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            case '5y':
                dispatch({
                    type: FIVE_YEAR_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, charts: res.data.Success.charts },
                })
                break
            }
        }      
    })
}

export const clearPortfolio = () => (dispatch) => {
    dispatch({
        type: CLEAR
    })
}