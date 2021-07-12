import React, { useState } from 'react';
import { createGame, loadGame, joinGame } from '../../actions/game';
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
        var stringTime = time.minutes
        if (stringTime === 0) {
            stringTime = stringTime + "0"
        }
        if (stringTime === 5) {
            stringTime = "0" + stringTime
        }
        stringTime = ":" + stringTime
        if (time.hours > 12) {
            stringTime = (time.hours - 12) + stringTime + " PM"
        }
        else {
            stringTime = time.hours + stringTime + " AM"
        }
        if (props.period !== "day") {
            stringTime = months[time.month] + " " + time.day + ", " + stringTime
            if (props.period !== "week" && props.period !== "month") {
                stringTime = months[time.month] + " " + time.day + ", " + time.year
            }
        }
        return stringTime
    }

    const getLeaderboard = (game) => {
        var numbers = []
        for (const player in game.players) {
            numbers.push({
                username: game.players[player].username,
                worth: game.players[player].worth
            })
        }
        numbers.sort((a, b) => parseFloat(a.worth) - parseFloat(b.worth))
        for (const number in numbers) {
            numbers[number] = (
                <div className='history-player'>
                    <div style={{ 'color': game.players[numbers[number].username].color }} className="history-leaderboard">{parseInt(number) + 1}. {numbers[number].username}</div>
                    <div className="history-leaderboard">${numbers[number].worth.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                </div>
            )
        }
        return numbers
    }

    const getHistory = () => {
        var temp = []
        for (const game in props.history) {
            temp.push(
                <div className='history-game'>
                    <div className='left-history'>
                        <div className='history-time'>{timeString(props.history[game].start_time) - timeString(props.history[game].end_time)}</div>
                        <div className='history-amount'>Start Amount: ${props.history[game].start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                        <div className='history-bet'>Bet: ${props.history[game].start_bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                    <div className='right-history'>
                        {getLeaderboard(props.history[game])}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className='pageContainer'>
            <div className="startup">
                <div className='game-selection'>
                    <button style={type == 'create' ? style : null} onClick={(e) => setType('create')} className='create-game'>Create a Game</button>
                    <button style={type == 'join' ? style : null} onClick={(e) => setType('join')} className='join-game'>Join a Game</button>
                </div>
                {type == 'create' ? <Rules edit={false} /> : join_game}
            </div>
            <div className='game-history'>
                <h1 className='history-title'>History</h1>
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