import {
    USER_CREATED,
    EMAIL_VERIFIED,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOGGING_IN,
    EMAIL_SENT,
    RESET_SUCCESS,
    CHECK_SUCCESS,
    ACTION_FAILED
} from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    emailSent: false,
    emailVerified: false,
    error: false,
    error_message: null,
    isAuthenticated: false,
    codeChecked: false,
    passwordReset: false,
    logging_in: false,
    last_path: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_CREATED:
            return {
                ...state,
                emailSent: true
            }
        case ACTION_FAILED:
            return {
                ...state,
                error: true,
                error_message: action.payload.Error
            }
        case EMAIL_VERIFIED:
            return {
                ...state,
                emailVerified: true,
                emailSent: false
            }
        case LOGGING_IN:
            return {
                ...state,
                logging_in: true,
            }
        case LOGIN_SUCCESS:
            var path = null
            if (action.payload.includes('/')) {
                path = action.payload
            }
            return {
                ...state,
                isAuthenticated: true,
                logging_in: false,
                last_path: path
            }
        case LOGOUT_SUCCESS:
            return initialState
        case EMAIL_SENT:
            return {
                ...state,
                emailSent: true
            }
        case RESET_SUCCESS:
            return {
                ...state,
                passwordReset: true
            }
        case CHECK_SUCCESS:
            return {
                ...state,
                codeChecked: true
            }
        default:
            return state;
    }
}