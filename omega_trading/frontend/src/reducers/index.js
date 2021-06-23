import { combineReducers } from "redux";
import auth from "./auth";
import securities from './securities';

export default combineReducers({
    auth,
    securities
});