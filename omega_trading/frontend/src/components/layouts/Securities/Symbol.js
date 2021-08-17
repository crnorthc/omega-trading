/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import NewGraph from './NewGraph.js'
import Loader from '../Tools/Loader'
import Options from './Options.js'
import ActionBox from './ActionBox.js'
import queryString from 'query-string'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadSecurity, newSecurity } from '../../../actions/securities'


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

    if (props.data == null) {
        return <Loader page={true}/>
    }
    else {
        return (
            <div>
                <h1>{props.symbol}</h1>
                {graph()}
                <Options symbol={props.symbol} />
            </div>
        )
    }    
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    data: state.securities.data,
    symbol: state.securities.symbol, 
})

export default connect(mapStateToProps, { loadSecurity, newSecurity })(Symbol)