import { combineReducers } from "redux";
import auth from "./auth";
import securities from './securities';
import user from './user.js'

export default combineReducers({
    auth,
    securities,
    user
});