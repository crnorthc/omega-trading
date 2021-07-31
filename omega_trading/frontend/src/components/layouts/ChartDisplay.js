import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import Graph from './Graph'
import { Redirect } from 'react-router-dom'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { buy, loadUser, sell } from '../../actions/user.js'
import { gameBuy, gameSell, loadGame } from '../../actions/game'

function ChartDisplay(props) {
    const noStyle = {
        'font-weight': '500'
    }
    const selected = {
        'font-weight': '700'
    }

    const [metric, setMetric] = useState('Dollars')
    const [drop, setDrop] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [dollars, setDollars] = useState(null)
    const [dolStyle, setDol] = useState(selected)
    const [sharStyle, setShar] = useState(noStyle)
    const [period, setPeriod] = useState('day')
    const [value, setValue] = useState(null)
    const [symbol, setSymbol] = useState(null)
    const [type, setType] = useState('buy')
    const [mode, setMode] = useState('nogame')

    ChartDisplay.propTypes = {
        loadUser: PropTypes.func.isRequired,
        loadGame: PropTypes.func.isRequired,
        buy: PropTypes.func.isRequired,
        sell: PropTypes.func.isRequired,
        gameBuy: PropTypes.func.isRequired,
        gameSell: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        securityLoaded: PropTypes.bool,
        game_loaded: PropTypes.bool,
        game_loading: PropTypes.bool,
        symbol: PropTypes.string,
        current_value: PropTypes.number,
        user: PropTypes.object,
        no_game: PropTypes.bool,
        game: PropTypes.object
    }

    if (!props.isAuthenticated) {
        return <Redirect to='/login'></Redirect>
    }

    useEffect(() => {
        if (!props.game_loaded && !props.game_loading) {
            props.loadGame()
        }
    })

    useEffect(() => {
        const values = queryString.parse(props.location.search)
        if (!props.error) {
            const keys = Object.keys(values)
            if (keys.length != 0) {
                setSymbol(values.symbol)
            }
        }
    })

    const onClick = () => {
        if (drop === true) {
            setDrop(false)
        }
        else {
            setDrop(true)
        }
    }

    const swapMetric = (metric) => {
        if (metric === 'Shares') {
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
        <div className="dropButtons b">
            <button onClick={(e) => onClick(e)} className="typeButton-drop bb f ai-c jc-s">
                <div className="metric">{metric}</div>
                <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                    <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                </svg>
            </button>
            <button style={sharStyle} onClick={() => swapMetric('Shares')} id="shares" className="typeButton-drop bb f ai-c jc-s"><div className="metric">Shares</div></button>
            <button style={dolStyle} onClick={() => swapMetric('Dollars')} className="typeButton-drop bb-last f ai-c jc-s"><div className="metric">Dollars</div></button>
        </div>

    )
    const dayStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid'
    }

    const modeStyle = {
        'background-color': 'rgb(202, 202, 202)'
    }

    const changeQuantity = (quantity) => {
        if (props.current_value !== null) {
            if (quantity === '') {
                setQuantity(0)
            }
            else {
                if (props.current_value !== null) {
                    if (metric === 'Dollars') {
                        setDollars(Number(quantity))
                        setQuantity(Number(quantity) / (props.current_value * .99))
                    }
                    else {
                        setQuantity(Number(quantity) * props.current_value)
                    }
                }
            }
        }
    }


    const submitOrder = (sellAll) => {
        var amount = quantity
        var dollarMetric = false
        if (metric == 'Dollars') {
            amount = dollars
            dollarMetric = true
        }
        if (type === 'buy') {
            if (mode != 'game') {
                if (Number(quantity * props.current_value) < props.user.portfolio_amount) {
                    props.buy(props.symbol, amount, dollarMetric)
                }
                else {
                    alert('You do not have enough purchasing power!')
                }
            }
            else {
                if (Number(quantity * props.current_value) < props.game.players[props.user.username]['cash']) {
                    props.gameBuy(props.symbol, amount, dollarMetric, props.game.room_code)
                }
                else {
                    alert('You do not have enough purchasing power!')
                }
            }
        }
        else {
            if (sellAll) {
                if (mode != 'game') {
                    props.sell(props.symbol, props.user.holdings[props.symbol])
                }
                else {
                    props.gameSell(props.symbol, props.game.players[props.user.username]['holdings'][props.symbol], props.game.room_code)
                }
            }
            else {
                if (mode != 'game') {
                    if (quantity < props.user.holdings[props.symbol]) {
                        props.sell(props.symbol, amount, dollarMetric)
                    }
                    else {
                        alert('You do not have enough shares to sell!')
                    }
                }
                else {
                    if (quantity < props.game.players[props.user.username]['holdings'][props.symbol]) {
                        props.gameSell(props.symbol, amount, dollarMetric, props.game.room_code)
                    }
                    else {
                        alert('You do not have enough shares to sell!')
                    }
                }
            }
        }
    }


    const typeStyle = (
        { 'border-bottom': 'rgb(66, 66, 66) 2px solid' }
    )

    if ((!props.game_loading && !props.game_loaded) || props.game_loading) {
        return (
            <div className="pageContainer">
                <div className='loaderContainer f ai-c jc-c'>
                    <div className='loader' />
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="pageContainer">
                    <div className="Graph">
                        <h1 className="symbol-title">{props.symbol}</h1>
                        <div>
                            {symbol !== null ? <Graph plain={false} symbol={symbol} value={value} period={period} width={676} /> : <div></div>}
                        </div>
                        <div className="timeSelector f ai-c">
                            <button style={period == 'day' ? dayStyle : null} onClick={() => changePeriod('day')} className="timePeriod">1D</button>
                            <button style={period == 'week' ? dayStyle : null} onClick={() => changePeriod('week')} className="timePeriod">1W</button>
                            <button style={period == 'month' ? dayStyle : null} onClick={() => changePeriod('month')} className="timePeriod">1M</button>
                            <button style={period == '3m' ? dayStyle : null} onClick={() => changePeriod('3m')} className="timePeriod">3M</button>
                            <button style={period == 'y' ? dayStyle : null} onClick={() => changePeriod('y')} className="timePeriod">1Y</button>
                            <button style={period == '5y' ? dayStyle : null} onClick={() => changePeriod('5y')} className="timePeriod">5Y</button>
                        </div>
                    </div>
                    <div className="action-box b">
                        {!props.no_game ?
                            <div className='bb fr'>
                                <button className="mode-choice br" style={mode === 'nogame' ? modeStyle : null} onClick={() => setMode('nogame')}>Portfolio</button>
                                <button className="modeChoice" style={mode === 'game' ? modeStyle : null} onClick={() => setMode('game')}>Game</button>
                            </div>
                            : null
                        }
                        <div className="buySell bb fr ai-c jc-c">
                            <button className="buy" style={type === 'buy' ? typeStyle : null} onClick={() => setType('buy')}>Buy {props.symbol}</button>
                            <button className="sell" style={type === 'sell' ? typeStyle : null} onClick={() => setType('sell')}>Sell {props.symbol}</button>
                        </div>
                        <div className="values">
                            <div className="investIn f ai-c jc-s">
                                <div className="type">Invest In</div>
                                <div className="buttons">
                                    <button onClick={(e) => onClick(e)} className="typeButton b f ai-c jc-s">
                                        <div className="metric">{metric}</div>
                                        <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                                            <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                                        </svg>
                                    </button>
                                    {drop ? dropButton : null}
                                </div>

                            </div>
                            <div className="bb f ai-c jc-s">
                                <div className="type">Amount</div>
                                {metric === 'Dollars' ?
                                    <input onChange={(e) => changeQuantity(e.target.value)} className="amountInput b"
                                        placeholder="$0.00"
                                        type="number" min=".01" /> :
                                    <input onChange={(e) => changeQuantity(e.target.value)} className="amountInput b"
                                        placeholder="0"
                                        type="number" min="1" />
                                }
                            </div>
                            <div className="Quantity f ai-c jc-s">
                                {metric === 'Dollars' ? <div className="type">Est. Quantity</div> : <div className="type">Est. Cost</div>}
                                {metric === 'Dollars' ? <div className="quantity">{quantity.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div> : <div className="quantity">${quantity.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>}
                            </div>
                        </div>
                        <div className="reviewOrder bb">
                            <button onClick={() => submitOrder(false)} className="reviewButton b">Review Order</button>
                        </div>
                        <div className="Message f ai-c">
                            {props.user !== null ? type === 'buy' ?
                                <div className="message fr ai-c jc-s">
                                    ${props.user.portfolio_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} buying power available
                                </div>
                                : metric === 'Dollars' ?
                                    <div className="message fr ai-c jc-s">
                                        <div className="amountAvailable">${(props.user.holdings[props.symbol] * props.current_value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Available</div>
                                        <button className="sellAll" onClick={() => submitOrder(true)}>Sell All</button>
                                    </div>
                                    :
                                    <div className="message fr ai-c jc-s">
                                        <div className="amountAvailable">{props.user.holdings[props.symbol].toFixed(6).toString()} Shares Available</div>
                                        <button className="sellAll" onClick={() => submitOrder(true)}>Sell All</button>
                                    </div>
                                :
                                <div></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}


const mapStateToProps = (state) => ({
    securityLoaded: state.securities.securityLoaded,
    isAuthenticated: state.auth.isAuthenticated,
    symbol: state.securities.symbol,
    current_value: state.securities.current_value,
    game_loaded: state.game.game_loaded,
    game_loading: state.game.game_loading,
    no_game: state.game.no_game,
    user: state.user.user,
    game: state.game.game
})

export default connect(mapStateToProps, { gameBuy, gameSell, buy, sell, loadUser, loadGame })(ChartDisplay)