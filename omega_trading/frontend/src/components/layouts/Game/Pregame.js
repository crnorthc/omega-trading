import React, { useState } from 'react'
// import './Game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUsers } from '../../../actions/user'
import { leaveGame, invite, startGame } from '../../../actions/game'
import Players from './Players'

function Pregame(props) {
    const [message, setMessage] = useState('Start Game')
    const [showInvite, setShow] = useState(false)
    const [search, setSearch] = useState('')

    Pregame.propTypes = {
        invite: PropTypes.func.isRequired,
        loadUsers: PropTypes.func.isRequired,
        leaveGame: PropTypes.func.isRequired,
        startGame: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object,
        users: PropTypes.object,
    }

    const find = () => {
        if (search !== '') {
            props.loadUsers(search, true)
        }
    }

    const getFriends = () => {
        var users = []
        if (Object.keys(props.users).length == 0) {
            return <div className="fr jc-c smx smy f22 lt">No Results</div>
        } else {
            for (const i in props.users) {
                users.push(
                    <div className="fr smy smx jc-s ai-c">
                        <div className="f16">{i}</div>
                        {i in props.game.invites ? (
                            <button className="editButtonMediumHidden">Sent</button>
                        ) : (
                            <button onClick={() => props.invite(i, props.game.room_code)} className="editButtonMedium">
                                Invite
                            </button>
                        )}
                    </div>
                )
            }
            return users
        }
    }

    const inviteSearch = (
        <div className="invite-search">
            <div className="fr smy smx jc-st ai-c">
                <input type="text" placeholder="Search" className="invite-input" onFocus={() => setShow(true)} value={search} onChange={(e) => setSearch(e.target.value)} onKeyUp={() => find()} />
            </div>
            {props.users !== null && search != '' ? getFriends() : null}
        </div>
    )

    return (
        <div className="fc text-main-text lmt jc-s">
            <div>
                <div className="fr mmx ai-b jc-s">
                    <button onClick={() => setShow(!showInvite)} className="editButton">
                        Invite
                    </button>
                    {showInvite ? inviteSearch : null}
                    <div className="f32 bld">{props.game.name}</div>
                    {props.user.username == props.game.host.username ? (
                        <button className="editButton">{props.game.type ? 'Public' : 'Private'}</button>
                    ) : (
                        <button onClick={() => props.leaveGame(props.game.room_code)} className="editButton">
                            Leave
                        </button>
                    )}
                </div>
                <div className="rules_container bg-main-nav fr jc-c ai-c mmt b"></div>
            </div>
            <div className="fc mmy bg-main-nav b">
                <div>
                    <Players />
                </div>
            </div>
            <div className="startgame-section fc ai-c jc-c">
                {Object.keys(props.game.players).length == 1 ? (
                    <div className="work fc ai-c jc-c">
                        <button className="editButtonHidden">Start</button>
                        <div className="noAction">There needs to be atleast two players to start a game</div>
                    </div>
                ) : props.game.host.username == props.user.username ? (
                    <div className="work fc ai-c jc-c">
                        <button onClick={() => props.startGame(props.game.room_code)} className="editButton">
                            Start
                        </button>
                        <div className="noAction">{message}</div>
                    </div>
                ) : (
                    <div className="work fc ai-c jc-c">
                        <button className="editButtonHidden">Start</button>
                        <div className="noAction">Wait for the host to start the game</div>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    type_changing: state.game.type_changing,
    game: state.game.game,
    users: state.user.users,
    user: state.user.user,
})

export default connect(mapStateToProps, {
    leaveGame,
    loadUsers,
    invite,
    startGame,
})(Pregame)
