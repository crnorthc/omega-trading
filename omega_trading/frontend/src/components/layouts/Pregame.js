import React, { useState } from 'react';
import { startGame } from '../../actions/game';
import Friends from './Friends';
import Rules from './Rules';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function Pregame(props) {

    const [message, setMessage] = useState('Start Game')

    Pregame.propTypes = {
        startGame: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object
    }

    return (
        <div className='pageContainer'>
            <div className="startup">
                <div className='pregame-header'>
                    <div className='pregame-title'>
                        <h2>Game</h2>
                        <h3 className='room-code'>#{props.game.room_code}</h3>
                    </div>
                    <div className='pregame-title'>
                        <h2>Host</h2>
                        <h3 className='host'>@{props.game.host.username}</h3>
                    </div>
                </div>
                <Rules edit={true} />
                <div className='players'>
                    <Friends friendsOnly={true} />
                </div>
                <div className="startgame-section">
                    {Object.keys(props.game.players).length == 1 ?
                        <div className='work'>
                            <button className='editButtonHidden'>Start</button>
                            <div className='noAction'>There needs to be atleast two players to start a game</div>
                        </div>
                        : props.game.host.username == props.user.username ?
                            <div className='work'>
                                <button onClick={(e) => props.startGame()} className='editButton'>Start</button>
                                <div className="noAction">{message}</div>
                            </div>
                            :
                            <div className='work'>
                                <button className='editButtonHidden'>Start</button>
                                <div className="noAction">Wait for the host to start the game</div>
                            </div>
                    }
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user
});

export default connect(mapStateToProps, { startGame })(Pregame);