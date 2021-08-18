/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
// import './game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchGames } from '../../../actions/game'
import ButtonLoader from '../Tools/ButtonLoader'



function SearchFilters(props) {
    const start_amounts = ['$50,000', '$100,000', '$250,000', '$500,000', '$1,000,000']
    const commission_list = ['$0.99', '$1.99', '$2.99', '$3.99', '$4.99', '$5.99', '$6.99', '$7.99', '$8.99', '$9.99', '$10.99', '$11.99', '$12.99', '$13.99', '$14.99', '$15.99', '$16.99', '$17.99', '$18.99', '$19.99']
    const [amounts, setAmounts] = useState(start_amounts)
    const [commissions, setCommissions] = useState(commission_list)
    const [dropAmount, setDropAmount] = useState(false)
    const [dropCommission, setDropCommission] = useState(false)
    const [date, setDate] = useState(true)
    const [showDate, setShowDate] = useState(false)
    const [anyTime, setAnyTime] = useState(true)
    const [anyDate, setAnyDate] = useState(true)
    const [duration, setDuration] = useState(true)
    const [showDuration, setShowDuration] = useState(false)
    const [options, setOptions] = useState(true)
    const [bet, setBet] = useState(false)
    const [showBet, setShowBet] = useState(false)
    const [minBet, setMinBet] = useState(null)
    const [maxBet, setMaxBet] = useState(null)
    const [anyBet, setAnyBet] = useState(true)
    const [crypto, setCrypto] = useState('any')
    //DATE
    const [hour, setHour] = useState(1)
    const [min, setMin] = useState('00')
    const [type, setType] = useState('AM')
    const [dateMetric, setDateMetric] = useState(null)
    const [minDate, setMinDate] = useState(null)
    const [max, setMax] = useState(null)
    //DURATION
    const [days, setDays] = useState('')
    const [anyDay, setAnyDay] = useState(true)
    const [hours, setHours] = useState('')
    const [anyHour, setAnyHour] = useState(true)
    const [mins, setMins] = useState('')
    const [anyMin, setAnyMin] = useState(true)
    const minutes = [0, 15, 30, 45]

    SearchFilters.propTypes = {
        searchGames: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        making_search: PropTypes.array,
    }

    if (dateMetric == null) {
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

        setHour(Hour)
        setMax((year + 1) + '-' + month + '-' + day)
        setMinDate(year + '-' + month + '-' + day)
        setDateMetric(year + '-' + month + '-' + day)
    }

    const dropper_up = (
        <svg className='filter-dropper-up' height='10' width='20'>
            <g>
                <path d='M0 10L10 1L20 10' fill='none'></path>
            </g>
        </svg>
    )

    const dropper_down = (
        <svg className='filter-dropper-down' height='10' width='20'>
            <g>
                <path d='M0 0L10 9L20 0' fill='none'></path>
            </g>
        </svg>
    )

    const makeSearch = () => {
        var start = amounts
        if (amounts.length == 0 || amounts.length == 5) {
            start = 'any'
        }

        var commission = commissions
        if (commissions.length == 0 || commissions.length == 20) {
            commission = 'any'
        }

        var ebet = null
        if (bet) {
            if (anyBet) {
                ebet = {
                    amount: 'any',
                    crypto: crypto
                }
            }
            else {
                ebet = {
                    amount: {
                        min: minBet,
                        max: maxBet
                    },
                    crypto: crypto
                }
            }
        }

        var dateFilter = null
        if (date) {
            var timeFilter = {
                hour: 'any',
                mins: 'any',
                type: 'any'
            }
            if (!anyTime) {
                timeFilter = {
                    hour: hour,
                    mins: min,
                    type: type
                }
            }

            var calender = {
                month: 'any',
                day: 'any',
                year: 'any'
            }

            if (!anyDate) {
                var dateMonth = Number(dateMetric.substring(5, 7))
                var dateDay = Number(dateMetric.substring(8))
                var dateYear = Number(dateMetric.substring(0,4))

                calender = {
                    month: dateMonth,
                    day: dateDay,
                    year: dateYear
                }
            }

            dateFilter = {
                min: timeFilter.mins,
                hour: timeFilter.hour,
                type: timeFilter.type,
                month: calender.month,
                day: calender.day,
                year: calender.year
            }
        }

        var durationFilter = null
        if (duration) {
            var daysFilter = 'any'
            if (!anyDay) {
                daysFilter = days
            }

            var hoursFilter = 'any'
            if (!anyHour) {
                hoursFilter = hours
            }

            var minFilter = 'any'
            if (!anyMin) {
                minFilter = mins
            }

            durationFilter = {
                days: daysFilter,
                hours: hoursFilter,
                mins: minFilter
            }
        }

        var parameters = {
            amounts: start,
            commission: commission,
            ebet: ebet,
            date: dateFilter,
            duration: durationFilter,
            options: options
        }

        props.searchGames(parameters)
    }

    const amountClick = (amount) => {
        if (amounts.includes(amount)) {            
            setAmounts(amounts.filter(e => e !== amount))
        }
        else {
            var temp_amounts = amounts
            temp_amounts.push('')
            temp_amounts.push(amount)
            setAmounts(temp_amounts)
            setAmounts(temp_amounts.filter(e => e !== ''))
        }
    }

    const amount_selected = (amount) => {
        if (amounts.includes(amount)) {
            return <button onClick={() => amountClick(amount)} className='checked fr jc-c ai-c f18 bld'>&#10003;</button>
        }
        else {
            return <button onClick={() => amountClick(amount)} className='check-box'/>
        }
    }

    const get_amounts = () => {
        var options = []
        for (const amount in start_amounts) {
            options.push(
                <div className='fr ttmy ai-c jc-st'>
                    {amount_selected(start_amounts[amount])}
                    <div className='sml'>{start_amounts[amount]}</div>
                </div>
            )
        }
        return options
    }

    const commissionClick = (commission) => {
        if (commissions.includes(commission)) {            
            setCommissions(commissions.filter(e => e !== commission))
        }
        else {
            var temp_commissions = commissions
            temp_commissions.push('')
            temp_commissions.push(commission)
            setCommissions(temp_commissions)
            setCommissions(temp_commissions.filter(e => e !== ''))
        }
    }

    const commission_selected = (commission) => {
        if (commissions.includes(commission)) {
            return <button onClick={() => commissionClick(commission)} className='checked fr jc-c ai-c f18 bld'>&#10003;</button>
        }
        else {
            return <button onClick={() => commissionClick(commission)} className='check-box'/>
        }
    }

    const get_commissions = () => {
        var options = []
        for (const commission in commission_list) {
            options.push(
                <div className='fr ttmy ai-c jc-st'>
                    {commission_selected(commission_list[commission])}
                    <div className='sml'>{commission_list[commission]}</div>
                </div>
            )
        }

        return options
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

    const handleNone = (isDate) => {
        if (isDate) {
            if (!duration && date) {
                setDuration(true)
                setDate(false)
            }
            else {
                setDate(!date)
            }
        }
        else {
            if (duration && !date) {
                setDuration(false)
                setDate(true)
            }
            else {
                setDuration(!duration)
            }
        }
    }

    const Duration = () => {
        return (
            <div className='smx smy'>
                <div className='fr jc-s ai-c'>
                    <div className='fr ai-c jc-s'>
                        <div className='f18 bld'>Duration</div>
                        {duration ? 
                            <button onClick={() => handleNone(false)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                            :
                                
                            <button onClick={() => handleNone(false)} className='sml check-box'/>
                        }
                    </div>
                    <div className='fr ai-c'>
                        {!duration ? null :
                            showDuration ? 
                                <div className='fr ai-c'>
                                    <button className='sml' onClick={() => setShowDuration(false)}>{dropper_up}</button> 
                                </div>                                    
                                :
                                <button onClick={() => setShowDuration(true)}>{dropper_down}</button> 
                        }                                
                    </div>    
                </div> 
                {duration && showDuration ? 
                    <div className='fr smmt jc-c ai-c'>
                        <div className='duration-filter fr ai-c jc-s'>
                            <div className='fc ai-c'>
                                <div className='duration'><button onClick={() => setAnyDay(!anyDay)}>{anyDay ? 'Any' : 'Days'}</button></div>
                                {anyDay ? <div className='anyHour' /> : <input onChange={(e) => setDays(e.target.value)} className='duration-input' placeholder="0" type='number' />}               
                            </div>
                            <div className='fc ai-c smx'>
                                <div className='duration'><button onClick={() => setAnyHour(!anyHour)}>{anyHour ? 'Any' : 'Hours'}</button></div>
                                {anyHour ? <div className='anyHour' /> : <input onChange={(e) => setHours(e.target.value)} className='duration-input' placeholder="0" type='number' /> }                   
                            </div>
                            <div className='fc ai-c'>
                                <div className='duration'><button onClick={() => setAnyMin(!anyMin)}>{anyMin ? 'Any' : 'Mins'}</button></div>
                                {anyMin ? <div className='anyMin' /> :
                                    <select className='min-input' placeholder="0" onChange={(e) => setMins(e.target.value)}>
                                        {
                                            minutes.map(min => {
                                                return <option className='min-option' value={min}>{min}</option>
                                            })
                                        }
                                    </select>}                    
                            </div>
                        </div>
                    </div>
                    : null
                }                             
            </div>
        )
    }

    const Ebet = () => {
        return (
            <div>
                <div className='smx smy'>
                    <div className='fr jc-s ai-c'>
                        <div className='fr ai-c jc-s'>
                            <div className='f18 bld'>E-Bet</div>
                            {bet ? 
                                <button onClick={() => setBet(false)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                                :
                            
                                <button onClick={() => setBet(true)} className='sml check-box'/>
                            }
                        </div>
                        {!bet ? null :
                            showBet ?
                                <div className='fr ai-c'>
                                    <button className='sml' onClick={() => setShowBet(false)}>{dropper_up}</button> 
                                </div>                                    
                                :
                                <button onClick={() => setShowBet(true)}>{dropper_down}</button> 
                        }                   
                    </div>
                </div>
                {showBet && bet?
                    <div className='fc ai-c'>
                        <div className='bet-filter-any fr ai-c jc-s'>
                            <div className='fr ai-c jc-s'>
                                {anyBet ? <div className='noBet' /> :
                                    <div className='min-max fr ai-c'>
                                        <div className='money-sign fr jc-c ai-c'>$</div>                                    
                                        <input onChange={((e) => setMinBet(e.target.value))} type="number" className="min-max-filter" placeholder='Min'/>
                                    </div>
                                }
                                {anyBet ? <div className='noBet sml' /> :
                                    <div className='min-max sml fr ai-c'>
                                        <div className='money-sign fr jc-c ai-c'>$</div>                                    
                                        <input onChange={((e) => setMaxBet(e.target.value))} type="number" className="min-max-filter" placeholder='Max'/>
                                    </div>
                                }
                            </div>
                            <div className='fr ai-c'>
                                        Any
                                {anyBet ? 
                                    <button onClick={() => setAnyBet(false)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                                    :
                            
                                    <button onClick={() => setAnyBet(true)} className='sml check-box'/>
                                }
                            </div> 
                        </div> 
                        <div className='fr smmt jc-st'>
                            <select className='crypto-input' onChange={(e) => setCrypto(e.target.value)}>
                                {choices(['any', 'ETH', 'BTC', 'BNB', 'DOGE'])}
                            </select>     
                        </div>                                                                   
                    </div>
                    : null}               
            </div>
        )
    }

    const handleDate = () => {
        setAnyTime(true)
        setAnyDate(true)
    }

    const getDate = () => {
        return (
            <div className='smx smy'>
                <div className='fr jc-s ai-c'>
                    <div className='fr ai-c jc-s'>
                        <div className='f18 bld'>Date</div>
                        {date ? 
                            <button onClick={() => handleNone(true)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                            :
                                
                            <button onClick={() => handleNone(true)} className='sml check-box'/>
                        }
                    </div>
                    <div className='fr ai-c'>
                        {!date ? null :
                            showDate ?
                                <div className='fr ai-c'>
                                    <button className='sml' onClick={() => setShowDate(false)}>{dropper_up}</button> 
                                </div>                                    
                                :
                                <button onClick={() => setShowDate(true)}>{dropper_down}</button>                                     
                        }
                    </div>                                  
                </div>   
                {date && showDate ?
                    <div className='fr smmt jc-s ai-c'>
                        <div className='fc ai-st'>
                            {anyTime ? <div className='noTime'/> :
                                <div className='time-filter b fr ai-c'>
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
                            }                                
                        </div>  
                        <div className='fr ai-c'>
                                        Any
                            {anyTime ? 
                                <button onClick={() => setAnyTime(false)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                                :
                            
                                <button onClick={() => setAnyTime(true)} className='sml check-box'/>
                            }
                        </div>                                                                                                                                                                       
                    </div> 
                    : null
                }    
                {showDate && date ? 
                    <div className='fr jc-s ai-c'>
                        {anyDate ? <div className='anyDate smmt'/> : <input onChange={((e) => setDateMetric(e.target.value))} type="date" className="date-filter smmt" value={dateMetric} min={minDate} max={max}/> }
                        <div className='fr ai-c'>
                                        Any
                            {anyDate ? 
                                <button onClick={() => setAnyDate(false)} className='checked sml fr jc-c ai-c f18 bld'>&#10003;</button>
                                :
                            
                                <button onClick={() => handleDate()} className='sml check-box'/>
                            }
                        </div>       
                    </div>                              
                    : null}                                         
            </div>
        )
    }

    return (       
        <div className='filters br fc jc-s ai-s'>
            <div className='filter-choices'>
                <div className='smx smy'>
                    <div className='fr jc-s ai-c'>
                        <div className='f18 bld'>Start Amount</div>
                        <button onClick={() => setDropAmount(!dropAmount)}>{dropAmount ? dropper_up: dropper_down}</button> 
                    </div>                                               
                    <div className='fc ai-st'>
                        {dropAmount ? get_amounts() : null}
                    </div>
                </div>
                <div className='smx smy'>
                    <div className='fr jc-s ai-c'>
                        <div className='f18 bld'>Commission</div>
                        <button onClick={() => setDropCommission(!dropCommission)}>{dropCommission ? dropper_up : dropper_down}</button> 
                    </div>        
                    <div className='droppable fc ai-st'>
                        {dropCommission ? get_commissions() : null}
                    </div>
                </div>
                {Ebet()}                         
                {getDate()} 
                {Duration()}                                       
                <div className='smx smy'>
                    <div className='fr jc-s ai-c'>
                        <div className='f18 bld'>Options</div>
                        <button onClick={() => setOptions(!options)} className='options-filter'>{options ? 'Enabled' : 'Disabled'}</button>           
                    </div>
                </div>  
            </div>
            <div className='fr jc-c mmy'>
                <button onClick={() => makeSearch()} className='editButton'>{props.making_search ? <ButtonLoader/> : 'Search'}</button>
            </div>                    
        </div>   
    )
}


const mapStateToProps = (state) => ({
    making_search: state.game.making_search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames })(SearchFilters)