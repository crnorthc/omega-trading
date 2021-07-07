import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { startGame, loadGame } from '../../actions/game';
import CreateGame from './CreateGame';
import Pregame from './Pregame';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function Lobby(props) {

    if (props.isAuthenticated) {
        if (props.user === null) {
            props.loadUser()
        }
    }
    else {
        return <Redirect to='/login' />
    }

    Lobby.propTypes = {
        startGame: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        game_loaded: PropTypes.bool,
        game_loading: PropTypes.bool,
        no_game: PropTypes.bool
    }

    useEffect(() => {
        if (!props.game_loaded && !props.game_loading) {
            props.loadGame()
        }
    })


    if ((!props.game_loading && !props.game_loaded) || props.game_loading) {
        return (
            <div className="pageContainer">
                <div className='loaderContainer'>
                    <div className='loader' />
                </div>
            </div>
        )
    }
    else {
        if (props.no_game) {
            return <CreateGame />
        }
        else {
            return <Pregame />
        }
    }
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    game_loaded: state.game.game_loaded,
    game_loading: state.game.game_loading,
    no_game: state.game.no_game
});

export default connect(mapStateToProps, { startGame, loadGame })(Lobby);