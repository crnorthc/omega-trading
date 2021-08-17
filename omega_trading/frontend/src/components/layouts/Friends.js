/* eslint-disable react/prop-types */
import React, { useState } from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import profilePic from '../../static/profilePic.png'
import { loadUsers, hideResults, sendInvite, acceptInvite, removeFriend, joinGame  } from '../../actions/user.js'
import { declineGame } from '../../actions/game'

function Friends(props) {
    const [username, setUsername] = useState(null)
    const [show, setShow] = useState(false)

    Friends.propTypes = {
        loadUsers: PropTypes.func.isRequired,
        acceptInvite: PropTypes.func.isRequired,
        hideResults: PropTypes.func.isRequired,
        sendInvite: PropTypes.func.isRequired,
        removeFriend: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        declineGame: PropTypes.func.isRequired,
        user: PropTypes.object,
        game: PropTypes.object,
        users: PropTypes.object,
        users_loaded: PropTypes.bool,
    }

    const onKeyUp = () => {
        if (username !== '') {
            props.loadUsers(username, false)
        } else {
            props.hideResults()
        }
    }

    const handleInvite = (username, accepted) => {
        props.acceptInvite(username, accepted)
    }

    const friendsList = () => {
        var friends = []
        var list = props.user.friends

        for (const i in list) {
            var temp = (
                <div className='otherUser fr ai-c jc-s'>
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div className="fullName-user">
                                {list[i].first_name} {list[i].last_name}
                            </div>
                            <div className="userName-user">@{i}</div>
                        </div>
                    </div>
                    <div className="addFriend">
                        <button onClick={() => props.removeFriend(i)} className="editButton">
                                Remove
                        </button>
                    </div>
                </div>
            )
            friends.push(temp)
        }
        return friends
    }

    const getInvites = (i) => {
        return (
            <div className="addFriend">
                {props.user.invites[i].sent ? (
                    <button onClick={() => props.sendInvite(i, true)} className="editButton">
                            Unsend Invite
                    </button>
                ) : 'game' in props.user.invites[i] ? (
                    <div className="acceptButtons">
                        <button
                            onClick={() => props.joinGame(i)}
                            on
                            className="accept b"
                        >
                                Accept
                        </button>
                        <button
                            onClick={() => props.declineGame(i)}
                            className="decline b"
                        >
                                Decline
                        </button>
                    </div>
                ) : (
                    <div className="acceptButtons">
                        <button onClick={() => handleInvite(i, true)} className="accept b">
                                Accept
                        </button>
                        <button onClick={() => handleInvite(i, false)} className="decline b">
                                Decline
                        </button>
                    </div>
                )}
            </div>
        )        
    }

    const getSender = (i) => {
        if ('game' in props.user.invites[i]) {
            return (
                <div className="game-user-left fr ai-c">
                    <div className="userNames fr ai-c">
                        <div className="fullName-user">{props.user.invites[i].game.name}</div>
                        <div className="userName-user">{i}</div>
                    </div>
                </div>
            )
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
            )
        }        
    }

    const invitesList = () => {
        var invites = []
        var list = props.user.invites
        
        for (const i in list) {
            var temp = (
                <div className='otherUser fr ai-c jc-s'>
                    {getSender(i)}
                    {getInvites(i)}
                </div>
            )
            invites.push(temp)
        }
        return invites
    }

    const show_users = (i) => {
        return (
            <div className="addFriend">
                {props.users[i].sent ? (
                    <div className="acceptButtons">
                        <button onClick={() => props.acceptInvite(i, true, false)} on className="accept b">
                                Accept
                        </button>
                        <button onClick={() => props.acceptInvite(i, false, false)} className="decline b">
                                Decline
                        </button>
                    </div>
                ) : props.user !== null && props.users !== undefined ? (
                    i in props.user.invites ? (
                        <button className="editButton">Pending</button>
                    ) : i in props.user.friends ? (
                        <button onClick={() => props.acceptInvite(i, false, true)} className="editButton">
                                Unadd
                        </button>
                    ) : (
                        <button onClick={() => props.sendInvite(i, false)} className="editButton">
                                Send Invite
                        </button>
                    )
                ) : null}
            </div>
        )
    }

    const showUsers = () => {
        var users = []
        if (Object.keys(props.users).length == 0) {
            return (
                <div className="bb">
                    <div className="subHeader f jc-c">
                        <h4 className="friendsSection bb">Suggested</h4>
                    </div>
                    <div className="noUsers fr jc-c ai-c mmy f22 lt">No results</div>
                </div>
            )
        }

        for (const i in props.users) {
            var temp = (
                <div className='otherUser fr ai-c jc-s'>
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div className="fullName-user">
                                {props.users[i].first_name} {props.users[i].last_name}
                            </div>
                            <div className="userName-user">@{i}</div>
                        </div>
                    </div>
                    {show_users(i)}
                </div>
            )
            users.push(temp)
        }
        return (
            <div className="bb fc jc-c ai-c">
                <div className="subHeader f jc-c">
                    <h4 className="friendsSection bb">Suggested</h4>
                </div>
                {users}
            </div>
        )
    }

    return (
        <div>
            <div className="friendsHeader bb f ai-c jc-s">
                <h3>{props.friendsOnly ? 'Players' : 'Friends'}</h3>
                <div className="search-friends b">
                    <img className="searchIcon" src="../../../static/search.png" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="friendsInput"
                        onFocus={() => setShow(true)}
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
                {Object.keys(props.user.invites).length > 0 ? (
                    invitesList()
                ) : (
                    <div className="noList">You have no invites at this time</div>
                )}
            </div>
            <div className="subHeader f jc-c">
                <h4 className="friendsSection bb">Your Friends</h4>
            </div>
            <div className="fc f ai-c jc-c">
                {Object.keys(props.user.friends).length > 0 ? (
                    friendsList()
                ) : (
                    <div className="noList">Connect with friends!</div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    users: state.user.users,
    users_loaded: state.user.users_loaded,
    game: state.game.game,
})

export default connect(mapStateToProps, {
    removeFriend,
    joinGame,
    loadUsers,
    hideResults,
    sendInvite,
    acceptInvite,
    declineGame
})(Friends)
