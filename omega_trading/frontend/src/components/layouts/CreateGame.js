import React, { useState } from 'react';
import { createGame, loadGame, joinGame } from '../../actions/game';
import Rules from './Rules';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function CreateGame(props) {

    const [type, setType] = useState('create');
    const [code, setCode] = useState(null);

    CreateGame.propTypes = {
        joinGame: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    const style = {
        "background-color": "rgb(202, 202, 202)"
    }

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
                {type == 'create' ? <Rules edit={false} /> : join_game}
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    user: state.user.user
});

export default connect(mapStateToProps, { loadGame, joinGame })(CreateGame);