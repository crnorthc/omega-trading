import React, { useState } from 'react';
import { startGame, loadGame } from '../../actions/game';
import Friends from './Friends';
import Rules from './Rules';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function Pregame(props) {

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
                        <h2>Tournament:</h2>
                        <h3 className='room-code'>{props.game.room_code}</h3>
                    </div>
                    <div className='pregame-title'>
                        <h2>Host:</h2>
                        <h3 className='host'>@{props.game.host.username}</h3>
                    </div>
                </div>
                <Rules edit={true} />
                <div className='players'>
                    <Friends friendsOnly={true} />
                </div>
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user
});

export default connect(mapStateToProps, {})(Pregame);