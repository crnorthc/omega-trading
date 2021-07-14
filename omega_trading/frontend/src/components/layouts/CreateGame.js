import React, { useState } from 'react';
import { loadGame, joinGame } from '../../actions/game';
import Rules from './Rules';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function CreateGame(props) {

    const [type, setType] = useState('create');
    const [code, setCode] = useState(null);

    CreateGame.propTypes = {
        joinGame: PropTypes.func.isRequired,
        no_history: PropTypes.bool,
        history: PropTypes.object,
        user: PropTypes.object
    }

    const style = {
        "background-color": "rgb(202, 202, 202)"
    }

    const join_game = (
        <div className="rules">
            <div className="subHeader">
                <h4 className="rules-title">Room Code</h4>
            </div>
            <div className='enter-code'>
                <input className="codeInput" onChange={e => setCode(e.target.value)} placeholder="Enter Code" type="text" />
                <button onClick={(e) => props.joinGame(props.user.username, true, false, code)} className='code-button'>Join</button>
            </div>
        </div>
    )

    const timeString = (time) => {
        var stringTime = time.mins
        if (stringTime === 0) {
            stringTime = stringTime + "0"
        }
        if (stringTime === 5) {
            stringTime = "0" + stringTime
        }
        stringTime = ":" + stringTime
        if (time.hour > 12) {
            stringTime = (time.hour - 12) + stringTime + " PM"
        }
        else {
            stringTime = time.hour + stringTime + " AM"
        }
        var stringDate = time.month + "/" + time.day + "/" + time.year
        return (
            <div>
                <div>{stringDate}</div>
                <div>{stringTime}</div>
            </div>

        )
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
                    <div className='history-bet'>${numbers[number].worth.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                </div>
            )
        }
        return numbers
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
                                    <div>${props.history[game].start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                </div>                                
                                <div className='fr jc-s'>
                                    <div>Bet</div> 
                                    <div>${props.history[game].bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
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

    return (
        <div className='pageContainer'>
            <div className="startup">
                <div className='game-selection fr ai-c'>
                    <button style={type == 'create' ? style : null} onClick={(e) => setType('create')} className='create-game ai-c'>Create a Game</button>
                    <button style={type == 'join' ? style : null} onClick={(e) => setType('join')} className='join-game ai-c'>Join a Game</button>
                </div>
                {type == 'create' ? <Rules edit={false} /> : join_game}
            </div>
            <div className='game-history'>
                <div className='history-title fr ai-c jc-c'>History</div>
                <div className='history-headers fr'>
                    <div className='header fr ai-c jc-c'><h4 className='history-header'>Start Time</h4></div>
                    <div className='header'><h4 className='history-header'>Rules</h4></div>
                    <div className='header'><h4 className='history-header'>Results</h4></div>
                </div>
                {props.no_history ?
                    <div className='no-history'>
                        Check back after you have completed games to see past results!
                    </div>
                    :
                    getHistory()}
            </div>
        </div >
    )
}


const mapStateToProps = (state) => ({
    no_history: state.game.no_history,
    history: state.game.history,
    user: state.user.user
});

export default connect(mapStateToProps, { loadGame, joinGame })(CreateGame);