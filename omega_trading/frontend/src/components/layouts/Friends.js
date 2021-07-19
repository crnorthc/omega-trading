import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import profilePic from "../../static/profilePic.png";
import { loadUsers, hideResults, sendInvite, acceptInvite } from "../../actions/user.js";
import { joinGame, sendGameInvite, setColor } from "../../actions/game";

function Friends(props) {
    const [username, setUsername] = useState(null);
    const [show, setShow] = useState(false);

    Friends.propTypes = {
        loadUsers: PropTypes.func.isRequired,
        acceptInvite: PropTypes.func.isRequired,
        hideResults: PropTypes.func.isRequired,
        sendInvite: PropTypes.func.isRequired,
        setColor: PropTypes.func.isRequired,
        sendGameInvite: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        user: PropTypes.object,
        game: PropTypes.object,
        users: PropTypes.object,
        users_loaded: PropTypes.bool,
    };

    const onKeyUp = (e) => {
        if (username !== "") {
            props.loadUsers(username, props.friendsOnly);
        } else {
            props.hideResults();
        }
    };

    const handleInvite = (username, accepted, unadd) => {
        if (props.friendsOnly) {
            props.joinGame(username, accepted, unadd, props.game.room_code);
        } else {
            props.acceptInvite(username, accepted, unadd);
        }
    };

    const get_colors = (i) => {
        const colors = ["black", "blue", "red", "orange", "green", "hotpink", "purple"];
        var colors_taken = [];
        for (const player in props.game.players) {
            colors_taken.push(props.game.players[player].color);
        }
        var temp = [];
        if (i.username == props.user.username) {
            for (const color in colors) {
                if (colors_taken.includes(colors[color]) && colors[color] != props.game.players[i.username].color) {
                    temp.push(
                        <svg style={{ "background-color": colors[color] }} height="15" width="15">
                            <line x1="0" y1="0" x2="15" y2="15" style={{ stroke: "#fff", "stroke-width": "2" }} />
                            <line x1="0" y1="15" x2="15" y2="0" style={{ stroke: "#fff", "stroke-width": "2" }} />
                        </svg>
                    );
                } else {
                    if (colors[color] == props.game.players[i.username].color) {
                        temp.push(<button style={{ "background-color": colors[color] }} className="myChoice"></button>);
                    } else {
                        temp.push(
                            <button
                                onClick={(e) => props.setColor(colors[color], props.game.room_code)}
                                style={{ "background-color": colors[color] }}
                                className="colorChoice"
                            ></button>
                        );
                    }
                }
            }
            return temp;
        }
    };

    const friendsList = () => {
        var friends = [];
        var list = [];
        if (props.friendsOnly) {
            list = props.game.players;
        } else {
            list = props.user.friends;
        }

        for (const i in list) {
            var temp = (
                <div className={props.friendsOnly ? "otherUser-pregame fr ai-c jc-s" : "otherUser fr ai-c jc-s"}>
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div
                                style={
                                    props.friendsOnly
                                        ? {
                                              color: props.game.players[list[i].username].color,
                                          }
                                        : null
                                }
                                className="fullName-user"
                            >
                                {list[i].first_name} {list[i].last_name}
                            </div>
                            <div className="userName-user">@{i}</div>
                        </div>
                    </div>
                    {props.friendsOnly ? get_colors(list[i]) : null}
                    <div className="addFriend">
                        {props.friendsOnly ? (
                            i == props.game.host.username ? (
                                <button className="editButton">Host</button>
                            ) : i == props.user.username ? (
                                <button onClick={(e) => handleInvite(i, false, true)} className="editButton">
                                    Leave
                                </button>
                            ) : props.user.username === props.game.host.username ? (
                                <button onClick={(e) => handleInvite(i, false, true)} className="editButton">
                                    Remove
                                </button>
                            ) : (
                                <button className="editButton">Joined</button>
                            )
                        ) : (
                            <button onClick={(e) => handleInvite(i, false, true)} className="editButton">
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            );
            friends.push(temp);
        }
        return friends;
    };

    const getInvites = (i) => {
        if (props.friendsOnly) {
            return (
                <div className="addFriend">
                    {props.game.invites[i].sender == props.user.username ? (
                        <button onClick={(e) => props.sendGameInvite(i, true, props.game.room_code)} className="editButton">
                            Uninvite
                        </button>
                    ) : (
                        <button className="editButton">Pending</button>
                    )}
                </div>
            );
        } else {
            return (
                <div className="addFriend">
                    {props.user.invites[i].sent ? (
                        <button onClick={(e) => props.sendInvite(i, true)} className="editButton">
                            Unsend Invite
                        </button>
                    ) : "game" in props.user.invites[i] ? (
                        <div className="acceptButtons">
                            <button
                                onClick={(e) => props.joinGame(props.user.username, true, false, props.user.invites[i].game.room_code)}
                                on
                                className="accept b"
                            >
                                Accept
                            </button>
                            <button
                                onClick={(e) => props.joinGame(props.user.username, false, false, props.user.invites[i].game.room_code)}
                                className="decline b"
                            >
                                Decline
                            </button>
                        </div>
                    ) : (
                        <div className="acceptButtons">
                            <button onClick={(e) => handleInvite(i, true, false)} className="accept b">
                                Accept
                            </button>
                            <button onClick={(e) => handleInvite(i, false, false)} className="decline b">
                                Decline
                            </button>
                        </div>
                    )}
                </div>
            );
        }
    };

    const getSender = (i) => {
        if (props.friendsOnly) {
            return (
                <div className="user-left fr ai-c">
                    <div className="userPic-cont">
                        <img className="userPic" src={profilePic} width={40} />
                    </div>
                    <div className="userNames fr ai-c">
                        <div className="fullName-user">
                            {props.game.invites[i].first_name} {props.game.invites[i].last_name}
                        </div>
                        <div className="userName-user">@{i}</div>
                    </div>
                </div>
            );
        } else {
            if ("game" in props.user.invites[i]) {
                return (
                    <div className="game-user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="sender">@{props.user.invites[i].sender}</div>
                        <div className="game-invite">
                            <div className="friends-start-amount">
                                Start Amount: ${props.user.invites[i].game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                            <div className="friends-bet">Bet: ${props.user.invites[i].game.bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div className="fullName-user">
                                {props.user.invites[i].first_name} {props.user.invites[i].last_name}
                            </div>
                            <div className="userName-user">@{i}</div>
                        </div>
                    </div>
                );
            }
        }
    };

    const invitesList = () => {
        var invites = [];
        var list = [];
        if (props.friendsOnly) {
            list = props.game.invites;
        } else {
            list = props.user.invites;
        }

        for (const i in list) {
            var temp = (
                <div className={props.friendsOnly ? "otherUser-pregame fr ai-c jc-s" : "otherUser fr ai-c jc-s"}>
                    {getSender(i)}
                    {getInvites(i)}
                </div>
            );
            invites.push(temp);
        }
        return invites;
    };

    const show_users = (i) => {
        if (props.friendsOnly) {
            return (
                <div className="addFriend">
                    {i in props.game.invites ? (
                        props.game.invites[i].sender == props.user.username ? (
                            <button onClick={(e) => props.sendGameInvite(i, true, props.game.room_code)} className="editButton">
                                Uninvite
                            </button>
                        ) : (
                            <button className="editButton">Pending</button>
                        )
                    ) : (
                        <button onClick={(e) => props.sendGameInvite(i, false, props.game.room_code)} className="editButton">
                            Invite
                        </button>
                    )}
                </div>
            );
        } else {
            return (
                <div className="addFriend">
                    {props.users[i].sent ? (
                        <div className="acceptButtons">
                            <button onClick={(e) => props.acceptInvite(i, true, false)} on className="accept b">
                                Accept
                            </button>
                            <button onClick={(e) => props.acceptInvite(i, false, false)} className="decline b">
                                Decline
                            </button>
                        </div>
                    ) : props.user !== null && props.users !== undefined ? (
                        props.users[i].username in props.user.invites ? (
                            <button className="editButton">Pending</button>
                        ) : props.users[i].username in props.user.friends ? (
                            <button onClick={(e) => props.acceptInvite(i, false, true)} className="editButton">
                                Unadd
                            </button>
                        ) : (
                            <button onClick={(e) => props.sendInvite(props.users[i].username, false)} className="editButton">
                                Send Invite
                            </button>
                        )
                    ) : null}
                </div>
            );
        }
    };

    const showUsers = () => {
        var users = [];
        if (props.users.length == 0) {
            return (
                <div className="bb">
                    <div className="subFriendsHeader">
                        <h4 className="friendsSection bb">Suggested</h4>
                    </div>
                    <div className="noUsers">No results</div>
                </div>
            );
        }

        for (const i in props.users) {
            var temp = (
                <div className={props.friendsOnly ? "otherUser-pregame fr ai-c jc-s" : "otherUser fr ai-c jc-s"}>
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div className="fullName-user">
                                {props.users[i].first_name} {props.users[i].last_name}
                            </div>
                            <div className="userName-user">@{props.users[i].username}</div>
                        </div>
                    </div>
                    {show_users(i)}
                </div>
            );
            users.push(temp);
        }
        return (
            <div className="bb fc jc-c ai-c">
                <div className="subHeader f jc-c">
                    <h4 className="friendsSection bb">Suggested</h4>
                </div>
                {users}
            </div>
        );
    };

    return (
        <div>
            <div className="friendsHeader bb f ai-c jc-s">
                <h3>{props.friendsOnly ? "Players" : "Friends"}</h3>
                <div className="search-friends b">
                    <img className="searchIcon" src="../../../static/search.png" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="friendsInput"
                        onFocus={(e) => setShow(true)}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={onKeyUp}
                    />
                </div>
            </div>
            {props.users_loaded && show ? showUsers() : null}
            <div className="subHeader f jc-c">
                <h4 className="friendsSection bb">Invites</h4>
            </div>
            <div className="bb fc ai-c">
                {props.friendsOnly ? (
                    Object.keys(props.game.invites).length > 0 ? (
                        invitesList()
                    ) : (
                        <div className="noList">Invite friends to start a game</div>
                    )
                ) : Object.keys(props.user.invites).length > 0 ? (
                    invitesList()
                ) : (
                    <div className="noList">You have no invites at this time</div>
                )}
            </div>
            <div className="subHeader f jc-c">
                <h4 className="friendsSection bb">{props.friendsOnly ? "Players" : "Your Friends"}</h4>
            </div>
            <div className="fc f ai-c jc-c">
                {props.friendsOnly ? (
                    friendsList()
                ) : Object.keys(props.user.friends).length > 0 ? (
                    friendsList()
                ) : (
                    <div className="noList">Connect with friends!</div>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    users: state.user.users,
    users_loaded: state.user.users_loaded,
    game: state.game.game,
});

export default connect(mapStateToProps, {
    setColor,
    sendGameInvite,
    joinGame,
    loadUsers,
    hideResults,
    sendInvite,
    acceptInvite,
})(Friends);
