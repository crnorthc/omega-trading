import React, { useRef, useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Game(props) {
    const [metrics, setMetrics] = useState(null)
    const [graph, setGraph] = useState(null)
    const [showLine, ShowLine] = useState(0)
    const [screenWidth, setScreenWidth] = useState(0)
    const [left, setLeft] = useState(null)
    const [point, setPoint] = useState(null)
    const [time, setTime] = useState()
    const [timeShift, setShift] = useState()
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

    if (metrics == null) {
        var tempMin = props.game.players[props.user.username].numbers[0].price
        var tempMax = 0
        var max_points = 0
        for (const player in props.game.players) {
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
        setMetrics({
            min: tempMin,
            max: tempMax,
            maxPoints: max_points
        })
    }

    const getLine = (numbers) => {
        var distance = 676 / metrics.maxPoints
        var y = getY(numbers[0])
        var x = 0
        var line = "M" + x.toString() + "," + y.toString()
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i].price !== null) {
                y = getY(numbers[i])
                x = i * distance
                line = line + ",L" + x.toString() + "," + y.toString()
            }
        }
        return line + 'Z'
    }

    if (graph == null && metrics !== null) {
        var lines = []
        for (const player in props.game.players) {
            var line = getLine(props.game.players[player].numbers)
            var temp = (
                <path style={{ 'stroke': props.game.players[player].color }} className="gamePath" d={line} fill="none" />
            )
            lines.push(temp)
        }
        setGraph(lines)
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
            else {
                removeGraphPoint()
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

    const gameGraph = (
        <div>
            {graph == null ?
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
                            {graph}
                            {getDots()}
                        </svg>
                        :
                        <svg width={676} height={250}>
                            {graph}
                        </svg>
                    }
                </div>
            }
        </div>
    )

    const changePlayers = (username) => {

    }

    const player_selectors = () => {
        var selectors = []
        for (const player in props.game.players) {

        }
    }

    return (
        <div className='pageContainer'>
            {gameGraph}
            <div className="timeSelector">
                <button style={period == "day" ? dayStyle : null} onClick={(e) => changePeriod("day")} className="timePeriod">1D</button>
                <button style={period == "week" ? dayStyle : null} onClick={(e) => changePeriod("week")} className="timePeriod">1W</button>
                <button style={period == "month" ? dayStyle : null} onClick={(e) => changePeriod("month")} className="timePeriod">1M</button>
                <button style={period == "3m" ? dayStyle : null} onClick={(e) => changePeriod("3m")} className="timePeriod">3M</button>
                <button style={period == "y" ? dayStyle : null} onClick={(e) => changePeriod("y")} className="timePeriod">1Y</button>
                <button style={period == "5y" ? dayStyle : null} onClick={(e) => changePeriod("5y")} className="timePeriod">5Y</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user
});

export default connect(mapStateToProps, {})(Game);