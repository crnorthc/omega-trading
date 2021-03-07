import { USER_CREATED, USER_CREATED_FAILED } from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    user: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                user: action.payload
            }
        case USER_CREATED_FAILED:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}