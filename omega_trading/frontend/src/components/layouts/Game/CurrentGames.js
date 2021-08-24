/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import React from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import GameItem from './GameItem'

function CurrentGames(props) {
    CurrentGames.propTypes = {
        games: PropTypes.array,
    }

    const getGames = () => {
        var games = []

        for (const game in props.games) {
            games.push(
                <GameItem game={props.games[game]} key={props.games[game].code} index={game} />
            )
        }

        return (
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
               {games}
            </div>
        )
    }

    return (
        <div className="results">
            {props.games != 'empty' ? getGames() : <div className="no-history">No Games Found</div>}
        </div>
    )
    
}

const mapStateToProps = (state) => ({
    games: state.game.games,
})

export default connect(mapStateToProps, {  })(CurrentGames)
