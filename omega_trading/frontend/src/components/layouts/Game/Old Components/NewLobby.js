import React from 'react'
import { currentGames } from '../../../../actions/game'
import Loader from '../../Tools/Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

function Lobby(props) {
    Lobby.propTypes = {
        currentGames: PropTypes.func.isRequired,
        games: PropTypes.object,
    }


    if (props.games == null) {
        props.currentGames()
    }

    if (props.games) {
        return <Loader poage={true} />
    } else {
        if (props.games == false) {
            return <Redirect to='/games' />
        }
        else {
            return <Redirect to='/join' />
        }
    }
}

const mapStateToProps = (state) => ({
    games: state.game.games,
})

export default connect(mapStateToProps, { currentGames })(Lobby)
