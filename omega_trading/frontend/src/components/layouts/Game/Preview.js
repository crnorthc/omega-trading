import React, { useState } from 'react'
import Friends from '../Friends'
import ButtonLoader from '../Tools/ButtonLoader'
import './Game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeType } from '../../../actions/game'

function Pregame(props) {
    const [zone, setZone] = useState(null)

    Pregame.propTypes = {
        changeType: PropTypes.func.isRequired,
        type_changing: PropTypes.bool,
        game: PropTypes.object,
        user: PropTypes.object
    }

    if (zone == null) {
        var timezone = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]
        setZone(timezone)
    }

    const formatDate = (date) => {
        var month = date.month.toString()
        if (month.length == 1) {
            month = '0' + date.month
        }

        var day = date.day.toString()
        if (day.length == 1) {
            day = '0' + date.day
        }

        var min = date.minute
        if (min == 0) {
            min = '00'
        }

        return date.hour + ':' + min + ' ' + date.type + ' ' + month + '/' + day + '/' + date.year
    
    }

    const formatDuration = (duration) => {
        var day = ' days '
        if (duration.days == 1) {
            day = ' day '
        }

        var hour = ' hours '
        if (duration.hours == 1) {
            hour = ' hour '
        }

        return duration.days + day + duration.hours + hour + duration.mins + ' mins' 
    }

    return (
        <div className='fc jc-s'>
            <div>
                <div className='fr mmx ai-b jc-s'>
                    <div className="fr ai-c jc-c">
                        <div className='f32 bld'>{props.game.name}:</div>
                        <div className='f32 sml'>{props.game.room_code}</div>
                    </div>
                    <button className='editButtonDisabled'>{props.game.type ? 'Public' : 'Private'}</button>
                </div>
                <div className="game_rules mmt b">
                    <div className="game_rules fc jc-s">
                        <div className='rules-row'>
                            <div className='fc jc-c ai-s'>
                                <div className='f22 bld'>Start Amount</div>
                                <div className='f22'>${props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            </div>
                            <div className='fc jc-c ai-e'>      
                                <div className='f22 bld'>End Date: {zone}</div>
                                <div className='f22'>
                                    {props.game.duration == undefined ? formatDate(props.game.time) : formatDuration(props.game.duration)}
                                </div>                                        
                            </div>               
                        </div>
                        <div className='rules-row'>
                            <div className='fc jc-c ai-s'>
                                <div className='f22 bld'>Commision</div>
                                <div className='f22'>{props.game.commission == null ? 'Disabled' : '$' + props.game.commission}</div>
                            </div>
                            <div className='fc jc-c ai-e'>
                                <div className='f22 bld'>Options</div>
                                <div className='f22'>{props.game.options ? 'Enabled' : 'Disabled'}</div>
                            </div>
                        </div>
                        <div className='fr jc-c mmy'>
                            <button onClick={() => props.edit(true)} className='editButton'>Join</button>
                        </div>              
                    </div>
                </div>
            </div>
            <div className="fc mmy b">
                <div>
                    <Friends friendsOnly={true} />
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
