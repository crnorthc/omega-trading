import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import profilePic from '../../static/profilePic.png'
import Crypto from './Crypto'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUser, saveHistory } from '../../../actions/user.js'

function Betting(props) {
    const [crypto, setCrypto] = useState(false)

    if (!props.isAuthenticated) {
        return <Redirect to="/login"></Redirect>
    }

    Betting.propTypes = {
        game: PropTypes.object,
        user: PropTypes.object,
        loadUser: PropTypes.func.isRequired,
        saveHistory: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    }

    const getPlayers = () => {
        var players = []
        const contract = props.game.contract

        for (const player in contract.players) {
            players.push(
                <div className="mmx mmy fr ai-c jc-s">
                    <div className="user-left fr ai-c">
                        <div className="userPic-cont">
                            <img className="userPic" src={profilePic} width={40} />
                        </div>
                        <div className="mml fr ai-c">
                            <div className="f18 bld">{player}</div>
                        </div>
                        {props.user.username == props.game.host.username && props.user.username != player ? (
                            <button className="editButton sml">Remove</button>
                        ) : null}
                    </div>
                    <div className="fr jc-s">
                        {contract.players[player].payed ? (
                            contract.players[player].ready ? (
                                player == props.user.username ? (
                                    <button className="editButton">Not Ready</button>
                                ) : (
                                    <button className="editButtonHidden">Ready</button>
                                )
                            ) : player == props.user.username ? (
                                <button className="editButton">Ready Up</button>
                            ) : (
                                <button className="editButtonHidden">Bet Made</button>
                            )
                        ) : player == props.user.username ? (
                            <button onClick={() => setCrypto(true)} className="editButton">
                                Place Bet
                            </button>
                        ) : (
                            <button className="editButtonHidden">Pending</button>
                        )}
                    </div>
                </div>
            )
        }

        return players
    }

    return (
        <div className="pageContainer fr jc-c">
            <div className="bets b fc">{getPlayers()}</div>
            {crypto ? <Crypto value={props.game.contract.fee} bet={props.game.contract.bet} create={false} /> : null}
        </div>
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    game: state.game.game,
    user: state.user.user,
})

export default connect(mapStateToProps, { saveHistory, loadUser })(Betting)
