import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import profilePic from '../../static/profilePic.png'
import { startGame, loadGame } from '../../actions/game';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Graph from './Graph.js';



function StartGame(props) {

    const [amount, setAmount] = useState('');
    const [positions, setPositions] = useState('');
    const [bet, setBet] = useState('');

    StartGame.propTypes = {
        startGame: PropTypes.func.isRequired
    }

    const noPositions = {
        "color": "rgb(175, 175, 175)",
        "border-color": "rgb(175, 175, 175)"
    }

    const createGame = () => {
        if (amount !== '') {
            if (bet !== '') {
                props.startGame(amount, bet, positions)
            }
        }
    }

    return (
        <div className='pageContainer'>
            <div className="startup">
                <h1 className="create-game">Create a Tournament</h1>
                <div className="rules">
                    <div className="subHeader">
                        <h4 className="rules-title">Rules</h4>
                    </div>
                    <div className='game-params'>
                        <div className='start-amount'>
                            <div className='rule'>Start Amount</div>
                            <input className="amountInput" onChange={e => setAmount(e.target.value)} placeholder="$0.00" type="number" min="5000" />
                        </div>
                        <div className='positions'>
                            <div style={positions == "" ? noPositions : null} className='rule'>Max Positions</div>
                            <input style={positions == "" ? noPositions : null} className="amountInput" onChange={e => setPositions(e.target.value)} placeholder="Unlimited" type="number" min="5000" />
                        </div>
                        <div className='bet'>
                            <div className='rule'>Bet</div>
                            <input className="amountInput" onChange={e => setBet(e.target.value)} placeholder="$0.00" type="number" min="5000" />
                        </div>
                    </div>
                    <div className='enter-params'>
                        <button onClick={(e) => createGame()} className='to-invites'>Invite Players</button>
                    </div>
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { startGame, loadGame })(StartGame);