/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchGames, searchNameCode } from '../../../actions/game'



function SearchGame(props) {

    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [join, setJoin] = useState('code')
    const [amount, setAmount] = useState({from: 0, to:0})
    const [positions, setPositions] = useState({from: 0, to:0})
    const [bet, setBet] = useState({from: 0, to:0})
    const [betType, changeBet] = useState('bet')
    const [days, setDays] = useState({from: 0, to:0})
    const [hours, setHours] = useState({from: 0, to:0})
    const [mins, setMins] = useState({from: 0, to:0})
    const [amountError, setamountError] = useState(false)
    const [betError, setbetError] = useState(false)
    const [positionsError, setpositionsError] = useState(false)
    const [durationError, setdurationError] = useState(false)
    const [view, setView] = useState('search')


    SearchGame.propTypes = {
        searchNameCode: PropTypes.func.isRequired,
        searchGames: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        search: PropTypes.array,
    }

    useEffect(() => {
        if (props.search_made) {
            setView('results')
        }
    }, [props.search_made])

    const minutes = [0, 15, 30, 45]

    const noPositions = {
        'color': 'rgb(175, 175, 175)',
        'border-color': 'rgb(175, 175, 175)'
    }

    const selected = {
        'border-bottom': '#000 1px solid'
    }

    const notSelected = {
        'color': 'rgb(202, 202, 202)'
    }

    const error = {
        'color': 'red'
    }

    const noError = {
        'color': 'black'
    }

    const changeValue = (e, to, type) => {
        if (type == 'amount') {
            console.log(amount.from + ' to ' + amount.to)
            if (to) {
                if (Number(e) < amount.from) {
                    setamountError(true)
                }
                else {
                    setamountError(false)
                }
                setAmount({from: amount.from, to: Number(e)})
            }
            else {
                if (amount.to < Number(e)) {
                    setamountError(true)
                }
                else {
                    setamountError(false)
                }
                setAmount({from: Number(e), to: amount.to})
            }
        }
        if (type == 'bet') {
            if (to) {
                if (Number(e) < bet.from) {
                    setbetError(true)
                }
                else {
                    setbetError(false)                    
                }
                setBet({from: bet.from, to: Number(e)})
            }
            else {
                if (bet.to < Number(e)) {
                    setbetError(true)
                }
                else {
                    setbetError(false)                    
                }        
                setBet({from: Number(e), to: bet.to})        
            }
        }
        if (type == 'positions') {
            if (to) {
                if (Number(e) < positions.from) {
                    setpositionsError(true)
                }
                else {
                    setpositionsError(false)                    
                }
                setPositions({from: positions.from, to: Number(e)})
            }
            else {
                if (positions.to < Number(e)) {
                    setpositionsError(true)
                }
                else {
                    setpositionsError(false)                    
                }     
                setPositions({from: Number(e), to: positions.to})           
            }
        }
        if (type == 'days') {
            if (to) {
                setDays({from: days.from, to: Number(e)})
            }
            else {
                setDays({from: Number(e), to: days.to})
            }
        }
        if (type == 'hours') {
            if (to) {
                setHours({from: hours.from, to: Number(e)})
            }
            else {
                setHours({from: Number(e), to: hours.to})
            }
        }
        if (type == 'mins') {
            if (to) {
                setMins({from: mins.from, to: Number(e)})
            }
            else {
                setMins({from: Number(e), to: mins.to})
            }
        }
    }

    const basicSearch = () => {
        if (name != '') {
            if (code != '') {
                alert('search for either code or name')
            }
            else {
                props.searchNameCode('', name)
            }
        }
        else {
            if (code == '') {
                alert('please enter a name or code')
            }
            else {
                props.searchNameCode(code, '')
            }            
        }
    }

    const makeSearch = () => {
        var validParams = true
        if (amount.to < amount.from) {
            validParams = false
        }
        if (bet.to < bet.from) {
            validParams = false
        }
        if (positions.to < positions.from) {
            validParams = false
        }
        if (days.to < days.from) {
            setdurationError(true)            
            validParams = false
        }
        if (hours.to < hours.from) {
            if (days.to <= days.from) {
                setdurationError(true)
                validParams = false
            }            
        }
        if (mins.to < mins.from) {
            if (days.to <= days.from && hours.to <= hours.from) {
                setdurationError(true)
                validParams = false
            }            
        }
        if (validParams) {
            setdurationError(false)      
            props.searchGames({
                'amount': amount,
                'bet': bet, 
                'positions': positions,
                'days': days,
                'hours': hours,
                'mins': mins,
                'smart-bet': betType == 'smart'
            })
        }
    }

    const getGames = () => {
        var games = []

        for (const game in props.search) {
            games.push(
                <div className='fr ai-c jc-s'>
                    <div className='spl'>{props.search[game].name}</div>
                    <div className='spr'>{props.search[game].room_code}</div>
                </div>
            )
        }

        return games
    }

    const results = (
        <div>
            <div className='fr ai-c jc-s mmy lmx'>
                <div className='f24 bld'>Results</div>
                <button onClick={() => setView('search')} className='editButton'>Edit Filters</button>
            </div>
            <div className='fc bt ai-c jc-c'>
                {props.search != null ? getGames() :
                    (
                        <div className='no-history'>No games found</div>
                    )}
            </div>
        </div>        
    )

    const room_code = (
        <div className="rules fc lmy ai-c jc-a">
            <input className="codeInput f24" onChange={e => setCode(e.target.value)} placeholder="Enter Code" type="text" />             
            <button onClick={() => basicSearch()} className='editButton lmt'>Search</button>
        </div>
    )

    const searchParams = (
        <div className='lmx lmt ai-s fc jc-c'>
            <div className='fr ai-c jc-s'>
                <div className='fr ai-c jc-c'>
                    <div style={amountError ? error : noError} className='f16 bld tmx'>Start Amount</div>
                    <div className='fr ai-c jc-s'>
                        <input className="input-small" onChange={(e) => changeValue(e.target.value, false, 'amount')} placeholder='Any' type="number" min="5000" />
                        <div className='tmx'>to</div>
                        <input className="input-small" onChange={(e) => changeValue(e.target.value, true, 'amount')} placeholder='Any' type="number" min="5000" />
                    </div>
                </div>
                <div className='fr ai-c jc-c'>
                    <div className='fr ai-c jc-c'>
                        <button style={betType == 'smart' ? betError ? error : noError : notSelected} onClick={() => changeBet('smart')} className='bet-btn smx'>Smart Bet</button>
                        <button style={betType == 'bet' ? betError ? error : noError : notSelected} onClick={() => changeBet('bet')} className='bet-btn smx'>Bet</button>
                    </div>
                    <div className='fr ai-c jc-s'>
                        <input className="input-small" onChange={(e) => changeValue(e.target.value, false, 'bet')} placeholder='Any' type="number" min="5000" />
                        <div className='tmx'>to</div>
                        <input className="input-small" onChange={(e) => changeValue(e.target.value, true, 'bet')} placeholder='Any' type="number" min="5000" />
                    </div>
                </div>
            </div>
            <div className='fr smy ai-s jc-s'>
                <div className='fr ai-c jc-c'>
                    <div style={positionsError ? error : noError} className='f16 bld tmx'>Positions</div>
                    <input style={positions == '' ? noPositions : null} className="input-small" onChange={(e) => changeValue(e.target.value, false, 'positions')} placeholder='Any' type="number" min="5000" />
                    <div className='tmx'>to</div>
                    <input style={positions == '' ? noPositions : null} className="input-small" onChange={(e) => changeValue(e.target.value, true, 'positions')} placeholder='Any' type="number" min="5000" />
                </div>
                <div className='fr ai-c jc-c'>
                    <div style={durationError ? error : noError} className='f16 bld tmx'>Duration</div>
                    <div className='fr ai-c jc-s'>
                        <div className='fr ai-c jc-c'>
                            <div className='day-duration'>
                                <input onChange={(e) => changeValue(e.target.value, false, 'days')} className='duration-input-small' placeholder='0' type='number' />
                            </div>
                            <div>
                                <input onChange={(e) => changeValue(e.target.value, false, 'hours')} className='duration-input-small' placeholder='0' type='number' />
                            </div>
                            <div className='ttmx'>:</div>
                            <div>
                                <select className='min-input-small' placeholder='0' onChange={(e) => changeValue(e.target.value, false, 'mins')}>
                                    {
                                        minutes.map(min => {
                                            return <option className='min-option' value={min}>{min}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='tmx'>to</div>
                        <div className='fr ai-c jc-c'>
                            <div className='day-duration'>
                                <input onChange={(e) => changeValue(e.target.value, true, 'days')} className='duration-input-small' placeholder='0' type='number' />
                            </div>
                            <div>
                                <input onChange={(e) => changeValue(e.target.value, true, 'hours')} className='duration-input-small' placeholder='0' type='number' />
                            </div>
                            <div className='ttmx'>:</div>
                            <div>
                                <select className='min-input-small' placeholder='0' onChange={(e) => changeValue(e.target.value, true, 'mins')}>
                                    {
                                        minutes.map(min => {
                                            return <option className='min-option' value={min}>{min}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>                        
                </div>
            </div>
        </div>
    )

    const search = (
        <div className='fc'>
            {searchParams}
            <div className='fr jc-c mmy'>
                <button onClick={() => makeSearch()} className='editButton'>Search</button>
            </div>            
        </div>
    )

    return (       
        <div>
            {props.search_made && view == 'results' ? results : (
                <div>
                    <div className='fr ai-c jc-a'>
                        <button style={join == 'code' ? selected : null} onClick={() => setJoin('code')} className='f24 smmt tpb bld ai-c'>Room Code</button>
                        <button style={join == 'search' ? selected : null} onClick={() => setJoin('search')} className='f24 smmt tpb bld ai-c'>Search Games</button>
                    </div>            
                    {join == 'code' ? room_code : search}
                </div>            
            )}
        </div>
    )
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames, searchNameCode })(SearchGame)