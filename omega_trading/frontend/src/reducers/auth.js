import { USER_CREATED, USER_CREATED_FAILED, EMAIL_VERIFIED, EMAIL_VERIFY_FAILED, LOGIN_SUCCESS, LOGIN_FAILED } from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    user: null,
    verificationSent: false,
    emailVerified: false,
    error: false,
    error_message: null,
    isAuthenticated: false,
    cookie: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_CREATED:
            return {
                ...state,
                verificationSent: true
            }
        case USER_CREATED_FAILED,
            EMAIL_VERIFY_FAILED,
            LOGIN_FAILED:
            return {
                ...state,
                error: true,
                error_message: action.payload.Error
            }
        case EMAIL_VERIFIED:
            return {
                ...state,
                emailVerified: true
            }
        case LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
                cookie: action.payload.Success
            }
        default:
            return state;
    }
}