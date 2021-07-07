import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import profilePic from '../../static/profilePic.png';
import queryString from 'query-string';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadPortfolio, loadUser } from '../../actions/user.js';
import Graph from './Graph.js';



function Portfolio(props) {

    const [period, setPeriod] = useState("day");
    const [charts, setCharts] = useState(null);
    const [username, setUsername] = useState(null);

    Portfolio.propTypes = {
        loadPortfolio: PropTypes.func.isRequired,
        portfolio: PropTypes.object,
        small_charts: PropTypes.object,
        holdings: PropTypes.object,
        isAuthenticated: PropTypes.bool,
    }

    useEffect(() => {
        const values = queryString.parse(props.location.search);
        if (!props.error) {
            const keys = Object.keys(values);
            if (keys.length != 0) {
                setUsername(values.username)
            }
        }
    })

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    const changePeriod = (period) => {
        setPeriod(period)
    }

    if (charts === null && props.small_charts !== null) {
        var small_charts = []
        for (const property in props.small_charts) {
            var temp = (
                <Link to={'/chart?symbol=' + property} className='stock'>
                    <div className='left-stock'>
                        <div className='stock-symbol'>{property}</div>
                        <div className='stock-quantity'>{props.holdings[property].toFixed(2)} Shares</div>
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

    if (props.portfolio == null && username !== null) {
        props.loadPortfolio(period, false, username)
    }


    useEffect(() => {
        if (username !== null) {
            props.loadPortfolio(period, false, username)
        }
    }, [period])

    const dayStyle = {
        "border-bottom": "rgb(66, 66, 66) 2px solid"
    }

    const noCharts = (
        <div className="noCharts">
            There are no stocks to display
        </div>
    )

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
                <h3>Stocks</h3>
            </div>
            {charts !== null ? charts.length !== 0 ? charts :
                noCharts
                : noCharts
            }
        </div>
    )

    return (
        <div className="pageContainer">
            <h1>{username}'s Portfolio</h1>
            <div>
                {props.portfolio !== null ? graph : <div></div>}
                {actionbox}
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    portfolio: state.securities.portfolio,
    small_charts: state.securities.small_charts,
    holdings: state.securities.holdings
});

export default connect(mapStateToProps, { loadPortfolio })(Portfolio);