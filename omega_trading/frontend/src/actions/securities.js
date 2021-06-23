import {
    SEARCH_MADE
} from './types'

import axios from 'axios';

export const searchSymbols = (search) => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ search });

    axios.post('/securities/search', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("ooops")
            }
            else {
                dispatch({
                    type: SEARCH_MADE,
                    payload: res.data
                })
            };
        })
}