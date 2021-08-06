/* eslint-disable react/prop-types */
import React, { useState } from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { buy, sell } from '../../actions/user.js'
import { gameBuy, gameSell } from '../../actions/game'


function ActionBox(props) {
    const [metric, setMetric] = useState('Dollars')
    const [drop, setDrop] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [dollars, setDollars] = useState(null)
    const [type, setType] = useState('buy')
    const [mode, setMode] = useState('nogame')

    ActionBox.propTypes = {
        buy: PropTypes.func.isRequired,
        sell: PropTypes.func.isRequired,
        gameBuy: PropTypes.func.isRequired,
        gameSell: PropTypes.func.isRequired,
        current_value: PropTypes.number,
        symbol: PropTypes.string, 
        user: PropTypes.object,
    }

    const modeStyle = {
        'background-color': 'rgb(202, 202, 202)'
    }

    const typeStyle = (
        { 'border-bottom': 'rgb(66, 66, 66) 2px solid' }
    )

    const noStyle = {
        'font-weight': '500'
    }
    const selected = {
        'font-weight': '700'
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
                if (Number(quantity * props.current_value) < props.user.cash) {
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


    const dropButton = (
        <div className="dropButtons b">
            <button onClick={() => setDrop(!drop)} className="typeButton-drop bb f ai-c jc-s">
                <div className="metric">{metric}</div>
                <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                    <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                </svg>
            </button>
            <button style={metric == 'Shares' ? selected : noStyle} onClick={() => setMetric('Shares')} id="shares" className="typeButton-drop bb f ai-c jc-s"><div className="metric">Shares</div></button>
            <button style={metric == 'Dollars' ? selected : noStyle} onClick={() => setMetric('Dollars')} className="typeButton-drop bb-last f ai-c jc-s"><div className="metric">Dollars</div></button>
        </div>

    )

    return (
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
                        <button onClick={() => setDrop(!drop)} className="typeButton b f ai-c jc-s">
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
                                    ${props.user.cash.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} buying power available
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
    )
}


const mapStateToProps = (state) => ({
    current_value: state.securities.current_value,
    symbol: state.securities.symbol, 
    user: state.user.user
})

export default connect(mapStateToProps, { gameBuy, gameSell, buy, sell })(ActionBox)