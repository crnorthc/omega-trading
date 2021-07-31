/* eslint-disable no-redeclare */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Graph from './Graph'

function Game(props) {
    const [showLine, ShowLine] = useState(0)
    const [screenWidth, setScreenWidth] = useState(0)
    const [left, setLeft] = useState(null)
    const [lines, setLines] = useState(null)
    const [time, setTime] = useState()
    const [timeShift, setShift] = useState()
    const [selected, setSelected] = useState(null)
    const [type, setType] = useState('board')
    const [charts, setCharts] = useState(null)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    Game.propTypes = {
        game: PropTypes.object,
        user: PropTypes.object,
    }

    useEffect(() => {
        if (window.innerWidth % 2 === 1) {
            setScreenWidth(window.innerWidth + 1)
        } else {
            setScreenWidth(window.innerWidth)
        }
    }, [window.innerWidth])

    if (selected == null) {
        var usernames = []
        for (const player in props.game.players) {
            usernames.push(props.game.players[player].username)
        }
        setSelected(usernames)
    }

    const addGraphPoint = () => {
        ShowLine(true)
    }

    const getDots = () => {
        var dots = []
        for (const player in props.game.players) {
            if (props.game.players[player].periods[left].price !== null) {
                const height = props.game.players[player].periods[left].y
                const temp = (
                    <g transform={'translate(' + left + ',' + height + ')'}>
                        <circle cx="0" cy="0" r="5" />
                    </g>
                )
                dots.push(temp)
            }
        }
        return dots
    }

    const removeGraphPoint = () => {
        ShowLine(false)
        setLeft(null)
        setTime()
    }

    const timeString = () => {
        if (time) {
            var stringTime = time.minutes
            if (stringTime.toString().length === 1) {
                stringTime = '0' + stringTime
            }
            stringTime = ':' + stringTime
            if (time.hours > 12) {
                stringTime = time.hours - 12 + stringTime + ' PM'
            } else {
                stringTime = time.hours + stringTime + ' AM'
            }
            stringTime = months[time.month] + ' ' + time.day + ', ' + stringTime
            return stringTime
        }
    }

    const changePlayers = (username) => {
        var temp = []
        if (selected.includes(username)) {
            for (const name in selected) {
                if (selected[name] != username) {
                    temp.push(selected[name])
                }
            }
        } else {
            temp = selected
            temp.push(username)
        }
        setSelected(temp)
    }

    const player_selectors = () => {
        var selectors = []
        for (const player in props.game.players) {
            var username = props.game.players[player].username
            selectors.push(
                <button
                    style={selected.includes(props.game.players[player].username) ? selectedStyle : null}
                    onClick={() => changePlayers(props.game.players[player].username)}
                    className="timePeriod"
                >
                    {username}
                </button>
            )
        }
        return selectors
    }

    const selectedStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid',
    }

    // Action Box
    if (charts === null) {
        var small_charts = []
        for (const property in props.game.charts) {
            var temp = (
                <Link to={'/chart?symbol=' + property} className="stock  f ai-c jc-s">
                    <div className="left-stock">
                        <div className="stock-symbol">{property}</div>
                        <div className="stock-quantity f">{props.game.holdings[property].toFixed(2)} Shares</div>
                    </div>
                    <div className="small-chart">
                        <Graph plain={true} value={null} numbers={props.game.charts[property]} period={'day'} width={64} height={30} />
                    </div>
                    <div className="stock-price">${props.game.charts[property][props.game.charts[property].length - 1].price.toFixed(2)}</div>
                </Link>
            )
            small_charts.push(temp)
        }
        setCharts(small_charts)
    }

    const getLeaderboard = () => {
        var numbers = []
        for (const player in props.game.players) {
            numbers.push({
                username: props.game.players[player].username,
                worth: props.game.players[player].worth,
            })
        }

        numbers.sort((a, b) => parseFloat(b.worth) - parseFloat(a.worth))
        for (const number in numbers) {
            numbers[number] = (
                <div className="friend fr ai-c jc-s">
                    <div style={{ color: props.game.players[numbers[number].username].color }} className="leaderboard">
                        {parseInt(number) + 1}. {numbers[number].username}
                    </div>
                    <div className="leaderboard">
                        $
                        {numbers[number].worth
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </div>
                </div>
            )
        }
        return numbers
    }

    const actionbox = (
        <div className="action-box b">
            <div className="buySell bb fr ai-c jc-c">
                <button className="buy" style={type === 'board' ? selectedStyle : null} onClick={() => setType('board')}>
                    Leaderboard
                </button>
                <button className="sell" style={type === 'stocks' ? selectedStyle : null} onClick={() => setType('stocks')}>
                    Stocks
                </button>
            </div>
            {type === 'stocks' ? (
                Object.keys(charts).length !== 0 ? (
                    charts
                ) : (
                    <div className="noCharts f ai-c jc-c">You do not have stocks to display</div>
                )
            ) : (
                getLeaderboard()
            )}
        </div>
    )

    const followGraphPoint = (e) => {
        var left = e.clientX - (screenWidth - 1070) / 2 - 30
        if (screenWidth <= 1010) {
            left = e.clientX - 30
        }
        if (left <= 676 && props.game.players[props.user.username].periods[left].price !== null) {
            ShowLine(true)
            setLeft(left)
            setTime(props.game.players[props.user.username].periods[left].time)
            setShift(e.clientX)
        } else {
            ShowLine(false)
        }
    }

    if (selected !== null && lines == null) {
        var paths = []
        for (const player in selected) {
            var temp = (
                <path
                    style={
                        selected.includes(props.game.players[selected[player]].username)
                            ? { stroke: props.game.players[selected[player]].color }
                            : { display: 'none' }
                    }
                    className="gamePath"
                    d={props.game.players[selected[player]].path}
                    fill="none"
                />
            )
            paths.push(temp)
        }
        setLines(paths)
    }

    return (
        <div className="pageContainer">
            <div className="Graph">
                <h1 className="symbol-title">Game: {props.game.room_code}</h1>
                {lines == null ? (
                    <div
                        className="loaderContainer f ai-c jc-c"
                        style={{
                            height: '306px',
                            width: '676px',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                        }}
                    >
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div>
                        <div
                            className="graphCont"
                            style={{ width: '676px' }}
                            onMouseMove={(e) => followGraphPoint(e)}
                            onMouseEnter={() => addGraphPoint()}
                            onMouseLeave={() => removeGraphPoint()}
                        >
                            {showLine && left !== null ? (
                                <div>
                                    <div style={{ left: timeShift + 'px', position: 'absolute' }}>
                                        <div className="chartTime">{timeString()}</div>
                                    </div>
                                    <svg width={676} height={250}>
                                        <g className="line">
                                            <line x1={left} x2={left} y1={25} y2={225} />
                                            <line strokeDasharray="1, 5.259259259259259" x1={0} x2={676} y1={125} y2={125} />
                                        </g>
                                        {lines}
                                        {getDots()}
                                    </svg>
                                </div>
                            ) : (
                                <svg width={676} height={250}>
                                    {lines}
                                    <g className="line">
                                        <line strokeDasharray="1, 5.259259259259259" x1={0} x2={676} y1={125} y2={125} />
                                    </g>
                                </svg>
                            )}
                        </div>
                        <div className="timeSelector f ai-c">{player_selectors()}</div>
                    </div>
                )}
            </div>
            {actionbox}
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
})

export default connect(mapStateToProps, {})(Game)
