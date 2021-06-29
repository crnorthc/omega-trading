import {
    USER_CREATED,
    USER_CREATED_FAILED,
    EMAIL_VERIFIED,
    EMAIL_VERIFY_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    EMAIL_FAILED,
    EMAIL_SENT,
    RESET_FAILED,
    RESET_SUCCESS,
    CHECK_SUCCESS,
    CHECK_FAILED
} from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    emailSent: false,
    emailVerified: false,
    error: false,
    error_message: null,
    isAuthenticated: false,
    codeChecked: false,
    passwordReset: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_CREATED:
            return {
                ...state,
                emailSent: true
            }
        case USER_CREATED_FAILED,
            EMAIL_VERIFY_FAILED,
            LOGIN_FAILED,
            EMAIL_FAILED,
            RESET_FAILED,
            CHECK_FAILED:
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
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
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