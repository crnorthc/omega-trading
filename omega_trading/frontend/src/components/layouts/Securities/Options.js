/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Loader from '../Tools/Loader'
import Dropdown from '../Tools/Dropdown'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { optionsPrices, dateRange } from '../../../actions/securities'


function Options(props) {
    const [option, setOption] = useState('call')
    const [type, setType] = useState('buy')
    const [date, setDate] = useState(null)
    const [drop, setDrop] = useState(false)

    Options.propTypes = {
        optionsPrices: PropTypes.func.isRequired,
        dateRange: PropTypes.func.isRequired,
        call: PropTypes.array,
        put: PropTypes.array,
        dates: PropTypes.array
    }

    const handleDrop = () => {
        setDrop(false)
    }

    useEffect(() => {
        if (props.dates == null) {
            props.dateRange()
        }
        else {
            if (props.call == null) {
                //props.optionsPrices(props.symbol, null, 'call')
            }
        }
    }, [])

    const formatDate = (date) => {
        var date_string = date.month + ' '
        date_string = date_string + date.day
        
        if(date.year !== null) {
            date_string = date_string + ', ' + date.year
        }

        return date_string
    }

    const dropDown = () => {
        var dates = []

        for (const d in props.dates) {
            var dDate = formatDate(props.dates[d])
            var dateDate = formatDate(date)
            dates.push(
                <div>
                    {dDate == dateDate ?
                        <button className='date-drop fr ai-c spl'>
                            <svg className='check' fill="#000" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" 
                                    d="M13.6189 4.95204L6.33356 12.2374L2.71484 8.6187L3.95228 7.38127L6.33356 9.76255L12.3815 3.7146L13.6189 4.95204Z" 
                                    fill="var(--rh__text-color)" fillRule="evenodd" />                            
                            </svg>
                            <div>
                                {dDate}
                            </div>
                        </button>
                        :
                        <button onClick={() => {
                            setDate(props.dates[d])
                            setDrop(false)}} className='date-drop lpl'>
                            {dDate}
                        </button>
                    }
                </div>
            )
        }

        return (
            <div className='options-drop b'>
                {dates}
            </div>
        )
    }

    const dropDownButton = () => {
        return (
            <button onClick={() => {
                setDrop(!drop)
                scrollTo()
            }} className="date-drop b f ai-c jc-s">
                <div className="metric">{formatDate(date)}</div>
                <svg className="dropper" fill="none" height="16" role="img" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.50024 6L7.99953 2L11.5002 6H4.50024Z" stroke="#000" fill="#000"></path>
                    <path d="M11.4998 10L8.00047 14L4.49976 10H11.4998Z" stroke="#000" fill="#000"></path>
                </svg>
            </button>
        )
    }

    const selected = {'background-color': 'rgb(202, 202, 202'}

    if (props.dates !== null && date == null) {
        setDate(props.dates[0])
    }
    /*
    if ((option == 'call' && props.call == null) || (option == 'put' && props.put == null)) {
        return <Loader page={true}/>
    }
    else {*/
    if (date == null) {
        return <Loader page={false}/>
    }
    else {
        return (
            <div className='options fc'>
                <div className='fr ai-c jc-s'>
                    <div className='options-btns fr b'>
                        <button style={type == 'buy' ? selected : null} onClick={() => setType('buy')} className='options-btn lft br fr ai-c jc-c'>Buy</button>
                        <button style={type == 'sell' ? selected : null} onClick={() => setType('sell')} className='options-btn rght fr ai-c jc-c'>Sell</button>
                    </div>
                    <div className='options-btns fr b'>
                        <button style={option == 'call' ? selected : null} onClick={() => setOption('call')} className='options-btn lft br fr ai-c jc-c'>Call</button>
                        <button style={option == 'put' ? selected : null} onClick={() => setOption('put')} className='options-btn rght fr ai-c jc-c'>Put</button>
                    </div>
                    <Dropdown drop={drop} menu={dropDown()} button={dropDownButton()} dropChange={handleDrop}/>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    call: state.securities.call,
    put: state.securities.put,
    dates: state.securities.dates
})

export default connect(mapStateToProps, { optionsPrices, dateRange })(Options)