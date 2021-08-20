import axios from 'axios'
import { USER_LOADED, 
    USERS_LOADED, 
    HIDE_RESULTS, 
    UPDATE_USER, 
    NO_USER
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

export const hideResults = () => (dispatch) => {
    dispatch({
        type: HIDE_RESULTS,
    })
}

export const loadUser = () => (dispatch) => {
    var cookie = getCookie()

    if (cookie == '') {
        var config = {
            headers: {
                'Content-Type': 'application/json'
            },
        }
    }
    else {
        config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Token ' + getCookie(),
            },
        }
    }



    const body = JSON.stringify({})

    axios.post('/users/load', body, config).then((res) => {
        if (res.status == 204) {
            dispatch({
                type: NO_USER
            })
        } else {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        }
    })
}

export const acceptInvite = (username, accepted) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, accepted })

    axios.post('/users/accept', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            })
        }
    })
}

export const sendInvite = (username, unsend) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, unsend })

    axios.post('/users/invite', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            })
        }
    })
}

export const removeFriend = (username) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username })

    axios.post('/users/remove-friend', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            })
        }
    })
}

export const loadUsers = (username, friends) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ username, friends })

    axios.post('/users/search-user', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: USERS_LOADED,
                payload: res.data,
            })
        }
    })
}

export const joinGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie(),
        },
    }

    const body = JSON.stringify({ room_code })

    axios.post('/users/join-game', body, config).then((res) => {
        if (res.data.Error) {
            console.log('oops')
        } else {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        }
    })
}

