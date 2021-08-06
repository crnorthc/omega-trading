/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import queryString from 'query-string'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { friendPortfolio, clearPortfolio } from '../../../actions/portfolio.js'
import NewGraph from './NewGraph.js'
import Loader from '../Tools/Loader.js'



function Portfolio(props) {

    const [period, setPeriod] = useState('day')
    const [charts, setCharts] = useState(null)
    const [username, setUsername] = useState(null)
    const periodMap = {
        'day': 'day',
        'week': 'week',
        'month': 'month',
        '3m': 'threeMonth',
        'y': 'year',
        '5y': 'fiveYear'
    }

    Portfolio.propTypes = {
        friendPortfolio: PropTypes.func.isRequired,
        portfolio: PropTypes.object,
        isAuthenticated: PropTypes.bool,
    }

    useEffect(() => {
        const values = queryString.parse(props.location.search)
        if (!props.error) {
            const keys = Object.keys(values)
            if (keys.length != 0) {
                setUsername(values.username)
            }
        }
    })

    if (props.portfolio[periodMap[period]] != null && !props.portfolio.cleared) {
        props.clearPortfolio()
    }
    

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    const changePeriod = (period) => {
        setPeriod(period)
    }

    const smallChart = (path) => {
        return (
            <svg width={64} height={30}>
                <g className="line">
                    <path d={path} fill="none"/>
                </g>
            </svg>
        )
    }

    if (charts === null && props.portfolio.charts !== null && props.portfolio.cleared) {
        var small_charts = []
        for (const symbol in props.portfolio.charts) {
            var temp = (
                <Link to={'/chart?symbol=' + symbol} className='stock f ai-c jc-s'>
                    <div className='left-stock'>
                        <div className='stock-symbol'>{symbol}</div>
                        <div className='stock-quantity f'>{props.portfolio.charts[symbol].quantity.toFixed(2)} Shares</div>
                    </div>
                    <div className='small-chart'>
                        {smallChart(props.portfolio.charts[symbol].path)}
                    </div>
                    <div className='stock-price'>${props.portfolio.charts[symbol].last_price.toFixed(2)}</div>
                </Link>
            )
            small_charts.push(temp)
        }
        setCharts(small_charts)
    }

    if (props.portfolio[periodMap[period]] == null && username !== null) {
        props.friendPortfolio(period, username)
    }

    useEffect(() => {
        if (username !== null) {
            if (props.portfolio[periodMap[period]] == null) {
                props.friendPortfolio(period, username)
            }
        }
    }, [period])

    const dayStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid'
    }

    const noCharts = (
        <div className="noCharts">
            There are no stocks to display
        </div>
    )

    const graph = () => {
        console.log(props.portfolio)
        return (
            <div className="Graph">
                <h1 className="symbol-title">{props.symbol}</h1>
                <div>
                    {<NewGraph data={props.portfolio[periodMap[period]]}/>}
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
        )
    }

    const actionbox = (
        <div className="action-box b">
            <div className='buySell bb fr ai-c jc-c'>
                <h3>Stocks</h3>
            </div>
            {charts !== null ? charts.length !== 0 ? charts :
                noCharts
                : noCharts
            }
        </div>
    )

    if (props.portfolio[periodMap[period]] == null || !props.portfolio.cleared) {
        return <Loader page={true}/>
    }
    else {
        return (
            <div className="pageContainer">
                <div>
                    <h1>{username}'s Portfolio</h1>
                    <div>
                        {props.portfolio !== null ? graph() : <div></div>}
                        {actionbox}
                    </div>
                </div>            
            </div>
        )
    }    
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    portfolio: state.portfolio,
})

export default connect(mapStateToProps, { friendPortfolio, clearPortfolio })(Portfolio)