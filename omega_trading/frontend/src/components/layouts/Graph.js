import React, { useRef, useEffect, useState } from 'react'
import { loadSecurity, updateSymbol } from '../../actions/securities.js';
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Graph(props) {
    const [numbers, setNumbers] = useState(null)
    const [min, setMin] = useState(null)
    const [max, setMax] = useState(0)
    const [height, setHeight] = useState(250)
    const [width, setWidth] = useState(props.width)
    const [dimensions, setDimensions] = useState(null)
    const [graph, setGraph] = useState(null)
    const [showLine, ShowLine] = useState(0)
    const [dotHeight, setDot] = useState(0)
    const [screenWidth, setScreenWidth] = useState(0)
    const [line, setLine] = useState(0)
    const [time, setTime] = useState()
    const [timeShift, setShift] = useState()
    const [price, setPrice] = useState(0)
    const [dividers, setDividers] = useState()
    const [coordinates, setCooridinates] = useState()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    Graph.propTypes = {
        loadSecurity: PropTypes.func.isRequired,
        updateSymbol: PropTypes.func.isRequired,
        securities: PropTypes.object,
        securityLoading: PropTypes.bool,
        securityLoaded: PropTypes.bool,
        current_value: PropTypes.number
    }

    if (numbers !== null && min === null) {
        setMin(numbers[0].price)
        setPrice(numbers[numbers.length - 1].price)
    }

    // Determines whether security needs to be loaded
    useEffect(() => {
        if (props.symbol !== undefined) {
            props.loadSecurity(props.symbol, props.period)
        }
        else {
            setNumbers(props.numbers)
        }
    }, [props.period, props.numbers, props.symbol])

    useEffect(() => {
        if (props.numbers !== undefined) {
            setNumbers(props.numbers)
        }
    })

    useEffect(() => {
        if (props.symbol in props.securities) {
            setNumbers(props.securities[props.symbol])
        }
    }, [props.securityLoaded])


    // Loads Security
    useEffect(() => {
        if (props.width !== undefined) {
            setWidth(props.width)
        }
        if (props.height !== undefined) {
            setHeight(props.height)
        }
    }, [props.numbers, props.securities])


    // Updates Price
    useEffect(() => {
        if (props.securityLoaded && props.symbol !== undefined) {
            const interval = setInterval(() => {
                props.updateSymbol(props.symbol)
            }, 5000)
            return () => clearInterval(interval)
        }
    })

    //Sets Updated Price
    useEffect(() => {
        if (props.current_value !== null) {
            setPrice(props.current_value)
        }
    }, [props.current_value])



    const getY = (price) => {
        if (min === max) {
            return height - 25
        }
        else {
            return height - (((price - min) / (max - min)) * (height - 50) + 25);
        }
    }

    useEffect(() => {
        if (numbers !== null) {
            var points = props.width / numbers.length

            if (window.innerWidth % 2 === 1) {
                setScreenWidth(window.innerWidth + 1)
            }
            else {
                setScreenWidth(window.innerWidth)
            }

            var min = numbers[0].price
            var max = 0
            for (var i = 0; i < numbers.length; i++) {
                var price = numbers[i].price;
                if (price > max) {
                    max = price
                }
                if (price < min) {
                    min = price
                }
            }
            setMin(min)
            setMax(max)

            var temp = []
            var tempDividers = []
            var tempCoor = {}

            // Day
            if (props.period === "day") {
                tempDividers = [{ min: null, max: null }, { min: null, max: null }, { min: null, max: null }]
                var pre = ""
                var tempGraph = ""
                var post = ""
                for (let i = 0; i < numbers.length; i++) {
                    var y = getY(numbers[i].price)
                    var x = i * points
                    tempCoor[Math.round(x).toString()] = { x: x, y: y }
                    if (numbers[i].time.hours === 9 && numbers[i].time.minutes < 30) {
                        if (pre === "") {
                            tempDividers[0].min = x
                            tempDividers[0].max = x
                            pre = "M" + x.toString() + "," + y.toString()
                        }
                        else {
                            tempDividers[0].max = x
                            pre = pre + ",L" + x.toString() + "," + y.toString()
                        }
                        continue
                    }
                    if (numbers[i].time.hours > 16) {
                        if (post === "") {
                            tempDividers[2].min = x
                            tempDividers[2].max = x
                            tempGraph = tempGraph + ",L" + x.toString() + "," + y.toString()
                            post = "M" + x.toString() + "," + y.toString()
                        }
                        else {
                            tempDividers[2].max = x
                            post = post + ",L" + x.toString() + "," + y.toString()
                        }
                        continue
                    }
                    if (numbers[i].time.hours === 9) {
                        if (numbers[i].time.minutes === 30) {
                            tempDividers[1].min = x
                            tempDividers[1].max = x
                            pre = pre + ",L" + x.toString() + "," + y.toString()
                            tempGraph = "M" + x.toString() + "," + y.toString()
                            continue
                        }
                    }
                    tempDividers[1].max = x
                    tempGraph = tempGraph + ",L" + x.toString() + "," + y.toString()
                }


                if (pre !== "") {
                    temp.push(pre)
                }
                else {
                    tempDividers = tempDividers.slice(1)
                }
                temp.push(tempGraph)
                if (post !== "") {
                    temp.push(post)
                }
                else {
                    tempDividers = tempDividers.slice(0, -1)
                }
            }

            var y = getY(numbers[0].price)
            var x = 0

            var current_day = numbers[0].time.day
            var tempDimension = "M" + x.toString() + "," + y.toString()
            var tempDivider = { min: x, max: x }

            // Week
            if (props.period === "week") {
                for (let i = 1; i < numbers.length; i++) {
                    y = getY(numbers[i].price)
                    x = i * points
                    tempCoor[Math.round(x).toString()] = { x: x, y: y }
                    if (numbers[i].time.day !== current_day) {
                        current_day = numbers[i].time.day
                        tempDimension = tempDimension + ",L" + x.toString() + "," + y.toString()
                        temp.push(tempDimension)
                        tempDividers.push(tempDivider)
                        tempDivider = tempDivider = { min: x, max: x }
                        tempDimension = "M" + x.toString() + "," + y.toString()
                    }
                    else {
                        y = getY(numbers[i].price)
                        x = i * points
                        tempDivider.max = x
                        tempDimension = tempDimension + ",L" + x.toString() + "," + y.toString()
                    }
                }
                tempDimension = tempDimension + ",L" + x.toString() + "," + y.toString()
                temp.push(tempDimension)
                tempDividers.push(tempDivider)
            }
            else {
                if (props.period !== "day") {
                    for (let i = 1; i < numbers.length; i++) {
                        y = getY(numbers[i].price)
                        x = i * points
                        tempCoor[Math.round(x).toString()] = { x: x, y: y }
                        tempDivider.max = x
                        tempDimension = tempDimension + ",L" + x.toString() + "," + y.toString()
                    }
                    temp.push(tempDimension)
                    tempDividers.push(tempDivider)
                }
            }

            changeGraph(temp)
            setDividers(tempDividers)
            setDimensions(temp)
            setCooridinates(tempCoor)

        }
    }, [min, max, window.innerWidth, numbers, props.period])



    const changeGraph = (dimensions) => {
        var tempGraph = []
        for (let i = 0; i < dimensions.length; i++) {
            tempGraph.push(
                <path className="selectedPath" d={dimensions[i]} fill="none" />
            )
        }
        setGraph(tempGraph)
    }

    const addGraphPoint = () => {
        ShowLine(true)
    }


    const changeStyle = (x) => {
        var tempGraph = []
        for (let i = 0; i < dividers.length; i++) {
            if (dividers[i].min !== null) {
                if (x >= dividers[i].min && x <= dividers[i].max) {
                    tempGraph.push(<path className="selectedPath" d={dimensions[i]} fill="none" />)
                }
                else {
                    tempGraph.push(
                        <path className="hiddenPath" d={dimensions[i]} fill="none" />
                    )
                }
            }
            else {
                tempGraph.push(null)
            }
        }
        setGraph(tempGraph)
    }

    const followGraphPoint = (e) => {
        var left = e.clientX - ((screenWidth - 1070) / 2) - 30
        var points = props.width / numbers.length
        if (screenWidth <= 1010) {
            left = e.clientX - 30
        }
        if (left.toString() in coordinates && left <= width) {
            var point = numbers[Math.round(coordinates[left.toString()].x / points)]
            setLine(left)
            setDot(getY(point.price))
            setPrice(point.price)
            setTime(point.time)
            setShift(e.clientX)
            changeStyle(left)
        }
    }

    const removeGraphPoint = () => {
        ShowLine(false)
        setTime()
        if (props.value !== undefined && props.value !== null) {
            setPrice(props.value)
        }
        else {
            setPrice(numbers[numbers.length - 1].price)
        }
        changeGraph(dimensions)
    }

    const timeString = () => {
        if (time) {
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
    }

    const plain = (
        <div className="graphCont">
            <svg className="small" width={props.width} height={height}>
                {graph !== null ? graph : <div></div>}
            </svg>
        </div>
    )

    const full = (
        <div>
            {
                props.securityLoading ?
                    <div className="loaderContainer f ai-c jc-c" style={
                        {
                            "height": "306px",
                            "width": width,
                            "display": "flex",
                            "align-items": "center",
                            "justify-content": "center"
                        }
                    }>
                        <div class="loader"></div>
                    </div>
                    :
                    <div className="graphCont"
                        style={
                            {
                                width: width
                            }
                        }
                        onMouseMove={(e) => followGraphPoint(e)}
                        onMouseEnter={(e) => addGraphPoint()}
                        onMouseLeave={(e) => removeGraphPoint()}
                    >
                        <h1>${price.toFixed(2)}</h1>
                        <div style={
                            {
                                left: timeShift + "px",
                                position: "absolute"
                            }
                        }>
                            <div className="chartTime">{timeString()}</div>
                        </div>
                        <svg width={props.width} height={height}>
                            <g className="line">
                                {showLine ? <line x1={line} x2={line} y1={25} y2={height - 25} /> : <div></div>}
                            </g>
                            {graph !== null ? graph : <div></div>}
                            {showLine ?
                                <g transform={"translate(" + line + "," + dotHeight + ")"}>
                                    <circle cx="0" cy="0" r="5" />
                                </g> : <div></div>}
                        </svg>
                    </div>
            }
        </div>
    )

    return (
        <div>
            {
                props.plain ? plain : full
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    securities: state.securities.securities,
    current_value: state.securities.current_value,
    securityLoaded: state.securities.securityLoaded,
    securityLoading: state.securities.securityLoading
});

export default connect(mapStateToProps, { loadSecurity, updateSymbol })(Graph);