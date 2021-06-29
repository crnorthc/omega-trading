import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Graph from './Graph';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadSecurity, updateSymbol } from '../../actions/securities.js';
import { buy } from '../../actions/user.js';

function ChartDisplay(props) {
    const noStyle = {
        "font-weight": "500"
    }
    const selected = {
        "font-weight": "700"
    }

    const [metric, setMetric] = useState("Dollars")
    const [drop, setDrop] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [message, setMessage] = useState("$1.21 buying power available")
    const [dolStyle, setDol] = useState(selected)
    const [sharStyle, setShar] = useState(noStyle)
    const [period, setPeriod] = useState("day")
    const [value, setValue] = useState(null)

    ChartDisplay.propTypes = {
        loadSecurity: PropTypes.func.isRequired,
        updateSymbol: PropTypes.func.isRequired,
        buy: PropTypes.func.isRequired,
        security: PropTypes.object,
        securityLoaded: PropTypes.bool,
        symbol: PropTypes.string,
        current_value: PropTypes.number
    }

    useEffect(() => {
        const values = queryString.parse(props.location.search);
        if (!props.error) {
            const keys = Object.keys(values);
            if (keys.length != 0) {
                props.loadSecurity(values.symbol, period)
            }
        }
    }, [period])

    useEffect(() => {
        if (props.securityLoaded) {
            const interval = setInterval(() => {
                props.updateSymbol(props.symbol)
            }, 5000)
            return () => clearInterval(interval)
        }
    })

    useEffect(() => {
        setValue(props.current_value)
    }, [props.current_value])


    const onClick = (e) => {
        if (drop === true) {
            setDrop(false)
        }
        else {
            setDrop(true)
        }
    }

    const swapMetric = (metric) => {
        if (metric === "Shares") {
            setShar(selected)
            setDol(noStyle)
        }
        else {
            setShar(noStyle)
            setDol(selected)
        }
        setMetric(metric)
        setDrop(false)
    }

    const changePeriod = (period) => {
        setPeriod(period)
    }


    const dropButton = (
        <div className="dropButtons">
            <button onClick={(e) => onClick(e)} className="typeButton-drop">
                <div className="metric">{metric}</div>
                <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                    <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                </svg>
            </button>
            <button style={sharStyle} onClick={(e) => swapMetric("Shares")} id="shares" className="typeButton-drop"><div className="metric">Shares</div></button>
            <button style={dolStyle} onClick={(e) => swapMetric("Dollars")} className="typeButton-drop-last"><div className="metric">Dollars</div></button>
        </div>

    )
    const dayStyle = {
        "border-bottom": "rgb(66, 66, 66) 2px solid"
    }

    const setDollarQuantity = (quantity) => {
        if (value !== null) {
            if (quantity === "") {
                setQuantity(0)
            }
            else {
                setQuantity(Number(quantity) / (props.current_value * .99))
            }
        }
    }


    const submitOrder = () => {
        props.buy(props.symbol, quantity)
    }

    return (
        <div>
            <div className="chartContainer">
                <div className="Graph">
                    <h1 className="symbol-title">{props.symbol}</h1>
                    <div>
                        {props.securityLoaded ? <Graph value={value} numbers={props.security} period={period} width={676} /> : <div></div>}
                    </div>
                    <div className="timeSelector">
                        <button style={period == "day" ? dayStyle : null} onClick={(e) => changePeriod("day")} className="timePeriod">1D</button>
                        <button style={period == "week" ? dayStyle : null} onClick={(e) => changePeriod("week")} className="timePeriod">1W</button>
                        <button style={period == "month" ? dayStyle : null} onClick={(e) => changePeriod("month")} className="timePeriod">1M</button>
                        <button style={period == "3m" ? dayStyle : null} onClick={(e) => changePeriod("3m")} className="timePeriod">3M</button>
                        <button style={period == "y" ? dayStyle : null} onClick={(e) => changePeriod("y")} className="timePeriod">1Y</button>
                        <button style={period == "5y" ? dayStyle : null} onClick={(e) => changePeriod("5y")} className="timePeriod">5Y</button>
                    </div>
                </div>
                <div className="action-box">
                    <div className="buySell">
                        <button className="buy">Buy {props.symbol}</button>
                        <button className="sell">Sell {props.symbol}</button>
                    </div>
                    <div className="values">
                        <div className="investIn">
                            <div className="type">Invest In</div>
                            <div className="buttons">
                                <button onClick={(e) => onClick(e)} className="typeButton">
                                    <div className="metric">{metric}</div>
                                    <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                                        <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                                    </svg>
                                </button>
                                {drop ? dropButton : null}
                            </div>

                        </div>
                        <div className="Amount">
                            <div className="type">Amount</div>
                            {metric === "Dollars" ?
                                <input onChange={e => setDollarQuantity(e.target.value)} className="amountInput"
                                    placeholder="$0.00"
                                    type="number" min=".01" /> :
                                <input onChange={e => setQuantity(e.target.value)} className="amountInput"
                                    placeholder="0"
                                    type="number" min="1" />
                            }
                        </div>
                        <div className="Quantity">
                            <div className="type">Est. Quantity</div>
                            <div className="quantity">{quantity.toFixed(3)}</div>
                        </div>
                    </div>
                    <div className="reviewOrder">
                        <button onClick={(e) => submitOrder()} className="reviewButton">Review Order</button>
                    </div>
                    <div className="Message">
                        <div className="message">
                            {message}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    security: state.securities.security,
    securityLoaded: state.securities.securityLoaded,
    symbol: state.securities.symbol,
    current_value: state.securities.current_value
});

export default connect(mapStateToProps, { loadSecurity, updateSymbol, buy })(ChartDisplay);