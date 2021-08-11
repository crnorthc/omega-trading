/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { createGame, editGame, joinGame } from '../../../actions/game'
import './Rules.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loader from '../Tools/Loader'
import Bet from './Bet'



function NewRules(props) {

    const [amount, setAmount] = useState('')
    const [commision, setCommision] = useState(null)
    const [date, setDate] = useState(null)
    const [hour, setHour] = useState(null)
    const [min, setMin] = useState('00')
    const [options, setOptions] = useState('yes')
    const [bet, setBet] = useState('no')
    const [type, setType] = useState('AM')
    const [max, setMax] = useState(null)
    const [zone, setZone] = useState(null)
    const [name, setName] = useState('')
    const [Public, setPublic] = useState(true)
    const [show, Show] = useState(false)

    NewRules.propTypes = {
        createGame: PropTypes.func.isRequired,
        joinGame: PropTypes.func.isRequired,
        editGame: PropTypes.func.isRequired,
        user: PropTypes.object,
        game: PropTypes.object
    }

    if (date == null) {
        const current = new Date()
        const year = current.getFullYear()

        var month = current.getMonth()
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

        var timezone = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]

        setHour(Hour)
        setZone(timezone)
        setMax((year + 1) + '-' + month + '-' + day)
        setDate(year + '-' + month + '-' + day)
    }


    const selected = {
        'background-color': 'rgb(175, 175, 175)'
    }

    const not = {
        'background-color': 'rgba(220, 220, 220)'
    }

    const commissions = () => {
        var values = ['Disabled']
        for (let i = .99; i < 20; i++) {
            values.push('$' + i.toFixed(2))
        }
        return values
    }

    var start_amounts = ['$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000']

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
                            <div className='rule-name-right'>End Date: {zone}</div>
                            <div className='fr'>
                                <input onChange={((e) => setDate(e.target.value))} type="date" className="date-input" value={date} min={date} max={max}/>
                                <div className='time-choice'>
                                    <select className='time-input' placeholder="0" value={hour} onChange={(e) => setHour(e.target.value)}>
                                        {choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
                                    </select>
                                    <select className='time-input' placeholder="0" value='00' onChange={(e) => setMin(e.target.value)}>
                                        {choices(['00', '15', '30', '45'])}
                                    </select>
                                    <select className='time-input' placeholder="0" value={type} onChange={(e) => setType(e.target.value)}>
                                        {choices(['AM', 'PM'])}
                                    </select>
                                </div>                     
                            </div>                                        
                        </div>               
                    </div>
                    <div className='rules-row'>
                        <div className='parameter'>
                            <div className='rule-name-left'>Commision</div>
                            <select className='start-input' placeholder="0" onChange={(e) => setCommision(e.target.value)}>
                                {choices(commissions())}
                            </select>
                        </div>
                        <div className='parameter'>
                            <div className='rule-name-right'>Options</div>
                            <div className='yesnoCont fr jc-s'>
                                <button style={options == 'yes' ? selected : not} onClick={() => setOptions('yes')} className='yes'>Yes</button>
                                <button style={options == 'no' ? selected : not} onClick={() => setOptions('no')} className='no'>No</button>
                            </div>
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
                            {bet =='yes' ? <button onClick={() => Show(true)} className='ruleButton'>Define</button> : null}
                        </div>
                    </div>
                </div>  
                {show ? <Bet show={showChange} /> : null}              
            </div>
        )
    }
    else {
        return <Loader page={false} />
    }
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    game: state.game.game
})

export default connect(mapStateToProps, { createGame, editGame, joinGame })(NewRules)