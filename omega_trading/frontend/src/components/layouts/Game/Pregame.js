import React, { useState } from 'react'
import Friends from '../Friends'
import NewEditRules from './EditRules/NewEditRules'
import GameRules from './GameRules'
import ButtonLoader from '../Tools/ButtonLoader'
import './Game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeType } from '../../../actions/game'

function Pregame(props) {
    const [message, setMessage] = useState('Start Game')
    const [edit, setEdit] = useState(false)

    Pregame.propTypes = {
        changeType: PropTypes.func.isRequired,
        type_changing: PropTypes.bool,
        game: PropTypes.object,
        user: PropTypes.object,
    }

    const handleEdit = (yes) => {
        setEdit(yes)
    }

    return (
        <div className='fc jc-s'>
            <div>
                <div className='fr mmx ai-b jc-s'>
                    <div className="fr ai-c jc-c">
                        <div className='f32 bld'>{props.game.name}:</div>
                        <div className='f32 sml'>{props.game.room_code}</div>
                    </div>
                    <button onClick={() => props.changeType(!props.game.type, props.game)} className='editButton'>{props.type_changing ? <ButtonLoader /> : props.game.type ? 'Public' : 'Private'}</button>
                </div>
                <div className="game_rules mmt b">
                    {edit ? <NewEditRules edit={handleEdit} /> : <GameRules edit={handleEdit} /> }
                </div>
            </div>
            <div className="fc mmy b">
                <div>
                    <Friends friendsOnly={true} />
                </div>
                <div className="startgame-section fc ai-c jc-c">
                    {Object.keys(props.game.players).length == 1 ? (
                        <div className="work fc ai-c jc-c">
                            <button className="editButtonHidden">Start</button>
                            <div className="noAction">There needs to be atleast two players to start a game</div>
                        </div>
                    ) : props.game.host.username == props.user.username ? (
                        <div className="work fc ai-c jc-c">
                            <button className="editButton">
                                Start
                            </button>
                            <div className="noAction">{message}</div>
                        </div>
                    ) : (
                        <div className="work fc ai-c jc-c">
                            <button className="editButtonHidden">Start</button>
                            <div className="noAction">Wait for the host to start the game</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    type_changing: state.game.type_changing,
    game: state.game.game,
    user: state.user.user,
})

export default connect(mapStateToProps, { changeType })(Pregame)
