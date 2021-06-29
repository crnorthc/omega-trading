import {
    BOUGHT,
    USER_LOADED
} from "../actions/types";

import { Redirect } from "react-router-dom";

const initialState = {
    user: null,
    userLoaded: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADED:
            return {
                ...state,
                userLoaded: true,
                user: action.payload
            }
        default:
            return state;
    }
}