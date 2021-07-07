import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import profilePic from '../../static/profilePic.png'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadPortfolio, loadUser } from '../../actions/user.js';
import Graph from './Graph.js';



function Home(props) {

    const [period, setPeriod] = useState("day");
    const [charts, setCharts] = useState(null);
    const [type, setType] = useState('stocks');

    Home.propTypes = {
        loadPortfolio: PropTypes.func.isRequired,
        portfolio: PropTypes.object,
        small_charts: PropTypes.object,
        friends_charts: PropTypes.object,
        user: PropTypes.object,
        isAuthenticated: PropTypes.bool
    }

    const changePeriod = (period) => {
        setPeriod(period)
    }

    if (charts === null && props.small_charts !== null && props.user !== null) {
        var small_charts = []
        for (const property in props.small_charts) {
            var temp = (
                <Link to={'/chart?symbol=' + property} className='stock'>
                    <div className='left-stock'>
                        <div className='stock-symbol'>{property}</div>
                        <div className='stock-quantity'>{props.user.holdings[property].toFixed(2)} Shares</div>
                    </div>
                    <div className="small-chart">
                        <Graph plain={true} value={null} numbers={props.small_charts[property]} period={period} width={64} height={30} />
                    </div>
                    <div className="stock-price">
                        ${props.small_charts[property][props.small_charts[property].length - 1].price.toFixed(2)}
                    </div>
                </Link>
            )
            small_charts.push(temp)
        }
        setCharts(small_charts)
    }

    if (props.friends_charts === null && props.user !== null) {
        if (Object.keys(props.user.friends).length > 0) {
            props.loadPortfolio('day', true, false)
        }
    }

    useEffect(() => {
        props.loadPortfolio(period, false, false)
    }, [period])

    const noCharts = (type) => {
        return (
            <div className="noCharts">
                You do not have {type} to display
            </div>
        )
    }

    const friendsCharts = () => {
        var charts = []
        for (const friend in props.friends_charts) {
            var temp = (
                <Link to={'/portfolio?username=' + friend} className='friend'>
                    <div className='left-friend'>
                        <img className="userPic" src={profilePic} width={30} />
                        <div className='stock-symbol'>{friend}</div>
                    </div>
                    <div className="small-chart">
                        <Graph plain={true} value={null} numbers={props.friends_charts[friend]} period={'day'} width={64} height={30} />
                    </div>
                    <div className="stock-price">
                        ${props.friends_charts[friend][props.friends_charts[friend].length - 1].price.toFixed(2)}
                    </div>
                </Link>
            )
            charts.push(temp)
        }
        return charts
    }

    const dayStyle = {
        "border-bottom": "rgb(66, 66, 66) 2px solid"
    }

    const graph = (
        <div className="Graph">
            <h1 className="symbol-title">{props.symbol}</h1>
            <div>
                {props.portfolio !== null ? <Graph value={null} numbers={props.portfolio} period={period} width={676} /> : <div></div>}
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
    )

    const actionbox = (
        <div className="action-box">
            <div className="buySell">
                <button className="buy" style={type === 'stocks' ? dayStyle : null} onClick={e => setType('stocks')}>Stocks</button>
                <button className="sell" style={type === 'friends' ? dayStyle : null} onClick={e => setType('friends')}>Friends</button>
            </div>
            {type === 'stocks' ?
                charts !== null ? charts : noCharts("stocks")
                :
                props.friends_charts !== null ? friendsCharts() : noCharts("friends")
            }
        </div>
    )

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    return (
        <div className="pageContainer">
            <h1>Portfolio</h1>
            <div>
                {props.portfolio !== null ? graph : <div></div>}
                {actionbox}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    portfolio: state.user.portfolio,
    small_charts: state.user.small_charts,
    friends_charts: state.user.friends_charts,
    user: state.user.user
});

export default connect(mapStateToProps, { loadPortfolio, loadUser })(Home);