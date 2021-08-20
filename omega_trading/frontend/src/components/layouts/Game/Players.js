/* eslint-disable react/prop-types */
import React, { useState } from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import profilePic from '../../../static/profilePic.png'
import { removePlayer } from '../../../actions/game'

function Players(props) {
    const [search, setSearch] = useState(null)
    const [show, setShow] = useState(false)

    Players.propTypes = {
        removePlayer: PropTypes.func.isRequired,
        user: PropTypes.object,
        game: PropTypes.object,
    }

    const onKeyUp = () => {
        if (search == '') {
            setShow(false)
        }
        else {
            setShow(true)
        }
    }

    const isMatch = (username) => {
        var user_name = username.toLocaleLowerCase().includes(search)
        var first_name = props.game.players[username].first_name.toLocaleLowerCase().includes(search)
        var last_name = props.game.players[username].last_name.toLocaleLowerCase().includes(search)
        if (show) {
            if (user_name || first_name || last_name) {
                return true
            }
            else {
                return false
            }
        }
        return true
    }

    const playersList = () => {
        var friends = []
        var list = props.game.players

        for (const i in list) {
            var temp = (
                <div className='otherUser-pregame fr ai-c jc-s'>
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="userNames fr ai-c">
                            <div>
                                {list[i].first_name} {list[i].last_name}
                            </div>
                            <div className="userName-user">@{i}</div>
                        </div>
                    </div>
                    <div className="addFriend">
                        {i == props.game.host.username ? (
                            <button className="editButtonDisabled">Host</button>
                        ) :  props.user.username === props.game.host.username ? (
                            <button onClick={() => props.removePlayer(i, props.game.room_code)} className="editButton">
                                    Remove
                            </button>
                        ) : (
                            null
                        )
                        }
                    </div>
                </div>
            )
            if (isMatch(i)) {
                if (i == props.game.host.username) {
                    friends.unshift(temp)
                }
                else {
                    friends.push(temp)
                }                
            }
        }

        if (friends.length == 0) {
            return (
                <div className='f22 lt'>No players found</div>
            )
        }
        else {
            return friends
        }        
    }

    return (
        <div>
            <div className="friendsHeader bb f ai-c jc-s">
                <h3>Players</h3>
                <div className="search-friends b">
                    <img className="searchIcon" src="../../../static/search.png" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="friendsInput"
                        value={search}
                        onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
                        onKeyUp={onKeyUp}
                    />
                </div>
            </div>
            <div className="fc lpy f ai-c jc-c">
                {playersList()}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    game: state.game.game,
})

export default connect(mapStateToProps, { removePlayer })(Players)
