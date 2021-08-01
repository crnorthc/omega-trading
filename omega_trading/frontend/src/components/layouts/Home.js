/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import profilePic from '../../static/profilePic.png'
import NewGraph from './NewGraph.js'
import Loader from './Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUser } from '../../actions/user.js'
import { loadPortfolio, friendsPortfolios } from '../../actions/portfolio.js'

function Home(props) {
    const [period, setPeriod] = useState('day')
    const [charts, setCharts] = useState(null)
    const [type, setType] = useState('stocks')
    const periodMap = {
        'day': 'day',
        'week': 'week',
        'month': 'month',
        '3m': 'threeMonth',
        'y': 'year',
        '5y': 'fiveYear'
    }

    Home.propTypes = {
        loadPortfolio: PropTypes.func.isRequired,
        friendsPortfolios: PropTypes.func.isRequired,
        portfolio: PropTypes.object,
        friends_charts: PropTypes.object,
        user: PropTypes.object,
        isAuthenticated: PropTypes.bool,
        loading: PropTypes.bool,
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

    if (charts === null && props.portfolio.charts !== null && props.user !== null) {
        var small_charts = []
        for (const symbol in props.portfolio.charts) {
            var temp = (
                <Link to={'/chart?symbol=' + symbol} className='stock f ai-c jc-s'>
                    <div className='left-stock'>
                        <div className='stock-symbol'>{symbol}</div>
                        <div className='stock-quantity f'>{props.user.holdings[symbol].toFixed(2)} Shares</div>
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

    if (props.portfolio.friends === null && type == 'friends' && !props.portfolio.friends_loading) {
        if (Object.keys(props.user.friends).length > 0) {
            props.friendsPortfolios()
        }
    }

    useEffect(() => {
        if (props.portfolio[periodMap[period]] == null) {
            props.loadPortfolio(period)
        }
    }, [period])

    const noCharts = (type) => {
        return <div className='noCharts f ai-c jc-c'>You do not have {type} to display</div>
    }

    const friendsCharts = () => {
        var charts = []
        for (const friend in props.portfolio.friends) {
            var temp = (
                <Link to={'/portfolio?username=' + friend} className='friend f ai-c jc-s'>
                    <div className='left-friend fc ai-c jc-c'>
                        <img className='userPic' src={profilePic} width={30} />
                        <div className='stock-symbol'>{friend}</div>
                    </div>
                    <div className='small-chart'>
                        {smallChart(props.portfolio.friends[friend].path)}
                    </div>
                    <div className='stock-price'>${props.portfolio.friends[friend].last_price.toFixed(2)}</div>
                </Link>
            )
            charts.push(temp)
        }
        return charts
    }

    const dayStyle = {
        'border-bottom': 'rgb(66, 66, 66) 2px solid',
    }

    const graph = () => { 
        return(
            <div className='Graph'>
                {<NewGraph data={props.portfolio[periodMap[period]]}/>}
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

    const actionbox = (
        <div className='action-box b'>
            <div className='buySell bb fr ai-c jc-c'>
                <button className='buy' style={type === 'stocks' ? dayStyle : null} onClick={() => setType('stocks')}>
                    Stocks
                </button>
                <button className='sell' style={type === 'friends' ? dayStyle : null} onClick={() => setType('friends')}>
                    Friends
                </button>
            </div>
            {type === 'stocks' ? (charts !== null ? charts : noCharts('stocks')) : props.friends_charts !== null ? friendsCharts() : noCharts('friends')}
        </div>
    )

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    if (props.portfolio[periodMap[period]] == null) {
        return <Loader page={true}/>
    }
    else {
        return (
            <div className='pageContainer'>
                <h1>Portfolio</h1>
                <div>
                    {graph()}
                    {actionbox}
                </div>
            </div>
        )
    }    
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    portfolio: state.portfolio,
    friends_charts: state.user.friends_charts,
    user: state.user.user,
    loading: state.user.loading
})

export default connect(mapStateToProps, { loadPortfolio, loadUser, friendsPortfolios })(Home)