/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, {useState} from 'react'
import './Game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function GameRules(props) {
    const [zone, setZone] = useState(null)

    GameRules.propTypes = {
        editGame: PropTypes.func.isRequired,
        game: PropTypes.object
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
                <button onClick={() => props.edit(true)} className='editButton'>Edit</button>
            </div>              
        </div>
    )
    
}


const mapStateToProps = (state) => ({
    game: state.game.game
})

export default connect(mapStateToProps, {})(GameRules)