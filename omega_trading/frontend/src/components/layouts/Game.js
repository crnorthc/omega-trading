import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Graph from './Graph';

function Game(props) {
    const [metrics, setMetrics] = useState(null)
    const [showLine, ShowLine] = useState(0)
    const [screenWidth, setScreenWidth] = useState(0)
    const [left, setLeft] = useState(null)
    const [point, setPoint] = useState(null)
    const [lines, setLines] = useState(null)
    const [time, setTime] = useState()
    const [timeShift, setShift] = useState()
    const [selected, setSelected] = useState([])
    const [type, setType] = useState('board')
    const [charts, setCharts] = useState(null)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    Game.propTypes = {
        game: PropTypes.object,
        user: PropTypes.object
    }

    useEffect(() => {
        if (window.innerWidth % 2 === 1) {
            setScreenWidth(window.innerWidth + 1)
        }
        else {
            setScreenWidth(window.innerWidth)
        }
    }, [window.innerWidth])

    const getY = (price) => {
        if (metrics.min === metrics.max) {
            return 250 - 25
        }
        else {
            return 250 - (((price - metrics.min) / (metrics.max - metrics.min)) * 200 + 25);
        }
    }

    const getLine = (numbers) => {
        var distance = 676 / metrics.maxPoints
        var y = getY(numbers[0].price)
        var x = 0
        var line = "M " + x.toString() + " " + y.toString()
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i].price !== null) {
                y = getY(numbers[i].price)
                x = i * distance
                line = line + " L " + x.toString() + " " + y.toString()
            }
        }
        return line
    }

    const getLines = (players) => {
        var lines = []
        for (const player in players) {
            var line = getLine(props.game.players[players[player]].numbers)
            var temp = (
                <path style={players.includes(props.game.players[players[player]].username) ? { 'stroke': props.game.players[selected[player]].color } : { 'display': 'none' }} className="gamePath" d={line} fill="none" />
            )
            lines.push(temp)
        }
        setLines(lines)
    }

    if (metrics != null && lines == null) {
        getLines(selected)
    }
    if (metrics == null) {
        var tempMin = props.game.players[props.user.username].numbers[0].price
        var tempMax = 0
        var max_points = 0
        var usernames = []
        for (const player in props.game.players) {
            usernames.push(props.game.players[player].username)
            if (props.game.players[player].numbers.length > max_points) {
                max_points = props.game.players[player].numbers.length
            }
            props.game.players[player].numbers.forEach(function (item) {
                if (item.price > tempMax) {
                    tempMax = item.price
                }
                if (item.price !== null && item.price < tempMin) {
                    tempMin = item.price
                }
            })
        }
        setSelected(usernames)
        setMetrics({
            min: tempMin,
            max: tempMax,
            maxPoints: max_points
        })
    }


    const addGraphPoint = () => {
        ShowLine(true)
    }

    const getDots = () => {
        var dots = []
        for (const player in props.game.players) {
            const height = getY(props.game.players[player].numbers[point].price)
            const temp = (
                <g transform={"translate(" + left + "," + height + ")"}>
                    <circle cx="0" cy="0" r="5" />
                </g>
            )
            dots.push(temp)
        }
        return dots
    }


    const followGraphPoint = (e) => {
        var left = e.clientX - ((screenWidth - 1070) / 2) - 30
        if (screenWidth <= 1010) {
            left = e.clientX - 30
        }
        if (Math.round(left % (676 / metrics.maxPoints)) == 0 && left <= 676) {
            var tempPoint = Math.round(left / (676 / metrics.maxPoints))
            if (props.game.players[props.user.username].numbers[tempPoint].price != null) {
                setPoint(tempPoint)
                setLeft(left)
                setTime(props.game.players[props.user.username].numbers[point].time)
                setShift(e.clientX)
            }
        }
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
                stringTime = "0" + stringTime
            }
            stringTime = ":" + stringTime
            if (time.hours > 12) {
                stringTime = (time.hours - 12) + stringTime + " PM"
            }
            else {
                stringTime = time.hours + stringTime + " AM"
            }
            stringTime = months[time.month] + " " + time.day + ", " + stringTime
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
        }
        else {
            temp = selected
            temp.push(username)
        }
        getLines(temp)
        setSelected(temp)
    }

    const player_selectors = () => {
        var selectors = []
        for (const player in props.game.players) {
            var username = props.game.players[player].username
            selectors.push(
                <button style={selected.includes(props.game.players[player].username) ? selectedStyle : null} onClick={(e) => changePlayers(props.game.players[player].username)} className="timePeriod">{username}</button>
            )
        }
        return selectors
    }

    const selectedStyle = {
        "border-bottom": "rgb(66, 66, 66) 2px solid"
    }

    // Action Box
    if (charts === null) {
        var small_charts = []
        for (const property in props.game.charts) {
            var temp = (
                <Link to={'/chart?symbol=' + property} className='stock'>
                    <div className='left-stock'>
                        <div className='stock-symbol'>{property}</div>
                        <div className='stock-quantity'>{props.game.holdings[property].toFixed(2)} Shares</div>
                    </div>
                    <div className="small-chart">
                        <Graph plain={true} value={null} numbers={props.game.charts[property]} period={'day'} width={64} height={30} />
                    </div>
                    <div className="stock-price">
                        ${props.game.charts[property][props.game.charts[property].length - 1].price.toFixed(2)}
                    </div>
                </Link>
            )
            small_charts.push(temp)
        }
        setCharts(small_charts)
    }

    const getLeaderboard = () => {
        var numbers = []
        var temp = []
        for (const player in props.game.players) {
            numbers.push({
                username: props.game.players[player].username,
                amount: props.game.players[player].amount
            })
        }

        numbers.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        for (const number in numbers) {
            numbers[number] = (
                <div className='friend'>
                    <div style={{ 'color': props.game.players[numbers[number].username].color }} className="leaderboard">{parseInt(number) + 1}. {numbers[number].username}</div>
                    <div className="leaderboard">${numbers[number].amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                </div>
            )
        }
        return numbers
    }

    const actionbox = (
        <div className="action-box">
            <div className="buySell">
                <button className="buy" style={type === 'board' ? selectedStyle : null} onClick={e => setType('board')}>Leaderboard</button>
                <button className="sell" style={type === 'stocks' ? selectedStyle : null} onClick={e => setType('stocks')}>Stocks</button>
            </div>
            {type === 'stocks' ?
                Object.keys(charts).length !== 0 ? charts :
                    <div className="noCharts">
                        You do not have stocks to display
                    </div>
                :
                getLeaderboard()
            }
        </div>
    )

    return (
        <div className='pageContainer'>
            <div className='Graph'>
                <h1 className="symbol-title">Game: {props.game.room_code}</h1>
                {metrics == null ?
                    <div className="loaderContainer" style={
                        {
                            "height": "306px",
                            "width": '676px',
                            "display": "flex",
                            "align-items": "center",
                            "justify-content": "center"
                        }
                    }>
                        <div class="loader"></div>
                    </div>
                    :
                    <div>
                        <div className="graphCont"
                            style={{ width: '676px' }}
                            onMouseMove={(e) => followGraphPoint(e)}
                            onMouseEnter={(e) => addGraphPoint()}
                            onMouseLeave={(e) => removeGraphPoint()}
                        >
                            <div style={
                                {
                                    left: timeShift + "px",
                                    position: "absolute"
                                }
                            }>
                                <div className="chartTime">{timeString()}</div>
                            </div>
                            {showLine && (left !== null || point !== null) ?
                                <svg width={676} height={250}>
                                    <g className="line">
                                        <line x1={left} x2={left} y1={25} y2={225} />
                                    </g>
                                    {lines}
                                    {getDots()}
                                </svg>
                                :
                                <svg width={676} height={250}>
                                    {lines}
                                </svg>
                            }
                        </div>
                    </div>
                }
                <div className="timeSelector">
                    {player_selectors()}
                </div>
            </div>
            {actionbox}
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user
});

export default connect(mapStateToProps, {})(Game);