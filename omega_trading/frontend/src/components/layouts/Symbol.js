/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import NewGraph from './NewGraph.js'
import Loader from './Loader'
import Options from './Options.js'
import queryString from 'query-string'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadSecurity, newSecurity } from '../../actions/securities'


function Symbol(props) {
    const [period, setPeriod] = useState('day')
    const [symbol, setSymbol] = useState(null)

    Symbol.propTypes = {
        loadSecurity: PropTypes.func.isRequired,
        newSecurity: PropTypes.func.isRequired,
        data: PropTypes.object,
        user: PropTypes.object,
        isAuthenticated: PropTypes.bool,
        loading: PropTypes.bool,
        symbol: PropTypes.string, 
    }

    const changePeriod = (period) => {
        setPeriod(period)
    }

    if (symbol == null) {
        const values = queryString.parse(props.location.search)
        const keys = Object.keys(values)
        if (keys.length != 0) {
            setSymbol(values.symbol)
        }
    }

    if (symbol !== props.symbol) {
        props.newSecurity()
    }

    if (symbol !== null && props.data == null) {
        props.loadSecurity(symbol, period)
    }

    useEffect(() => {
        props.loadSecurity(symbol, period)
    }, [period])



    const dayStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid',
    }

    const graph = () => { 
        return(
            <div className='Graph'>
                {<NewGraph data={props.data} />}
                <div className='timeSelector f ai-c'>
                    <button style={period == 'day' ? dayStyle : null} onClick={() => changePeriod('day')} className='timePeriod'>1D</button>
                    <button style={period == 'week' ? dayStyle : null} onClick={() => changePeriod('week')} className='timePeriod'>1W</button>
                    <button style={period == 'month' ? dayStyle : null} onClick={() => changePeriod('month')} className='timePeriod'>1M</button>
                    <button style={period == '3m' ? dayStyle : null} onClick={() => changePeriod('3m')} className='timePeriod'>3M</button>
                    <button style={period == 'y' ? dayStyle : null} onClick={() => changePeriod('y')} className='timePeriod'>1Y</button>
                    <button style={period == '5y' ? dayStyle : null} onClick={() => changePeriod('5y')} className='timePeriod'>5Y</button>
                </div>
            </div>
        )
    }

    const actionBox = (
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
    )

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    if (props.data == null) {
        return <Loader page={true}/>
    }
    else {
        return (
            <div className='pageContainer'>
                <h1>{props.symbol}</h1>
                <div>
                    {graph()}
                </div>
                <Options symbol={props.symbol} />
            </div>
        )
    }    
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.user.user,
    data: state.securities.data,
    symbol: state.securities.symbol, 
})

export default connect(mapStateToProps, { loadSecurity, newSecurity })(Symbol)