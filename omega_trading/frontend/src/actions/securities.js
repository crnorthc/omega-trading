import {
    SEARCH_MADE,
    LIST_LOADING,
    NO_SEARCH,
    SECURITY_LOADED,
    SECURITY_UPDATED
} from './types'

import axios from 'axios';

export const searchSymbols = (search) => dispatch => {
    dispatch({ type: LIST_LOADING })
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    var returnData
    const body = JSON.stringify({ search });
    if (search !== "") {
        axios.post('/securities/search', body, config)
            .then(res => {
                if (res.data.Error) {
                    console.log("ooops")
                }
                else {
                    if (res.data.result.length > 9) {
                        returnData = res.data.result.slice(0, 6)
                    }
                    else {
                        returnData = res.data.result
                    }
                    dispatch({
                        type: SEARCH_MADE,
                        payload: returnData
                    })
                };
            })
    }
    else {
        dispatch({ type: NO_SEARCH })
    }
}


export const loadSecurity = (symbol, period) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ symbol, period });
    axios.post('/securities/load', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("ooops")
            }
            else {
                var returnData = []
                for (let i = 0; i < res.data.t.length; i++) {
                    var time = res.data.t[i]
                    var date = new Date(time * 1000)
                    var year = date.getFullYear()
                    var month = date.getMonth()
                    var day = date.getDate()
                    var hours = date.getHours()
                    var mins = date.getMinutes()
                    returnData.push({ time: { year: year, month: month, day: day, hours: hours, minutes: mins }, price: res.data.c[i] })
                }
                dispatch({
                    type: SECURITY_LOADED,
                    payload: { data: returnData, symbol: symbol }
                })
            };
        })
}

export const updateSymbol = (symbol) => dispatch => {

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ symbol });
    axios.post('/securities/update', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("ooops")
            }
            else {
                var time = res.data.t
                var date = new Date(time * 1000)
                var year = date.getFullYear()
                var month = date.getMonth()
                var day = date.getDate()
                var hours = date.getHours()
                var mins = date.getMinutes()
                var returnData = res.data.c
                dispatch({
                    type: SECURITY_UPDATED,
                    payload: returnData
                })
            };
        })
}
