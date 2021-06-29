import axios from 'axios';
import {
    BOUGHT,
    USER_LOADED
} from './types';

function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${'OmegaToken'}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const loadUser = () => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    const body = JSON.stringify({});

    axios.post('/users/load', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("oops")
            }
            else {
                dispatch({
                    type: USER_LOADED,
                    payload: res.data
                })
            };
        })
}


export const buy = (symbol, quantity) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body = JSON.stringify({ symbol });

    axios.post('/securities/update', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("oops")
            }
            else {
                var quote = res.data
                var body = JSON.stringify({ symbol, quantity, quote });
                axios.post('/users/buy', body, config)
                    .then(res => {
                        if (res.data.Error) {
                            console.log("oops")
                        }
                        else {
                            dispatch({
                                type: USER_LOADED,
                                payload: res.data
                            })
                        };
                    })
            };
        })
}