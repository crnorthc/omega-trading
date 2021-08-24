/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
import axios from "axios";
import {
    GAME_CREATED,
    CREATING_GAME,
    GAME_LOADED,
    GAME_LOADING,
    HISTORY_LOADED,
    GAME_INFO_LOADED,
    HISTORY_LOADING,
    NO_HISTORY,
    NO_GAME,
    GAMES_LOADED,
    SEARCH_LOADED,
    MAKING_SEARCH,
    GAME_ERROR,
    MAKING_EDIT,
} from "./types";

function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${"loggedIn"}=`);
    var cookie = "";
    if (parts.length === 2) {
        cookie = parts.pop().split(";").shift();
    }

    return cookie;
}

export const create = (type, rules) => (dispatch) => {
    dispatch({
        type: CREATING_GAME,
    });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ type, rules });

    axios
        .post("/game/create", body, config)
        .then((res) => {
            dispatch({
                type: GAME_CREATED,
                payload: res.data.game,
            });
        })
        .catch((error) => {
            dispatch({
                type: GAME_ERROR,
                payload: error.response.data.Error,
            });
        });
};

export const loadGame = (room_code) => (dispatch) => {
    dispatch({
        type: GAME_LOADING,
    });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ room_code });

    axios.post("/game/load", body, config).then((res) => {
        if (res.status == 204) {
            dispatch({
                type: NO_GAME,
            });
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const joinGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ room_code });

    axios
        .post("/game/join", body, config)
        .then((res) => {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        })
        .catch((error) => {
            console.log("here");
            dispatch({
                type: GAME_ERROR,
                payload: error.response.data.Error,
            });
        });
};

export const declineGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ room_code });

    axios.post("/game/decline", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const leaveGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ room_code });

    axios.post("/game/leave", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const removePlayer = (username, room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ username, room_code });

    axios.post("/game/remove", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const sendGameInvite = (username, unadd, room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ username, unadd, room_code });

    axios.post("/game/invite", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const gameSell = (symbol, quantity, dollars, room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ symbol });

    axios.post("/securities/update", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            var quote = res.data;
            var body = JSON.stringify({
                symbol,
                quantity,
                quote,
                dollars,
                room_code,
            });
            axios.post("/game/sell", body, config).then((res) => {
                if (res.data.Error) {
                    console.log("oops");
                } else {
                    dispatch({
                        type: GAME_LOADED,
                        payload: res.data.game,
                    });
                }
            });
        }
    });
};

export const gameBuy = (symbol, quantity, dollars, room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ symbol });

    axios.post("/securities/update", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            var quote = res.data;
            var body = JSON.stringify({
                symbol,
                quantity,
                quote,
                dollars,
                room_code,
            });
            axios.post("/game/buy", body, config).then((res) => {
                if (res.data.Error) {
                    console.log("oops");
                } else {
                    dispatch({
                        type: GAME_LOADED,
                        payload: res.data.game,
                    });
                }
            });
        }
    });
};

export const startGame = (room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ room_code });

    axios.post("/game/start", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const currentGames = () => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    axios.get("/game/games", config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAMES_LOADED,
                payload: res.data.games,
            });
        }
    });
};

export const gameInfo = (room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const url = "/game/info/" + room_code;

    axios.get(url, config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_INFO_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const searchGames = (metrics) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    dispatch({
        type: MAKING_SEARCH,
    });

    var body = JSON.stringify({ metrics });

    axios.post("/game/search", body, config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: SEARCH_LOADED,
                payload: res.data.search,
            });
        }
    });
};

export const populateSearch = () => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({});

    axios.post("/game/populate", body, config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: SEARCH_LOADED,
                payload: res.data.search,
            });
        }
    });
};

export const searchNameCode = (code, name) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ code, name });

    axios.post("/game/search-basic", body, config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: SEARCH_LOADED,
                payload: res.data.search,
            });
        }
    });
};

export const invite = (username, room_code) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    var body = JSON.stringify({ username, room_code });

    axios.post("/game/invite", body, config).then((res) => {
        if (res.data.error) {
            console.log("oops");
        } else {
            dispatch({
                type: GAME_LOADED,
                payload: res.data.game,
            });
        }
    });
};

export const noGame = () => (dispatch) => {
    dispatch({
        type: NO_GAME,
    });
};
