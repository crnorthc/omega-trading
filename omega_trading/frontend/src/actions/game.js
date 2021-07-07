import axios from 'axios';
import {
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    NO_GAME
} from './types';

function getCookie() {

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${'OmegaToken'}=`);
    var cookie = '';
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    };

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + cookie
        }
    };

    var path = window.location.pathname + window.location.search

    const body = JSON.stringify({ path });

    axios.post('/users/history', body, config)

    return cookie

}

export const createGame = (amount, bet, positions, days, hours, mins, code) => dispatch => {

    dispatch({
        type: CREATING_GAME
    })

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body;
    amount = parseInt(amount)
    bet = parseInt(bet)
    days = parseInt(days)
    hours = parseInt(hours)
    mins = parseInt(mins)
    if (positions == '') {
        if (code !== '') {
            body = JSON.stringify({ amount, bet, days, hours, mins, code });
        }
        else {
            body = JSON.stringify({ amount, bet, days, hours, mins });
        }
    }
    else {
        positions = parseInt(positions)
        if (code !== '') {
            body = JSON.stringify({ amount, bet, positions, days, hours, mins, code });
        }
        else {
            body = JSON.stringify({ amount, bet, positions, days, hours, mins });
        }
    }


    axios.post('/game/create', body, config)
        .then(res => {
            if (res.data.Error) {
                dispatch({
                    type: ACTION_FAILED,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: GAME_CREATED,
                    payload: res.data.game
                })
            };
        })
}

export const loadGame = () => dispatch => {

    dispatch({
        type: GAME_LOADING
    })

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body = JSON.stringify({});

    axios.post('/game/load', body, config)
        .then(res => {
            if (res.status == 204) {
                dispatch({
                    type: NO_GAME
                })
            }
            else {
                dispatch({
                    type: GAME_LOADED,
                    payload: res.data.game
                })
            };
        })
}

export const joinGame = (username, accepted, unadd, room_code) => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    const body = JSON.stringify({ username, accepted, unadd, room_code });

    axios.post('/game/join', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("oops")
            }
            else {
                var response = {
                    game: res.data.game,
                    user: res.data.user,
                    unadd: unadd
                }
                dispatch({
                    type: GAME_JOINED,
                    payload: response
                })
            };
        })
}

export const sendGameInvite = (username, unadd, room_code) => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    const body = JSON.stringify({ username, unadd, room_code });

    axios.post('/game/invite', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("oops")
            }
            else {
                dispatch({
                    type: GAME_LOADED,
                    payload: res.data.game
                })
            };
        })
}