/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Loader from '../../Tools/Loader'
import ButtonLoader from '../../Tools/ButtonLoader'
import { Duration, EndDate, EditDate, EditDuration } from './Logic'
import '../Rules.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { editGame } from '../../../../actions/game'


function NewEditRules(props) {
    const [error, setError] = useState('')
    const [amount, setAmount] = useState('$50,000')
    const [commission, setCommission] = useState(null)
    const [options, setOptions] = useState(null)    
    const [endType, setEndType] = useState(null)
    const minutes = [0, 15, 30, 45]

    NewEditRules.propTypes = {
        editGame: PropTypes.func.isRequired,
        making_edit: PropTypes.bool,
        game: PropTypes.object
    }

    const {
        days,
        changeDays,
        hours,
        changeHours,
        mins,
        changeMins
    } = Duration(props.game)

    const {
        date,
        handleDate,
        dateHour,
        changeDateHour,
        dateMin,
        changeDateMin,
        dateType,
        changeDateType,
        minimum,
        max
    } = EndDate(props.game)

    var start_amounts = ['$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000']

    const selected = {
        'background-color': 'rgb(175, 175, 175)'
    }

    const not = {
        'background-color': 'rgba(220, 220, 220)'
    }

    
    if (options == null) {      
        if (props.game.commission == null) {
            setCommission('Disabled')
        }
        else {
            setCommission('$' + props.game.commission)
        }

        if (props.game.duration == undefined) {
            setEndType('date')
        }
        else {
            setEndType('duration')
        }

        setOptions(props.game.options)
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

    const editRules = () => {
        if (endType == 'date') {
            setError('')
            var {hasError, message, comish, end_date} = EditDate({
                date,
                dateHour,
                dateMin,
                dateType,
                commission
            })

            if (!hasError) {
                props.editGame(amount, end_date, 'date', comish, options, props.game.room_code)
            }   

            setError(message)
            props.edit(hasError)
        }
        else {
            setError('')
            var {isError, message2, commish, endDate} = EditDuration({
                days,
                hours,
                mins,
                commission
            })

            if (!isError) {
                props.editGame(amount, endDate, 'duration', commish, options, props.game.room_code)
            }   

            setError(message2)
            props.edit(isError)
        }
    }

    const endDate = () => {
        return (     
            <div className='fr'>
                <input onChange={((e) => handleDate(e.target.value))} type="date" className="date-input" value={date} min={minimum} max={max}/>
                <div className='time-choice'>
                    <select className='time-input' value={dateHour} onChange={(e) => changeDateHour(e.target.value)}>
                        {choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                    </select>
                    <select className='time-input' value={dateMin} onChange={(e) => changeDateMin(e.target.value)}>
                        {choices(['00', '15', '30', '45'])}
                    </select>
                    <select className='time-input' value={dateType} onChange={(e) => changeDateType(e.target.value)}>
                        {choices(['AM', 'PM'])}
                    </select>
                </div>                     
            </div>                                                     
        )
    }

    const getDuration = () => {
        return (
            <div className='fr ai-c jc-c'>
                <div className='fc ai-st'>
                    <div className='duration'>Days</div>
                    <input onChange={(e) => changeDays(e.target.value)} className='duration-input' placeholder={days} type='number' />                    
                </div>
                <div className='fc ai-c smx'>
                    <div className='duration'>Hours</div>
                    <input onChange={(e) => changeHours(e.target.value)} className='duration-input' placeholder={hours} type='number' />                    
                </div>
                <div className='fc ai-e'>
                    <div className='duration'>Mins</div>
                    <select className='min-input' placeholder={mins} onChange={(e) => changeMins(e.target.value)}>
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
            <div className="game_rules fc jc-s">
                <div className='rules-row'>
                    <div className='parameter'>
                        <div className='rule-name-left'>Start Amount</div>
                        <select className='start-input' placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)}>
                            {choices(start_amounts)}
                        </select>
                    </div>
                    <div className='parameter'>
                        <div className='rule-name-right'>Options</div>
                        <div className='yesnoCont fr jc-s'>
                            <button style={options ? selected : not} onClick={() => setOptions(true)} className='yes'>Yes</button>
                            <button style={!options ? selected : not} onClick={() => setOptions(false)} className='no'>No</button>
                        </div>
                    </div>
                    <div className='parameter'>
                        <div className='rule-name-left'>Commision</div>
                        <select className='start-input' placeholder="0" value={commission} onChange={(e) => setCommission(e.target.value)}>
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
                        {endType == 'date' ? endDate() : getDuration()}
                    </div>                                                                         
                </div>
                <div className='fr jc-s mmy lmx'>
                    <button onClick={() => props.edit(false)} className='editButton'>Cancel</button>
                    <button onClick={() => editRules()} className='editButton'>{props.making_edit ? <ButtonLoader /> : 'Confirm'}</button>                    
                </div>
                <div className='fr jc-c f16' style={{'color': 'red'}}>{error}</div>             
            </div>
        )
    }
    else {
        return <Loader page={false} />
    }
}


const mapStateToProps = (state) => ({
    game: state.game.game,
    making_edit: state.game.making_change
})

export default connect(mapStateToProps, { editGame })(NewEditRules)