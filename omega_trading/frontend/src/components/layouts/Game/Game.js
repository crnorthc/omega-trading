/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react'
import queryString from 'query-string'
import Loader from '../Tools/Loader'
import Pregame from './Pregame'
import Preview from './Preview'
import { Redirect } from 'react-router-dom'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadGame } from '../../../actions/game'
import { playGame } from '../../../actions/player'
import Play from './Play'



function Game(props) {

    Game.propTypes = {
        loadGame: PropTypes.func.isRequired,
        playGame: PropTypes.func.isRequired,
        game_loading: PropTypes.bool,
        no_game: PropTypes.bool,
        game: PropTypes.string,
        user: PropTypes.object,
        player: PropTypes.object
    }

    const values = queryString.parse(props.location.search)
    const keys = Object.keys(values)
    if (props.game == null) {
        if (props.no_game) {
            return <Redirect to='/' />
        }
        else {
            if (keys.length != 0) {
                props.loadGame(values.code)
            }
        }
    }
    else {
        if (props.game.code !== values.code) {
            props.loadGame(values.code)
        }
    }

    if (props.game == null || props.game_loading) {
        return <Loader page={true} />
    }
    else {
        if (props.game.active) {
            if (props.player.game !== props.game.room_code) {
                props.playGame(props.game.room_code)
                return <Loader page={true} />
            }
            else {
                return (
                    <Play />
                )  
            }                
        }
        else {
            if (props.user.username in props.game.players) {
                return <Pregame />
            }         
            else {
                return <Preview />
            }   
        }
    }
}


const mapStateToProps = (state) => ({
    game_loading: state.game.game_loading,
    no_game: state.game.no_game,
    game: state.game.game,
    user: state.user.user,
    player: state.player
})

export default connect(mapStateToProps, { loadGame, playGame })(Game)