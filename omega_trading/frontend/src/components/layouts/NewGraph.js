/* eslint-disable react/prop-types */
/* eslint-disable no-redeclare */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function NewGraph(props) {
    const [showLine, ShowLine] = useState(0)
    const [screenWidth, setScreenWidth] = useState(0)
    const [left, setLeft] = useState(null)
    const [price, setPrice] = useState(props.portfolio[props.period].periods.slice(-1)[0].price)
    const [time, setTime] = useState()
    const [timeShift, setShift] = useState()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    NewGraph.propTypes = {
        portfolio: PropTypes.object
    }

    useEffect(() => {
        if (window.innerWidth % 2 === 1) {
            setScreenWidth(window.innerWidth + 1)
        } else {
            setScreenWidth(window.innerWidth)
        }
    }, [window.innerWidth])

    const addGraphPoint = () => {
        ShowLine(true)
    }

    const getDot = () => {
        if (props.portfolio[props.period].periods[left].price !== null) {
            const height = props.portfolio[props.period].periods[left].y
            return (
                <g transform={'translate(' + left + ',' + height + ')'}>
                    <circle cx="0" cy="0" r="5" />
                </g>
            )
        }
    }

    const removeGraphPoint = () => {
        ShowLine(false)
        setLeft(null)
        setTime()
        setPrice(props.portfolio[props.period].periods.slice(-1)[0].price)
    }

    const timeString = () => {
        if (time) {
            console.log(time)
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
            if (props.period !== 'day') {
                stringTime = months[time.month] + ' ' + time.day + ', ' + stringTime
            }
            return stringTime
        }
    }

    const followGraphPoint = (e) => {
        var left = e.clientX - (screenWidth - 1070) / 2 - 30
        if (screenWidth <= 1010) {
            left = e.clientX - 30
        }
        if (left <= 676 && props.portfolio[props.period].periods[left].price !== null) {
            ShowLine(true)
            setLeft(left)
            setTime(props.portfolio[props.period].periods[left].time)
            setPrice(props.portfolio[props.period].periods[left].price)
            setShift(e.clientX)
        } else {
            ShowLine(false)
        }
    }

    return (
        <div
            className="graphCont"
            style={{ width: '676px' }}
            onMouseMove={(e) => followGraphPoint(e)}
            onMouseEnter={() => addGraphPoint()}
            onMouseLeave={() => removeGraphPoint()}
        >
            <h1>${price.toFixed(2)}</h1>
            {showLine && left !== null ? (
                <div>
                    <div style={{ left: timeShift + 'px', position: 'absolute' }}>
                        <div className="chartTime">{timeString()}</div>
                    </div>
                    <svg width={676} height={250}>
                        <g className="line">
                            <line x1={left} x2={left} y1={25} y2={225} />
                            <path d={props.portfolio[props.period].path} fill="none"/>
                        </g>
                        {getDot()}
                    </svg>
                </div>
            ) : (
                <svg width={676} height={250}>
                    <g className="line">
                        <path d={props.portfolio[props.period].path} fill="none"/>
                    </g>
                </svg>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    portfolio: state.portfolio
})

export default connect(mapStateToProps, {})(NewGraph)
