/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react'
import queryString from 'query-string'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadGame } from '../../../actions/game'
import Loader from '../Tools/Loader'
import Pregame from './Pregame'
import Preview from './Preview'



function Game(props) {

    Game.propTypes = {
        loadGame: PropTypes.func.isRequired,
        selecting_game: PropTypes.bool,
        game: PropTypes.string,
        user: PropTypes.object
    }

    const values = queryString.parse(props.location.search)
    const keys = Object.keys(values)
    if (props.game == null) {
        if (keys.length != 0) {
            props.loadGame(values.room_code)
        }
    }
    else {
        if (props.game.room_code !== values.room_code) {
            props.loadGame(values.room_code)
        }
    }

    if (props.game == null || props.selecting_game) {
        return <Loader page={true} />
    }
    else {
        if (props.game.active) {
            return (
                <div className='title'>Need To create this page</div>
            )
        }
        else {
            if (props.user.username in props.game.players) {
                console.log('here1')
                return <Pregame />
            }         
            else {
                console.log('here2')
                return <Preview />
            }   
        }
    }
}


const mapStateToProps = (state) => ({
    selecting_game: state.game.selecting_game,
    game: state.game.game,
    user: state.user.user
})

export default connect(mapStateToProps, { loadGame })(Game)