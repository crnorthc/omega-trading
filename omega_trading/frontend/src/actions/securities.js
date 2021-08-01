import {
    SEARCH_MADE,
    LIST_LOADING,
    NO_SEARCH,
    SECURITY_LOADED,
    SECURITY_LOADING,
    NEW_SECURITY
} from './types'

import axios from 'axios'

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

export const searchSymbols = (search) => dispatch => {
    dispatch({ type: LIST_LOADING })
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ search })
    if (search !== '') {
        axios.post('/securities/search', body, config)
            .then(res => {
                if (res.data.Error) {
                    console.log('ooops')
                }
                else {
                    dispatch({
                        type: SEARCH_MADE,
                        payload: res.data
                    })
                }
            })
    }
    else {
        dispatch({ type: NO_SEARCH })
    }
}

export const loadSecurity = (symbol, period) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    dispatch({
        type: SECURITY_LOADING
    })

    dispatch({
        type: NO_SEARCH
    })

    const body = JSON.stringify({ symbol, period })
    axios.post('/securities/load', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log('ooops')
            }
            else {
                dispatch({
                    type: SECURITY_LOADED,
                    payload: { path: res.data.Success.path, periods: res.data.Success.periods, symbol: symbol }
                })
            }
        })
}

export const newSecurity = () => (dispatch) => {
    dispatch({
        type: NEW_SECURITY
    })
}


