import axios from 'axios';
import { USER_CREATED } from './types';

// CHECK TOKEN AND LOAD USER 
export const createUser = (firstName, lastName, email, password, username) => (dispatch, getState) => {


    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ firstName, lastName, email, password, username });

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