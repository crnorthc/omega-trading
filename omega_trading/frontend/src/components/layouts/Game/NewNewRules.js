/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { createGame, editGame, joinGame } from '../../../actions/game'
import Loader from '../Tools/Loader'
import Bet from './Bet'
import ButtonLoader from '../Tools/ButtonLoader'
import './Rules.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'




function NewNewRules(props) {

    const [amount, setAmount] = useState('$50,000')
    const [commission, setCommission] = useState(null)
    const [date, setDate] = useState(null)
    const [current, setCurrent] = useState(null)
    const [options, setOptions] = useState(true)
    const [bet, setBet] = useState('no')
    const [type, setType] = useState('AM')
    const [max, setMax] = useState(null)
    const [name, setName] = useState('')
    const [Public, setPublic] = useState(true)
    const [show, Show] = useState(false)
    const [endType, setEndType] = useState('date')
    // Date
    const [end, setEnd] = useState(null)
    const [hour, setHour] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [min, setMin] = useState('00')
    //Duration
    const [days, setDays] = useState('')
    const [hours, setHours] = useState('')
    const [mins, setMins] = useState('')
    const minutes = [0, 15, 30, 45]

    var start_amounts = ['$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000']

    NewNewRules.propTypes = {
        createGame: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        editGame: PropTypes.func.isRequired,
        creating_game: PropTypes.bool,
        game_created: PropTypes.bool,
        user: PropTypes.object,
        game: PropTypes.object
    }

    const selected = {
        'background-color': 'rgb(175, 175, 175)'
    }

    const not = {
        'background-color': 'rgba(220, 220, 220)'
    }

    if (date == null) {
        const current = new Date()
        const year = current.getFullYear()

        var month = current.getMonth() + 1
        if (month.toString().length == 1) {
            month = '0' + month
        }

        var day = current.getDate()
        if (day.toString().length == 1) {
            day = '0' + day
        }

        var Hour = current.getHours() + 1
        
        if (Hour > 12) {
            Hour = Hour - 12
            setType('PM')
        }

        setCurrent((Date.now() / 1000).toFixed(0))
        setHour(Hour)
        setMax((year + 1) + '-' + month + '-' + day)
        setMinDate(year + '-' + month + '-' + day)
        setDate(year + '-' + month + '-' + day)
    }

    const commissions = () => {
        var values = ['Disabled']
        for (let i = .99; i < 20; i++) {
            values.push('$' + i.toFixed(2))
        }
        return values
    }

    const choices = (values) => {
        var choices = []
        
        for(const value in values) {
            choices.push(
                <option value={values[value]}>{values[value]}</option>
            )
        }
        return choices
    }

    const showChange = () => {
        Show(false)
    }

    const handleDate = (date) => {
        var month = Number(date.substring(5, 7))
        var day = Number(date.substring(8))
        var year = Number(date.substring(0,4))
        
        setEnd({
            year: year,
            month: month,
            day: day
        })
        setDate(date)
    }

    const checkDate = () => {
        var end_hour = Number(hour)
        if (type =='PM') {
            end_hour += 12
        }

        var end_time = (new Date(end.year, (end.month - 1), end.day, end_hour, Number(min)).getTime() / 1000).toFixed(0)

        if (end_time - current <= 43200) {
            return false
        }
        else {
            return true
        }
    }

    const create = () => {
        if (name != '') {
            var comish = commission
            if (commission == 'Disabled') {
                comish = null
            }

            if (endType == 'date') {
                if (checkDate()) {
                    var end_date = {
                        year: end.year,
                        month: end.month,
                        day: end.day,
                        hour: Number(hour),
                        min: Number(min),
                        type: type
                    }
                }
            }
            else {
                end_date = {
                    days: Number(days),
                    hours: Number(hours),
                    mins: Number(mins)
                }
            }
                
            props.createGame(amount, bet, comish, end_date, endType, name, Public, options)
            
        }
    }

    const endDate = () => {
        return (     
            <div className='fr'>
                <input onChange={((e) => handleDate(e.target.value))} type="date" className="date-input" value={date} min={minDate} max={max}/>
                <div className='time-choice'>
                    <select className='time-input' value={hour} onChange={(e) => setHour(e.target.value)}>
                        {choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                    </select>
                    <select className='time-input' value={min} onChange={(e) => setMin(e.target.value)}>
                        {choices(['00', '15', '30', '45'])}
                    </select>
                    <select className='time-input' value={type} onChange={(e) => setType(e.target.value)}>
                        {choices(['AM', 'PM'])}
                    </select>
                </div>                     
            </div>                                                     
        )
    }

    const Duration = () => {
        return (
            <div className='fr ai-c jc-c'>
                <div className='fc ai-st'>
                    <div className='duration'>Days</div>
                    <input onChange={(e) => setDays(e.target.value)} className='duration-input' placeholder="0" type='number' />                    
                </div>
                <div className='fc ai-c smx'>
                    <div className='duration'>Hours</div>
                    <input onChange={(e) => setHours(e.target.value)} className='duration-input' placeholder="0" type='number' />                    
                </div>
                <div className='fc ai-e'>
                    <div className='duration'>Mins</div>
                    <select className='min-input' placeholder="0" onChange={(e) => setMins(e.target.value)}>
                        {
                            minutes.map(min => {
                                return <option className='min-option' value={min}>{min}</option>
                            })
                        }
                    </select>                    
                </div>
            </div>
        )
        
    }

    if (date !== null) {
        return (
            <div>
                <div className='first-rule'>     
                    <div className='parameter'>
                        <div className='rule-name-left'>Name</div>
                        <input className="name-input" onChange={(e) => setName(e.target.value)} type="text"/>
                    </div>           
                    <div className='parameter'>
                        <div className='rule-name-right' />
                        <button onClick={() => setPublic(!Public)} className='ruleButton'>{Public ? 'Public' : 'Private'}</button>
                    </div>
                
                </div>
                <div className='sub-rules'>
                    <div className='rules-row'>
                        <div className='parameter'>
                            <div className='rule-name-left'>Start Amount</div>
                            <select className='start-input' placeholder="0" onChange={(e) => setAmount(e.target.value)}>
                                {choices(start_amounts)}
                            </select>
                        </div>
                        <div className='parameter'>
                            <div className='fr jc-c tpb'>Options</div>
                            <div className='yesnoCont fr jc-s'>
                                <button style={options ? selected : not} onClick={() => setOptions(true)} className='yes'>Yes</button>
                                <button style={!options ? selected : not} onClick={() => setOptions(false)} className='no'>No</button>
                            </div>
                        </div>
                        <div className='parameter'>
                            <div className='rule-name-right'>Commision</div>
                            <select className='start-input' placeholder="0" onChange={(e) => setCommission(e.target.value)}>
                                {choices(commissions())}
                            </select>
                        </div>                        
                    </div>
                    <div className='rules-row'>
                        <div className='parameter'> 
                            <div className='rule-name-left'>End On</div>
                            <div className='yesnoCont fr jc-s'>
                                <button style={endType == 'date' ? selected : not} onClick={() => setEndType('date')} className='yes'>Date</button>
                                <button style={endType == 'duration' ? selected : not} onClick={() => setEndType('duration')} className='no'>Timer</button>
                            </div>    
                        </div>  
                        <div className='parameter'>
                            {endType == 'date' ? endDate() : Duration()}
                        </div>                                                                         
                    </div>
                                
                    <div className='rules-row'>
                        <div className='parameter'>
                            <div className='rule-name-left'>E-Bet</div>
                            <div className='yesnoCont fr jc-s'>
                                <button style={bet == 'yes' ? selected : not} onClick={() => setBet('yes')} className='yes'>Yes</button>
                                <button style={bet == 'no' ? selected : not} onClick={() => setBet('no')} className='no'>No</button>
                            </div>
                        </div>
                        <div className='parameter'>
                            {bet =='yes' ? <button onClick={() => Show(true)} className='ruleButton'>Define</button> : <button className='ruleButton-hidden'>Define</button>}
                        </div>
                    </div>
                </div>  
                {show ? <Bet show={showChange} /> : null}
                <div className='fr jc-c mmy'>
                    <button onClick={() => create()} className='editButton'>{props.creating_game ? <ButtonLoader /> : 'Create'}</button>
                </div>              
            </div>
        )
    }
    else {
        return <Loader page={false} />
    }
}


const mapStateToProps = (state) => ({
    creating_game: state.game.creating_game,
    game_created: state.game.game_created,
    user: state.user.user,
    game: state.game.game
})

export default connect(mapStateToProps, { createGame, editGame, joinGame })(NewNewRules)