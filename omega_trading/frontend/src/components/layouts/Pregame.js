import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import profilePic from '../../static/profilePic.png'
import { startGame, loadGame } from '../../actions/game';
import Friends from './Friends';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Graph from './Graph.js';



function Pregame(props) {

    Pregame.propTypes = {
        startGame: PropTypes.func.isRequired,
        game: PropTypes.object
    }

    return (
        <div className='pageContainer'>
            <div className="startup">
                <div className='pregame-header'>
                    <div className='pregame-title'>
                        <h2>Tournament:</h2>
                        <h3 className='room-code'>{props.game.room_code}</h3>
                    </div>
                    <div className='pregame-title'>
                        <h2>Host:</h2>
                        <h3 className='host'>@{props.game.host.username}</h3>
                    </div>
                </div>
                <div className="pregame-rules">
                    <div className="friendsHeader">
                        <h3>Rules</h3>
                    </div>
                    <div className='pregameParams'>
                        <div className='pregame-start-amount'>
                            <div className='pregame-rule'>Start Amount</div>
                            <div className='pregame-amount'>${props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                        </div>
                        <div className='pregame-positions'>
                            <div className='pregame-rule'>Max Positions</div>
                            <div className='pregame-position'>{props.game.positions == 0 ? "Unlimited" : props.game.positions}</div>
                        </div>
                        <div className='pregame-bet'>
                            <div className='pregame-rule'>Bet</div>
                            <div className='pregame-bet'>${props.game.bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                        </div>
                    </div>
                </div>
                <div className='players'>
                    <Friends friendsOnly={true} />
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    game: state.game.game
});

export default connect(mapStateToProps, {})(Pregame);