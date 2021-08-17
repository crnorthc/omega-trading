/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import NewGraph from '../Securities/NewGraph'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function Play(props) {
    const [period, setPeriod] = useState('day')

    Play.propTypes = {
        user: PropTypes.object,
        game: PropTypes.object,
    }

    const dayStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid',
    }

    const graph = () => { 
        return(
            <div className='Graph'>
                {<NewGraph data={props.data} />}
                <div className='timeSelector f ai-c'>
                    <button style={period == 'day' ? dayStyle : null} onClick={() => setPeriod('day')} className='timePeriod'>1D</button>
                    <button style={period == 'week' ? dayStyle : null} onClick={() => setPeriod('week')} className='timePeriod'>1W</button>
                    <button style={period == 'month' ? dayStyle : null} onClick={() => setPeriod('month')} className='timePeriod'>1M</button>
                    <button style={period == '3m' ? dayStyle : null} onClick={() => setPeriod('3m')} className='timePeriod'>3M</button>
                    <button style={period == 'y' ? dayStyle : null} onClick={() => setPeriod('y')} className='timePeriod'>1Y</button>
                    <button style={period == '5y' ? dayStyle : null} onClick={() => setPeriod('5y')} className='timePeriod'>5Y</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {graph()}
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.user,
    game: state.game.game,
})

export default connect(mapStateToProps, { })(Play)
