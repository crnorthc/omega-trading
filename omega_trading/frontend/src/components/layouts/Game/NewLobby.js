import React, { useEffect } from 'react'
import { startGame, loadGame, loadHistory } from '../../../actions/game'
import History from './History'
import CurrentGames from './CurrentGames'
import CreateGame from './CreateGame'
import Loader from '../Tools/Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function Lobby(props) {
    Lobby.propTypes = {
        startGame: PropTypes.func.isRequired,
        loadHistory: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        game_loaded: PropTypes.bool,
        game_loading: PropTypes.bool,
        no_game: PropTypes.bool,
        history_loaded: PropTypes.bool,
        history_loading: PropTypes.bool,
        history: PropTypes.object,
        game: PropTypes.object,
    }

    useEffect(() => {
        if (!props.game_loaded && !props.game_loading) {
            props.loadGame()
        }
        if (!props.history_loaded && !props.history_loading && props.game_loaded) {
            props.loadHistory()
        }
    })

    if ((!props.game_loading && !props.game_loaded) || props.game_loading) {
        return <Loader poage={true} />
    } else {
        return (
            <div>
                <CurrentGames />
                <CreateGame />
                <History />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    game_loaded: state.game.game_loaded,
    game_loading: state.game.game_loading,
    history_loaded: state.game.history_loaded,
    history_loading: state.game.history_loading,
    no_game: state.game.no_game,
    game: state.game.game,
})

export default connect(mapStateToProps, { startGame, loadGame, loadHistory })(Lobby)
