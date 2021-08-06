import React from 'react'
import { loadHistory } from '../../actions/game'
import Loader from './Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function History(props) {
    History.propTypes = {
        loadHistory: PropTypes.func.isRequired,
        history_loading: PropTypes.bool,
        history: PropTypes.object,
        no_history: PropTypes.bool
    }

    if (props.history == null && !props.history_loading && !props.no_history) {
        props.loadHistory()
    }

    const timeString = (time) => {
        var stringTime = time.mins
        if (stringTime === 0) {
            stringTime = stringTime + '0'
        }
        if (stringTime === 5) {
            stringTime = '0' + stringTime
        }
        stringTime = ':' + stringTime
        if (time.hour > 12) {
            stringTime = (time.hour - 12) + stringTime + ' PM'
        }
        else {
            stringTime = time.hour + stringTime + ' AM'
        }
        var stringDate = time.month + '/' + time.day + '/' + time.year
        return (
            <div>
                <div>{stringDate}</div>
                <div>{stringTime}</div>
            </div>

        )
    }

    const getDuration = (duration) => {
        var dur = ''
        console.log(duration)
        if (duration.mins != null && duration.mins != 0) {
            dur = duration.mins + ' mins'
        }
        if (duration.hours != null && duration.hours != 0) {
            var hours = duration.hours
            if (duration.hours == 1) {
                dur = hours + ' hour ' + dur
            }
            else {
                dur = hours + ' hours ' + dur
            }
        }
        if (duration.days != null && duration.days != 0) {
            var days = duration.days
            if (duration.days == 1) {
                dur = days + ' day ' + dur
            }
            else {
                dur = days + ' days ' + dur
            }
        }
        return dur
    }

    const getLeaderboard = (game) => {
        var numbers = []
        for (const player in game.players) {
            numbers.push({
                username: game.players[player].username,
                worth: game.players[player].worth
            })
        }
        numbers.sort((a, b) => parseFloat(b.worth) - parseFloat(a.worth))
        for (const number in numbers) {
            numbers[number] = (
                <div className='history-player fr jc-s'>
                    <div style={{ 'color': game.players[numbers[number].username].color }}>{parseInt(number) + 1}. {numbers[number].username}</div>
                    <div className='history-bet'>${numbers[number].worth.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>
            )
        }
        return numbers
    }

    const getHistory = () => {
        var temp = []
        for (const game in props.history) {
            temp.push(
                <div className='history-game fr ai-c'>
                    <div className='history-date fc ai-c jc-c'>
                        {timeString(props.history[game].start_time)}
                    </div>
                    <div className='history-rules fc ai-c jc-c'>
                        <div className='history-rules-cont fc'>
                            <div className='fr jc-s'>
                                <div>Duration</div>
                                <div>{getDuration(props.history[game].duration)}</div>
                            </div>
                            <div className='fr jc-s'>
                                <div>Start Amount</div>
                                <div>${props.history[game].start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            </div>                                
                            <div className='fr jc-s'>
                                <div>Bet</div> 
                                <div>${props.history[game].bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            </div>                                
                            <div className='fr jc-s'>
                                <div>Positions</div> 
                                <div>{props.history[game].positions == 0 ? 'Unlimited' : props.history[game].positions}</div>
                            </div>                                
                        </div>
                    </div>
                    <div className='history-results fc ai-c jc-c'>                        
                        {getLeaderboard(props.history[game])}
                    </div>
                </div>
            )
        }
        return temp
    }

    if (props.history == null && props.history_loading) {
        return <Loader page={false} />
    } else {
        return (
            <div className='game-history b'>
                <div className='h63 st bb fr ai-c jc-c'>History</div>
                <div className='history-headers fr'>
                    <div className='header fr ai-c jc-c'><h4 className='history-header bb'>Start Time</h4></div>
                    <div className='header fr ai-c jc-c'><h4 className='history-header bb'>Rules</h4></div>
                    <div className='header fr ai-c jc-c'><h4 className='history-header bb'>Results</h4></div>
                </div>
                {props.no_history ?
                    <div className='no-history'>
                        Check back after you have completed games to see past results!
                    </div>
                    :
                    getHistory()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    history_loaded: state.game.history_loaded,
    history_loading: state.game.history_loading,
    no_history: state.game.no_history
})

export default connect(mapStateToProps, { loadHistory })(History)
