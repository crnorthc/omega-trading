import React from 'react'
import { currentGames } from '../../../actions/game'
import Loader from '../Tools/Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function CurrentGame(props) {

    CurrentGame.propTypes = {
        currentGames: PropTypes.func.isRequired,
        games: PropTypes.object,
    }

    if (props.games == null) {
        props.currentGames()
    }

    const getGames = () => {
        var games = []

        for (const game in props.games) {
            games.push(
                <div className='fr ai-c jc-s'>
                    <div className='spl'>{props.games[game].name}</div>
                    <div className='spr'>{props.games[game].room_code}</div>
                </div>
            )
        }
        return games
    }

    if (props.games) {
        return <Loader page={false} />
    } else {
        return (
            <div className='b smx'>
                <div className='h63 fr bb ai-c jc-c st'>Current Games</div>
                {props.games == false? getGames() :
                    (
                        <div className='no-history'>You do not have any active games.</div>
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    games: state.game.game,
})

export default connect(mapStateToProps, { currentGames })(CurrentGame)
