import axios from 'axios';
import { USER_CREATED, USER_CREATED_FAILED, EMAIL_VERIFIED, EMAIL_VERIFY_FAILED, LOGIN_FAILED, LOGIN_SUCCESS } from './types';


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
                    type: USER_CREATED_FAILED,
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
                    type: EMAIL_VERIFY_FAILED,
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
                    type: LOGIN_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                })
            };
        })
}