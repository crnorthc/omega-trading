import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { startGame, loadGame, joinGame } from '../../actions/game';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function StartGame(props) {

    const [amount, setAmount] = useState('');
    const [positions, setPositions] = useState('');
    const [bet, setBet] = useState('');
    const [type, setType] = useState('create');
    const [code, setCode] = useState(null);

    StartGame.propTypes = {
        startGame: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        user: PropTypes.object
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

    const style = {
        "background-color": "rgb(202, 202, 202)"
    }

    const create_game = (
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
    )

    const join_game = (
        <div className="rules">
            <div className="subHeader">
                <h4 className="rules-title">Room Code</h4>
            </div>
            <div className='enter-code'>
                <input className="codeInput" onChange={e => setCode(e.target.value)} placeholder="Enter Code" type="text" />
                <button onClick={(e) => props.joinGame(props.user.username, true, false, code)} className='code-button'>Join</button>
            </div>
        </div>
    )

    return (
        <div className='pageContainer'>
            <div className="startup">
                <div className='game-selection'>
                    <button style={type == 'create' ? style : null} onClick={(e) => setType('create')} className='create-game'>Create a Game</button>
                    <button style={type == 'join' ? style : null} onClick={(e) => setType('join')} className='join-game'>Join a Game</button>
                </div>
                {type == 'create' ? create_game : join_game}
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    user: state.user.user
});

export default connect(mapStateToProps, { startGame, loadGame, joinGame })(StartGame);