import axios from 'axios';
import {
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    HISTORY_LOADED,
    HISTORY_LOADING,
    NO_HISTORY,
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

function getData(game) {
    var players = game.players
    for (const player in game.players) {
        var temp = []
        if ('numbers' in game.players[player]) {
            for (let i = 0; i < game.players[player].numbers.length; i++) {
                var time = game.players[player].numbers[i].time
                var date = new Date(time * 1000)
                var year = date.getFullYear()
                var month = date.getMonth()
                var day = date.getDate()
                var hours = date.getHours()
                var mins = date.getMinutes()
                temp.push({ time: { year: year, month: month, day: day, hours: hours, minutes: mins }, price: game.players[player].numbers[i]['price'] })
            }
            players[player].numbers = temp
        }
        game.players = players
    }
    if ('charts' in game) {
        var charts = game.charts
        for (const chart in game.charts) {
            var temp = []
            for (let i = 0; i < game.charts[chart].length; i++) {
                var time = game.charts[chart][i].time
                var date = new Date(time * 1000)
                var year = date.getFullYear()
                var month = date.getMonth()
                var day = date.getDate()
                var hours = date.getHours()
                var mins = date.getMinutes()
                temp.push({ time: { year: year, month: month, day: day, hours: hours, minutes: mins }, price: game.charts[chart][i]['price'] })
            }
            charts[chart] = temp
        }
        game.charts = charts
    }
    return game
}

function getDates(games) {
    var temp = games
    for (const game in games) {
        var date = new Date(games[game].start_time * 1000)
        temp[game].start_time = {
            'year': date.getFullYear(),
            'month': date.getMonth(),
            'day': date.getDate(),
            'hour': date.getHours(),
            'mins': date.getMinutes()
        }
    }
    return temp
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

export const editGame = (amount, bet, positions, days, hours, mins, code) => dispatch => {

    dispatch({
        type: GAME_LOADING
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
        body = JSON.stringify({ amount, bet, days, hours, mins, code });
    }
    else {
        positions = parseInt(positions)
        body = JSON.stringify({ amount, bet, positions, days, hours, mins, code });
    }


    axios.post('/game/edit', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log('oops')
            }
            else {
                dispatch({
                    type: GAME_LOADED,
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
                    payload: getData(res.data.game)
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

export const gameSell = (symbol, quantity, dollars, room_code) => dispatch => {

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
                var body = JSON.stringify({ symbol, quantity, quote, dollars, room_code });
                axios.post('/game/sell', body, config)
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
            };
        })
}

export const gameBuy = (symbol, quantity, dollars, room_code) => dispatch => {

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
                var body = JSON.stringify({ symbol, quantity, quote, dollars, room_code });
                axios.post('/game/buy', body, config)
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
            };
        })
}

export const setColor = (color, room_code) => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body = JSON.stringify({ color, room_code });
    axios.post('/game/color', body, config)
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

export const startGame = () => dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body = JSON.stringify({});
    axios.post('/game/start', body, config)
        .then(res => {
            if (res.data.Error) {
                console.log("oops")
            }
            else {
                dispatch({
                    type: GAME_LOADED,
                    payload: getData(res.data.game)
                })
            };
        })
}

export const loadHistory = () => dispatch => {

    dispatch({
        type: HISTORY_LOADING
    })

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + getCookie()
        }
    };

    var body = JSON.stringify({});

    axios.post('/game/history', body, config)
        .then(res => {
            if (res.status == 204) {
                dispatch({
                    type: NO_HISTORY
                })
            }
            else {
                dispatch({
                    type: HISTORY_LOADED,
                    payload: getDates(res.data.games)
                })
            };
        })
}