import axios from 'axios';
import {
    USER_CREATED,
    EMAIL_VERIFIED,
    LOGIN_SUCCESS,
    LOGGING_IN,
    LOGOUT_SUCCESS,
    EMAIL_SENT,
    RESET_SUCCESS,
    CHECK_SUCCESS,
    ACTION_FAILED
} from './types';


function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${'OmegaToken'}=`);
    var cookie = '';
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    };
    return cookie
}

function deleteCookie() {
    document.cookie = "OmegaToken=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

export const createUser = (first_name, last_name, email, password, username) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ first_name, last_name, email, password, username });

    axios.post('/users/create', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: USER_CREATED,
                    payload: res.data
                })
            };
        })
}

export const verifyEmail = (verification_code) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ verification_code });

    axios.post('/users/verify-email', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: EMAIL_VERIFIED,
                    payload: res.data
                })
            };
        })
}

export const autoLogin = (cookie) => dispatch => {
    dispatch({
        type: LOGGING_IN
    })
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + cookie
        }
    };

    const body = JSON.stringify({});

    axios.post('/users/autoLogin', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data.Success
                })
            };
        })
}

export const login = (username, password) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ username, password });

    axios.post('/users/login', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: "success"
                })
            };
        })
}

export const logout = () => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    const body = JSON.stringify({});

    axios.post('/users/logout', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                deleteCookie()
                dispatch({
                    type: LOGOUT_SUCCESS
                })
            };
        })
}

export const sendReset = (email) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ email });

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
            };
        })
}

export const checkReset = (verification_code) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ verification_code });

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
            };
        })
}

export const resetForgot = (username, password) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({ username, password });

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
            };
        })
}


