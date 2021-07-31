import axios from 'axios'
import { USER_LOADED, 
    USERS_LOADED, 
    HIDE_RESULTS, 
    UPDATE_USER, 
    HISTORY_SAVED, 
    LOADING, 
    LEADERBOARD_LOADED } from './types'

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

export const hideResults = () => (dispatch) => {
    dispatch({
        type: HIDE_RESULTS,
    })
}

export const loadUser = () => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({})

    axios.post('/users/load', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        }
    })
}

export const acceptInvite = (username, accepted, unadd) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, accepted, unadd })

    axios.post('/users/accept', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            })
        }
    })
}

export const sendInvite = (username, unsend) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, unsend })

    axios.post('/users/invite', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            })
        }
    })
}

export const loadUsers = (username, friends) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, friends })

    axios.post('/users/search-user', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: USERS_LOADED,
                payload: res.data,
            })
        }
    })
}

export const buy = (symbol, quantity, dollars) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ symbol })

    axios.post('/securities/update', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            var quote = res.data
            var body = JSON.stringify({ symbol, quantity, quote, dollars })
            axios.post('/users/buy', body, config).then((res) => {
                if (res.data.Error) {
                    console.log('oops')
                } else {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data,
                    })
                }
            })
        }
    })
}

export const sell = (symbol, quantity, dollars) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ symbol })

    axios.post('/securities/update', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            var quote = res.data
            var body = JSON.stringify({ symbol, quantity, quote, dollars })
            axios.post('/users/sell', body, config).then((res) => {
                if (res.data.Error) {
                    console.log('oops')
                } else {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data,
                    })
                }
            })
        }
    })
}

export const saveHistory = () => (dispatch) => {
    getCookie()
    dispatch({
        type: HISTORY_SAVED,
    })
}

export const loadLeaderboard = () => (dispatch) => {
    dispatch({
        type: LOADING,
    })

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({})

    axios.post('/users/leaderboard', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: LEADERBOARD_LOADED,
                payload: res.data,
            })
        }
    })
}
