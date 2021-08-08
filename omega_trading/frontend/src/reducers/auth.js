import {
    CREATING_USER,
    USER_CREATED,
    EMAIL_VERIFIED,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOGGING_IN,
    EMAIL_SENT,
    RESET_SUCCESS,
    CHECK_SUCCESS,
    ACTION_FAILED,
    VERIFY_EMAIL,
    VERIFYING_EMAIL,
    USER_LOADED
} from '../actions/types'

const initialState = {
    emailSent: false,
    emailVerified: false,
    error: false,
    error_message: null,
    logged_in: false,
    codeChecked: false,
    passwordReset: false,
    logging_in: false,
    creating_user: false,
    verifying_emaill: false
}

export default function (state = initialState, action) {
    switch (action.type) {
    case CREATING_USER: 
        return {
            ...state,
            creating_user: true,
            error: false
        }
    case VERIFY_EMAIL:
        return {
            ...state,
            emailSent: action.payload
        }
    case VERIFYING_EMAIL:
        return {
            ...state,
            verifying_email: true
        }
    case USER_CREATED:
        return {
            ...state,
            creating_user: false,
            emailSent: true
        }
    case ACTION_FAILED:
        return {
            ...state,
            error: true,
            creating_user: false,
            error_message: action.payload
        }
    case EMAIL_VERIFIED:
        return {
            ...state,
            emailVerified: true,
            emailSent: false,
            verifying_email: false
        }
    case LOGGING_IN:
        return {
            ...state,
            logging_in: true,
        }
    case USER_LOADED:
        return {
            ...state,
            logged_in: true
        }
    case LOGIN_SUCCESS:
        return {
            ...state,
            logged_in: true,
            logging_in: false
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
        return state
    }
}