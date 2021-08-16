import axios from 'axios'
import {
    CREATING_USER,
    USER_CREATED,
    EMAIL_VERIFIED,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    EMAIL_SENT,
    RESET_SUCCESS,
    CHECK_SUCCESS,
    ACTION_FAILED,
    VERIFY_EMAIL,
    VERIFYING_EMAIL,
    LOGGING_OUT
} from './types'


function getCookie() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${'loggedIn'}=`)
    var cookie = ''
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    }
    return cookie
}

export const createUser = (first_name, last_name, email, password, username) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    dispatch({
        type: CREATING_USER
    })

    const body = JSON.stringify({ first_name, last_name, email, password, username })

    axios.post('/users/create', body, config)
        .then(res => {
            dispatch({
                type: USER_CREATED,
                payload: res.data
            })
        })
        .catch(error => {
            if (error.response.status == 401) {
                dispatch({
                    type: VERIFY_EMAIL,
                    payload: true
                })
            }
            else {
                dispatch({
                    type: ACTION_FAILED,
                    payload: error.response.data.Error
                })
            }            
        })
}

export const closeVerified = () => dispatch => {
    dispatch({
        type: VERIFY_EMAIL,
        payload: false
    })
}

export const verifyEmail = (key) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    dispatch({
        type: VERIFYING_EMAIL
    })

    const body = JSON.stringify({ key })

    axios.post('/users/verify-email', body, config)
        .then(res => {
            dispatch({
                type: EMAIL_VERIFIED,
                payload: res.data
            })
        })
        .catch(error => {
            dispatch({
                type: ACTION_FAILED,
                payload: error.response.data.Error
            })
        })
}

export const login = (username, password) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ username, password })

    axios.post('/users/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data.Success
            })
        })
        .catch(error => {
            if (error.response.status == 401) {
                dispatch({
                    type: VERIFY_EMAIL,
                    payload: true
                })
            }
            else {
                dispatch({
                    type: ACTION_FAILED,
                    payload: error.response.data.Error
                })
            }            
        })
}

export const logout = () => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + getCookie()
        }
    }

    dispatch({
        type: LOGGING_OUT
    })

    const body = JSON.stringify({})

    axios.post('/users/logout', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: LOGOUT_SUCCESS
                })
            }
        })
}

export const sendReset = (email) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email })

    axios.post('/users/forgot-password', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: EMAIL_SENT,
                    payload: res.data
                })
            }
        })
}

// DOES NOT EXISTS
export const checkReset = (verification_code) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ verification_code })

    axios.post('/users/check-reset-code', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: CHECK_SUCCESS,
                    payload: res.data
                })
            }
        })
}

export const resetForgot = (username, password) => dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ username, password })

    axios.post('/users/reset-forgot-password', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: RESET_SUCCESS,
                    payload: res.data
                })
            }
        })
}
