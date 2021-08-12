import axios from 'axios'
import {
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_JOINED,
    GAME_LOADING,
    HISTORY_LOADED,
    GAME_INFO_LOADED,
    HISTORY_LOADING,
    QUOTE_LOADED,
    NO_HISTORY,
    NO_GAME,
    GAMES_LOADED,
    SEARCH_LOADED,
    MAKING_SEARCH,
    SELECTING_GAME,
    GAME_SELECTED,
    TYPE_CHANGING,
    MAKING_EDIT
} from './types'

function getCookie() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${'loggedIn'}=`)
    var cookie = ''
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    }

    return cookie
}

function getDates(games) {
    var temp = games
    for (const game in games) {
        var date = new Date(games[game].start_time * 1000)
        temp[game].start_time = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            mins: date.getMinutes(),
        }
    }
    return temp
}

export const createGame = (amount, bet, commission, date, endOn, name, Public, options) => (dispatch) => {
    dispatch({
        type: CREATING_GAME,
    })

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({
        amount,
        bet,
        commission,
        date,
        endOn,
        name, 
        Public,
        options
    })

    axios.post('/game/create', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_CREATED,
                payload: res.data.game,
            })
        }
    })
}

export const editGame = (amount, date, endOn, commission, options, code) => (dispatch) => {
    dispatch({
        type: MAKING_EDIT,
    })

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({amount, date, endOn, commission, options, code})

    axios.post('/game/edit', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_SELECTED,
                payload: res.data.game,
            })
        }
    })
}

export const loadGame = (room_code) => (dispatch) => {
    dispatch({
        type: SELECTING_GAME,
    })

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ room_code })

    axios.post('/game/load', body, config).then((res) => {
        if (res.status == 204) {
            dispatch({
                type: NO_GAME,
            })
        } else {
            dispatch({
                type: GAME_SELECTED,
                payload: res.data.game,
            })
        }
    })
}

export const joinGame = (username, accepted, unadd, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, accepted, unadd, room_code })

    axios.post('/game/join', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            var response = {
                game: res.data.game,
                user: res.data.user,
                unadd: unadd,
            }
            dispatch({
                type: GAME_JOINED,
                payload: response,
            })
        }
    })
}

export const sendGameInvite = (username, unadd, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, unadd, room_code })

    axios.post('/game/invite', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const gameSell = (symbol, quantity, dollars, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ symbol })

    axios.post('/securities/update', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            var quote = res.data
            var body = JSON.stringify({
                symbol,
                quantity,
                quote,
                dollars,
                room_code,
            })
            axios.post('/game/sell', body, config).then((res) => {
                if (res.data.Error) {
                    console.log('oops')
                } else {
                    dispatch({
                        type: GAME_LOADED,
                        payload: res.data.game,
                    })
                }
            })
        }
    })
}

export const gameBuy = (symbol, quantity, dollars, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ symbol })

    axios.post('/securities/update', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            var quote = res.data
            var body = JSON.stringify({
                symbol,
                quantity,
                quote,
                dollars,
                room_code,
            })
            axios.post('/game/buy', body, config).then((res) => {
                if (res.data.Error) {
                    console.log('oops')
                } else {
                    dispatch({
                        type: GAME_LOADED,
                        payload: res.data.game,
                    })
                }
            })
        }
    })
}

export const setColor = (color, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ color, room_code })
    axios.post('/game/color', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const startGame = (start) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({})

    if (start) {
        axios.post('/game/start', body, config).then((res) => {
            if (res.data.Error) {
                console.log('oops')
            } else {
                dispatch({
                    type: GAME_LOADED,
                    payload: getData(res.data.game),
                })
            }
        })
    } else {
        axios.post('/game/start-bet', body, config).then((res) => {
            if (res.data.Error) {
                console.log('oops')
            } else {
                dispatch({
                    type: GAME_LOADED,
                    payload: res.data.game,
                })
            }
        })
    }
}

export const loadHistory = () => (dispatch) => {
    dispatch({
        type: HISTORY_LOADING,
    })

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({})

    axios.post('/game/history', body, config).then((res) => {
        if (res.status == 204) {
            dispatch({
                type: NO_HISTORY,
            })
        } else {
            dispatch({
                type: HISTORY_LOADED,
                payload: getDates(res.data.games),
            })
        }
    })
}

export const getEtherQuote = (quantity) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ quantity })

    axios.post('/game/quote-ether', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: QUOTE_LOADED,
                payload: res.data,
            })
        }
    })
}

export const getGasQuote = () => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({})

    axios.post('/game/quote-gas', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: QUOTE_LOADED,
                payload: res.data,
            })
        }
    })
}

export const makeBet = (address, key, room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ address, key, room_code })

    axios.post('/game/make-bet', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const defineContract = (address, bet) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ address, bet })

    axios.post('/game/define-contract', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const readyUp = (room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ room_code })

    axios.post('/game/ready-up', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const currentGames = () => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    axios.get('/game/games', config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAMES_LOADED,
                payload: res.data.games,
            })
        }
    })
}

export const gameInfo = (room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const url = '/game/info/' + room_code

    axios.get(url, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_INFO_LOADED,
                payload: res.data.game,
            })
        }
    })
}

export const searchGames = (metrics) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    dispatch({
        type: MAKING_SEARCH
    })

    var body = JSON.stringify({ metrics })

    axios.post('/game/search', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: SEARCH_LOADED,
                payload: res.data.search,
            })
        }
    })
}

export const searchNameCode = (code, name) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    var body = JSON.stringify({ code, name })

    axios.post('/game/search-basic', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: SEARCH_LOADED,
                payload: res.data.search,
            })
        }
    })
}

export const changeType = (type, game) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }
    game.type = type

    dispatch({
        type: TYPE_CHANGING,
        payload: game
    })

    var code = game.room_code

    var body = JSON.stringify({ type, code })

    axios.post('/game/type', body, config).then((res) => {
        if (res.data.error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_SELECTED,
                payload: res.data.game,
            })
        }
    })
}

