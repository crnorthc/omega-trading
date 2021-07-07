import React, { useState, useEffect } from 'react';
import { createGame, loadGame, joinGame } from '../../actions/game';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function Rules(props) {

    const [amount, setAmount] = useState('');
    const [positions, setPositions] = useState('');
    const [bet, setBet] = useState('');
    const [days, setDays] = useState('');
    const [hours, setHours] = useState('');
    const [mins, setMins] = useState('');
    const [code, setCode] = useState('');
    const [edit, setEdit] = useState(false);

    Rules.propTypes = {
        createGame: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        user: PropTypes.object,
        game: PropTypes.object
    }

    useEffect(() => {
        if (props.edit) {
            if (code == '') {
                setCode(props.game.room_code)
            }
            if (amount == '') {
                setAmount(props.game.start_amount)
            }
            if (positions == '') {
                setPositions(props.game.positions)
            }
            if (bet == '') {
                setBet(props.game.bet)
            }
            if (days == '') {
                setDays(props.game.duration.days)
            }
            if (hours == '') {
                setHours(props.game.duration.hours)
            }
            if (mins == '') {
                setMins(props.game.duration.mins)
            }
        }
    }, [])


    const minutes = [0, 15, 30, 45]

    const noPositions = {
        "color": "rgb(175, 175, 175)",
        "border-color": "rgb(175, 175, 175)"
    }

    const create_game = () => {
        if (edit && props.edit) {
            setEdit(false)
        }
        if (amount !== '') {
            if (bet !== '') {
                if (days <= 0) {
                    if (hours <= 0) {
                        if (mins <= 0) {
                            alert("Invalid Duration")
                        }
                    }
                }
                props.createGame(amount, bet, positions, days, hours, mins, code)
            }
        }
    }

    const edit_rules = (
        <div className="pregame-rules">
            <div className="friendsHeader">
                <h3>Rules</h3>
            </div>
            <div className='pregameParams'>
                <div className='params'>
                    <div className='start-amount'>
                        <div className='rule'>Start Amount</div>
                        <input className="amountInput-game" onChange={(e) => setAmount(e.target.value)} placeholder={props.edit ? '$' + props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "$0.00"} type="number" min="5000" />
                    </div>
                    <div className='bet'>
                        <div className='rule'>Bet</div>
                        <input className="amountInput-game" onChange={(e) => setBet(e.target.value)} placeholder={props.edit ? '$' + props.game.bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "$0.00"} type="number" min="5000" />
                    </div>
                </div>
                <div className='params'>
                    <div className='positions'>
                        <div style={positions == "" ? noPositions : null} className='rule'>Max Positions</div>
                        <input style={positions == "" ? noPositions : null} className="amountInput-game" onChange={(e) => setPositions(e.target.value)} placeholder={props.edit ? props.game.positions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Unlimited"} type="number" min="5000" />
                    </div>
                    <div className='durations'>
                        <div className='rule'>Duration</div>
                        <div className='durationInputs'>
                            <div className='day-duration'>
                                <input onChange={(e) => setDays(e.target.value)} className='duration-input' placeholder={props.edit ? props.game.duration.days : "0"} type='number' />
                                <div className='duration'>Days</div>
                            </div>
                            <div className='hour-duration'>
                                <input onChange={(e) => setHours(e.target.value)} className='duration-input' placeholder={props.edit ? props.game.duration.hours : "0"} type='number' />
                                <div className='duration'>Hours</div>
                            </div>
                            <div className='min-duration'>
                                <select className='min-input' placeholder={props.edit ? props.game.duration.mins : "0"} onChange={(e) => setMins(e.target.value)}>
                                    {
                                        minutes.map(min => {
                                            return <option className='min-option' value={min}>{min}</option>
                                        })
                                    }
                                </select>
                                <div className='duration'>Mins</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='enter-params-pregame'>
                <button onClick={(e) => setEdit(false)} className='editButton'>Cancel</button>
                <button onClick={(e) => create_game()} className='editButton'>Save Changes</button>
            </div>
        </div>
    )

    const plain_rules = (
        <div className="pregame-rules">
            <div className="friendsHeader">
                <h3>Rules</h3>
            </div>
            <div className='pregameParams'>
                <div className='params'>
                    <div className='pregame-start-amount'>
                        <div className='pregame-rule'>Start Amount</div>
                        <div className='pregame-amount'>${props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                    <div className='pregame-bet'>
                        <div className='pregame-rule'>Bet</div>
                        <div className='pregame-bet'>${props.game.bet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                </div>
                <div className='params'>
                    <div className='pregame-positions'>
                        <div className='pregame-rule'>Max Positions</div>
                        <div className='pregame-position'>{props.game.positions == 0 ? "Unlimited" : props.game.positions}</div>
                    </div>
                    <div className='durations'>
                        <div className='pregame-rule'>Duration</div>
                        <div className='durationInputs'>
                            <div className='day-duration-game'>
                                <div className='game-days'>{props.game.duration.days}</div>
                                <div className='pregame-duration'>{props.game.duration.days == 1 ? 'day' : 'days'}</div>
                            </div>
                            <div className='hour-duration-game'>
                                <div className='game-hours'>{props.game.duration.hours}</div>
                                <div className='pregame-duration'>{props.game.duration.hours == 1 ? 'hour' : 'hours'}</div>
                            </div>
                            <div className='min-duration-game'>
                                <div className='game-mins'>{props.game.duration.mins}</div>
                                <div className='pregame-duration'>mins</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {props.user.username == props.game.host.username ?
                <div className='edit-rules'>
                    <button onClick={(e) => setEdit(true)} className='editButton'>Edit</button>
                </div>
                : null
            }
        </div>
    )

    return (
        <div>
            {
                props.edit ?
                    edit ? edit_rules
                        : plain_rules
                    :
                    <div className="rules">
                        <div className="subHeader">
                            <h4 className="rules-title">Rules</h4>
                        </div>
                        <div className='pregameParams'>
                            <div className='params'>
                                <div className='start-amount'>
                                    <div className='rule'>Start Amount</div>
                                    <input className="amountInput-game" onChange={(e) => setAmount(e.target.value)} placeholder="$0.00" type="number" min="5000" />
                                </div>
                                <div className='bet'>
                                    <div className='rule'>Bet</div>
                                    <input className="amountInput-game" onChange={(e) => setBet(e.target.value)} placeholder="$0.00" type="number" min="5000" />
                                </div>
                            </div>
                            <div className='params'>
                                <div className='positions'>
                                    <div style={positions == "" ? noPositions : null} className='rule'>Max Positions</div>
                                    <input style={positions == "" ? noPositions : null} className="amountInput-game" onChange={(e) => setPositions(e.target.value)} placeholder="Unlimited" type="number" min="5000" />
                                </div>
                                <div className='durations'>
                                    <div className='rule'>Duration</div>
                                    <div className='durationInputs'>
                                        <div className='day-duration'>
                                            <input onChange={(e) => setDays(e.target.value)} className='duration-input' placeholder="0" type='number' />
                                            <div className='duration'>Days</div>
                                        </div>
                                        <div className='hour-duration'>
                                            <input onChange={(e) => setHours(e.target.value)} className='duration-input' placeholder="0" type='number' />
                                            <div className='duration'>Hours</div>
                                        </div>
                                        <div className='min-duration'>
                                            <select className='min-input' placeholder="0" onChange={(e) => setMins(e.target.value)}>
                                                {
                                                    minutes.map(min => {
                                                        return <option className='min-option' value={min}>{min}</option>
                                                    })
                                                }
                                            </select>
                                            <div className='duration'>Mins</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='enter-params'>
                            <button onClick={(e) => create_game()} className='to-invites'>Invite Players</button>
                        </div>
                    </div>
            }
        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    game: state.game.game
});

export default connect(mapStateToProps, { createGame, loadGame, joinGame })(Rules);