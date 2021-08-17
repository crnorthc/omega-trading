import React, { useState } from 'react'
import './Game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { joinGame } from '../../../actions/game'
import Players from './Players'
import GameRules from './GameRules'

function Preview(props) {

    Preview.propTypes = {
        joinGame: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object
    }

    return (
        <div className='fc lmt jc-s'>
            <div>
                <div className='fr mmx ai-b jc-s'>
                    <div className="fr ai-c jc-c">
                        <div className='f32 bld'>{props.game.name}:</div>
                        <div className='f32 sml'>{props.game.room_code}</div>
                    </div>
                    <button onClick={() => props.joinGame(props.game.room_code)} className='editButton'>Join</button>
                </div>
                <div className="rules_container fr jc-c ai-c mmt b">
                    <GameRules />
                </div>
            </div>
            <div className="fc mmy b">
                <div>
                    <Players />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
})

export default connect(mapStateToProps, { joinGame })(Preview)
