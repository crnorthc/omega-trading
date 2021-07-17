import axios from "axios";
import {
    USER_LOADED,
    USERS_LOADED,
    PORTFOLIO_LOADED,
    SECURITY_LOADING,
    HIDE_RESULTS,
    UPDATE_USER,
    FRIENDS_LOADED,
    HISTORY_SAVED,
    LOADING,
    LEADERBOARD_LOADED,
} from "./types";

function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${"OmegaToken"}=`);
    var cookie = "";
    if (parts.length === 2) {
        cookie = parts.pop().split(";").shift();
    }

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + cookie,
        },
    };

    var path = window.location.pathname + window.location.search;

    const body = JSON.stringify({ path });

    //axios.post('/users/history', body, config)

    return cookie;
}

function getData(numbers) {
    var data = [];
    for (let i = 0; i < numbers.length; i++) {
        var time = numbers[i]["time"];
        var date = new Date(time * 1000);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hours = date.getHours();
        var mins = date.getMinutes();
        data.push({ time: { year: year, month: month, day: day, hours: hours, minutes: mins }, price: numbers[i]["price"] });
    }
    return data;
}
export const hideResults =
    (period, friends = false, username = false) =>
    (dispatch) => {
        dispatch({
            type: HIDE_RESULTS,
        });
    };

export const loadPortfolio =
    (period, friends = false, username) =>
    (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + getCookie(),
            },
        };
        dispatch({
            type: SECURITY_LOADING,
        });

        const body = JSON.stringify({ period: period, friends: friends, username: username });

        axios.post("/users/portfolio", body, config).then((res) => {
            if (res.data.Error) {
                console.log("ooops");
            } else {
                if (friends) {
                    var charts = {};
                    for (const property in res.data.Success) {
                        charts[property] = getData(res.data.Success[property]);
                    }
                    dispatch({
                        type: FRIENDS_LOADED,
                        payload: charts,
                    });
                } else {
                    if (username == false) {
                        var returnData = getData(res.data.Success.numbers);
                        var charts = {};
                        for (const property in res.data.Success.small_charts) {
                            charts[property] = getData(res.data.Success.small_charts[property]);
                        }
                        dispatch({
                            type: PORTFOLIO_LOADED,
                            payload: { data: returnData, small_charts: charts },
                        });
                    } else {
                        var returnData = getData(res.data.Success.numbers);
                        var charts = {};
                        for (const property in res.data.Success.small_charts) {
                            charts[property] = getData(res.data.Success.small_charts[property]);
                        }
                        dispatch({
                            type: FRIEND_LOADED,
                            payload: { data: returnData, small_charts: charts, holdings: res.data.Success.holdings },
                        });
                    }
                }
            }
        });
    };

export const loadUser = () => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({});

    axios.post("/users/load", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            });
        }
    });
};

export const acceptInvite = (username, accepted, unadd) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ username, accepted, unadd });

    axios.post("/users/accept", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            });
        }
    });
};

export const sendInvite = (username, unsend) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ username, unsend });

    axios.post("/users/invite", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: UPDATE_USER,
                payload: res.data,
            });
        }
    });
};

export const loadUsers = (username, friends) => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({ username, friends });

    axios.post("/users/search-user", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: USERS_LOADED,
                payload: res.data,
            });
        }
    });
};

export const buy = (symbol, quantity, dollars) => (dispatch) => {
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
            var body = JSON.stringify({ symbol, quantity, quote, dollars });
            axios.post("/users/buy", body, config).then((res) => {
                if (res.data.Error) {
                    console.log("oops");
                } else {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data,
                    });
                }
            });
        }
    });
};

export const sell = (symbol, quantity, dollars) => (dispatch) => {
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
            var body = JSON.stringify({ symbol, quantity, quote, dollars });
            axios.post("/users/sell", body, config).then((res) => {
                if (res.data.Error) {
                    console.log("oops");
                } else {
                    dispatch({
                        type: USER_LOADED,
                        payload: res.data,
                    });
                }
            });
        }
    });
};

export const saveHistory = () => (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };
    dispatch({
        type: HISTORY_SAVED,
    });
};

export const loadLeaderboard = () => (dispatch) => {
    dispatch({
        type: LOADING,
    });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + getCookie(),
        },
    };

    const body = JSON.stringify({});

    axios.post("/users/leaderboard", body, config).then((res) => {
        if (res.data.Error) {
            console.log("oops");
        } else {
            dispatch({
                type: LEADERBOARD_LOADED,
                payload: res.data,
            });
        }
    });
};
