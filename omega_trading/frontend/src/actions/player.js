import axios from 'axios'
import { GAME_SELECTED } from './types'

function getCookie() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${'loggedIn'}=`)
    var cookie = ''
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    }

    return cookie
}

export const playGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ room_code })

    axios.post('/game/play', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: GAME_SELECTED,
                payload: res.data.player
            })
        }
    })
}