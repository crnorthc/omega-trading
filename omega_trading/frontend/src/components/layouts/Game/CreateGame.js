<<<<<<< HEAD
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




function CreateGame(props) {

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

    CreateGame.propTypes = {
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
            <div className='b lmt'>
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
=======
/* eslint-disable indent */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, Fragment } from "react";
import { createGame, editGame, joinGame } from "../../../actions/game";
import Loader from "../Tools/Loader";
import { Link } from "react-router-dom";
import Bet from "./Bet";
import ButtonLoader from "../Tools/ButtonLoader";
import {
  Tab,
  Switch,
  RadioGroup,
  Listbox,
  Transition,
} from "@headlessui/react";
import {
  CheckIcon,
  SelectorIcon,
  ArrowSmRightIcon,
} from "@heroicons/react/solid";

// import './Rules.scss'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

const startAmounts = [
  { insert: "$10,000", value: 10000 },
  { insert: "$100,000", value: 100000 },
  { insert: "$500,000", value: 500000 },
  { insert: "$1,000,000", value: 1000000 },
];

const commisionAmounts = [
  { insert: "$1.99", value: 1.99 },
  { insert: "$10,000", value: 10000 },
  { insert: "$10,000", value: 10000 },
];

const hours = [
  { insert: "0", value: 0 },
  { insert: "1", value: 1 },
  { insert: "2", value: 2 },
  { insert: "3", value: 3 },
  { insert: "4", value: 4 },
  { insert: "5", value: 5 },
  { insert: "6", value: 6 },
  { insert: "7", value: 7 },
  { insert: "8", value: 8 },
  { insert: "9", value: 9 },
  { insert: "10", value: 10 },
  { insert: "11", value: 11 },
  { insert: "12", value: 12 },
  { insert: "13", value: 13 },
  { insert: "14", value: 14 },
  { insert: "15", value: 15 },
  { insert: "16", value: 16 },
  { insert: "17", value: 17 },
  { insert: "18", value: 18 },
  { insert: "19", value: 19 },
  { insert: "20", value: 20 },
  { insert: "21", value: 21 },
  { insert: "22", value: 22 },
  { insert: "23", value: 23 },
  { insert: "24", value: 24 },
];
const minutes = [
  { insert: "0", value: 0 },
  { insert: "15", value: 15 },
  { insert: "30", value: 30 },
  { insert: "45", value: 45 },
];

const cryptoCurrencies = ["ETH"];
function JoinGame(props) {
  const [name, setName] = useState("");
  const [Public, setPublic] = useState(true);
  const [options, setOptions] = useState(true);
  const [show, Show] = useState(false);
  const [startAmount, setStartAmount] = useState(startAmounts[0]);
  const [cryptoCurrency, setCryptoCurrency] = useState(cryptoCurrencies[0]);
  // const [day, setDay] = useState(days[0])
  const [hour, setHour] = useState(hours[0]);
  const [minute, setMinute] = useState(minutes[0]);

  JoinGame.propTypes = {
    createGame: PropTypes.func.isRequired,
    joinGame: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    creating_game: PropTypes.bool,
    game_created: PropTypes.bool,
    user: PropTypes.object,
    game: PropTypes.object,
  };

  //    if (date !== null) {
  return (
    <>
      <div className='z-10 absolute top-16 right-0 bottom-2/3 left-0 flex items-center justify-center'>
        <h1 className='font-mono font-medium text-red-700 text-center text-4xl sm:text-6xl '>
          Create Game
        </h1>
      </div>

      <div className='z-10 absolute top-1/3 right-0 bottom-0 left-0 flex items-start justify-center '>
        <div className='mx-2 w-full sm:w-4/5 '>
          <div className='mx-auto max-w-4xl rounded-xl bg-red-200 p-4'>
            <div className='grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-y-10 '>
              <div className='col-span-12 sm:col-span-8'>
                <label className='block font-medium' htmlFor=''>
                  Name
                </label>
                <input
                  className='block w-full text-sm shadow-sm h-10 px-2 border-transparent focus:outline-none focus:ring focus:ring-red-300'
                  placeholder="ex: Sabean's Tatties"
                  onChange={(e) => setName(e.target.value)}
                  type='text'
                />
              </div>
              <div className='col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col'>
                <Switch.Group>
                  <Switch.Label className='block font-medium' htmlFor=''>
                    {Public ? "Public" : "Private"}
                  </Switch.Label>

                  <Switch
                    checked={Public}
                    onChange={setPublic}
                    className={`${
                      Public ? "bg-green-500" : "bg-red-500"
                    } shadow-md
relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={`${Public ? "translate-x-10" : "translate-x-0"}
pointer-events-none inline-block h-9 w-9 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                  </Switch>
                </Switch.Group>
              </div>
              <div className='col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col'>
                <Switch.Group>
                  <Switch.Label className='block font-medium' htmlFor=''>
                    {options ? "Options" : "No Options"}
                  </Switch.Label>

                  <Switch
                    checked={options}
                    onChange={setOptions}
                    className={`${
                      options ? "bg-green-500" : "bg-red-500"
                    } shadow-md
relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span className='sr-only'>Use setting</span>
                    <span
                      aria-hidden='true'
                      className={`${
                        options ? "translate-x-10" : "translate-x-0"
                      }
pointer-events-none inline-block h-9 w-9 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                  </Switch>
                </Switch.Group>
              </div>
              <div className='col-span-12 sm:col-span-6'>
                <label className='block font-medium' htmlFor=''>
                  Start Amount
                </label>
                <Listbox value={startAmount} onChange={setStartAmount}>
                  <div className='relative mt-1'>
                    <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none  sm:text-sm'>
                      <span className='block truncate'>
                        {startAmount.insert}
                      </span>
                      <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <SelectorIcon
                          className='w-5 h-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave='transition ease-in duration-100'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm'>
                        {startAmounts.map((startAmount, startAmountIdx) => (
                          <Listbox.Option
                            key={startAmountIdx}
                            className={({ active }) =>
                              `${
                                active
                                  ? "text-green-900 bg-green-100"
                                  : "text-gray-900"
                              }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                            }
                            value={startAmount}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {startAmount.insert}
                                </span>
                                {selected ? (
                                  <span
                                    className={`${
                                      active
                                        ? "text-amber-600"
                                        : "text-amber-600"
                                    }
absolute inset-y-0 left-0 flex items-center pl-3`}
                                  >
                                    <CheckIcon
                                      className='w-5 h-5'
                                      aria-hidden='true'
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div className='col-span-12 sm:col-span-6'>
                <label className='block font-medium' htmlFor=''>
                  Commision
                </label>
                {/* <Listbox value={selected} onChange={setSelected2}>
                  <div className='relative mt-1'>
                    <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                      <span className='block truncate'>{selected.name}</span>
                      <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                        <SelectorIcon
                          className='w-5 h-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave='transition ease-in duration-100'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm'>
                        {people.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `${
                                active
                                  ? "text-green-900 bg-green-100"
                                  : "text-gray-900"
                              }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                            }
                            value={person}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {person.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={`${
                                      active
                                        ? "text-amber-600"
                                        : "text-amber-600"
                                    }
absolute inset-y-0 left-0 flex items-center pl-3`}
                                  >
                                    <CheckIcon
                                      className='w-5 h-5'
                                      aria-hidden='true'
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox> */}
              </div>
              <div className='col-span-12 sm:col-span-6'>
                <Tab.Group>
                  <label className='block font-medium pb-2' htmlFor=''>
                    Duration
                  </label>
                  <Tab.List className='flex items-start justify-start pb-2'>
                    <span className='flex shadow-md rounded-md'>
                      <Tab
                        className={({ selected }) =>
                          `${
                            selected
                              ? "bg-white text-gray-900"
                              : " text-red-900"
                          }
    p-2 rounded-l-lg`
                        }
                      >
                        Date
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `${
                            selected
                              ? "bg-white text-gray-900"
                              : " text-red-900"
                          }
    p-2 rounded-r-lg`
                        }
                      >
                        Timer
                      </Tab>
                    </span>
                  </Tab.List>

                  <Tab.Panels>
                    <Tab.Panel>
                      <div className='flex flex-row items-center justify-start space-x-2'>
                        <input
                          className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
                          type='date'
                        ></input>
                        <input
                          className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
                          type='time'
                        ></input>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className='flex items-center justify-start space-x-2'>
                        <Listbox
                          value={hour}
                          onChange={setHour}
                          className='flex-1 relative'
                        >
                          <div className='relative mt-1'>
                            <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                              <span className='block truncate'>
                                {hour.insert} hours
                              </span>
                              <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                <SelectorIcon
                                  className='w-5 h-5 text-gray-400'
                                  aria-hidden='true'
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave='transition ease-in duration-100'
                              leaveFrom='opacity-100'
                              leaveTo='opacity-0'
                            >
                              <Listbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm'>
                                {hours.map((theHour, hourIdx) => (
                                  <Listbox.Option
                                    key={hourIdx}
                                    className={({ active }) =>
                                      `${
                                        active
                                          ? "text-green-900 bg-green-100"
                                          : "text-gray-900"
                                      }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={theHour}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          } block truncate`}
                                        >
                                          {theHour.insert}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`${
                                              active
                                                ? "text-amber-600"
                                                : "text-amber-600"
                                            }
absolute inset-y-0 left-0 flex items-center pl-3`}
                                          >
                                            <CheckIcon
                                              className='w-5 h-5'
                                              aria-hidden='true'
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>

                        <Listbox
                          value={minute}
                          onChange={setMinute}
                          className='flex-1 relative'
                        >
                          <div className='relative mt-1'>
                            <Listbox.Button className='relative h-10 w-full py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                              <span className='block truncate'>
                                {minute.insert} minutes
                              </span>
                              <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                <SelectorIcon
                                  className='w-5 h-5 text-gray-400'
                                  aria-hidden='true'
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave='transition ease-in duration-100'
                              leaveFrom='opacity-100'
                              leaveTo='opacity-0'
                            >
                              <Listbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm'>
                                {minutes.map((theMinute, minuteIdx) => (
                                  <Listbox.Option
                                    key={minuteIdx}
                                    className={({ active }) =>
                                      `${
                                        active
                                          ? "text-green-900 bg-green-100"
                                          : "text-gray-900"
                                      }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                    }
                                    value={theMinute}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          } block truncate`}
                                        >
                                          {theMinute.insert}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`${
                                              active
                                                ? "text-amber-600"
                                                : "text-amber-600"
                                            }
absolute inset-y-0 left-0 flex items-center pl-3`}
                                          >
                                            <CheckIcon
                                              className='w-5 h-5'
                                              aria-hidden='true'
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
              <div className='col-span-12 sm:col-span-6'>
                <Tab.Group>
                  <label className='block font-medium pb-2' htmlFor=''>
                    Crypto Bet
                  </label>
                  <Tab.List className='flex items-start justify-start pb-2'>
                    <span className='flex shadow-md rounded-md'>
                      <Tab
                        className={({ selected }) =>
                          `${
                            selected
                              ? "bg-white text-gray-900"
                              : " text-red-900"
                          }
    p-2 rounded-l-lg`
                        }
                      >
                        Active
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `${
                            selected
                              ? "bg-white text-gray-900"
                              : " text-red-900"
                          }
    p-2 rounded-r-lg`
                        }
                      >
                        Disabled
                      </Tab>
                    </span>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className='flex items-center justify-center space-x-2'>
                        <div className='relative rounded-md shadow-sm flex-1'>
                          <input
                            type='number'
                            name='price'
                            id='price'
                            className='h-10 text-sm border-transparent focus:outline-none focus:ring focus:ring-red-300 block w-full pl-2 pr-12 sm:text-sm  rounded-md'
                            placeholder='0.000'
                          />
                          <div className='absolute inset-y-0 right-0 flex items-center'>
                            <label htmlFor='currency' className='sr-only'>
                              Currency
                            </label>
                            <Listbox
                              value={cryptoCurrency}
                              onChange={setCryptoCurrency}
                            >
                              <div className='relative'>
                                <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                                  <span className='block truncate'>
                                    {cryptoCurrency}
                                  </span>
                                  <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                    <SelectorIcon
                                      className='w-5 h-5 text-gray-400'
                                      aria-hidden='true'
                                    />
                                  </span>
                                </Listbox.Button>
                                <Transition
                                  as={Fragment}
                                  leave='transition ease-in duration-100'
                                  leaveFrom='opacity-100'
                                  leaveTo='opacity-0'
                                >
                                  <Listbox.Options className='z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm'>
                                    {cryptoCurrencies.map(
                                      (crypto, cryptoIndex) => (
                                        <Listbox.Option
                                          key={cryptoIndex}
                                          className={({ active }) =>
                                            `${
                                              active
                                                ? "text-green-900 bg-green-100"
                                                : "text-gray-900"
                                            }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                          }
                                          value={crypto}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <span
                                                className={`${
                                                  selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                                } block truncate`}
                                              >
                                                {crypto}
                                              </span>
                                              {selected ? (
                                                <span
                                                  className={`${
                                                    active
                                                      ? "text-amber-600"
                                                      : "text-amber-600"
                                                  }
absolute inset-y-0 left-0 flex items-center pl-3`}
                                                >
                                                  <CheckIcon
                                                    className='w-5 h-5'
                                                    aria-hidden='true'
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      )
                                    )}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </Listbox>
                          </div>
                        </div>
                        <ArrowSmRightIcon
                          className='w-5 h-5 text-red-900'
                          aria-hidden='true'
                        />
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <span className='text-gray-500 sm:text-sm'>$</span>
                          </div>
                          <input
                            type='text'
                            name='price'
                            id='price'
                            disabled
                            className='h-10 border-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-20 pl-7 pr-2 rounded-md text-sm  bg-white'
                            placeholder='0.00'
                          />
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <button className='block bg-red-700 text-white text-xl sm:text-2xl py-4 px-7 mt-10 mb-32 rounded-lg shadow-md'>
              Create Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
>>>>>>> stylinit
}

const mapStateToProps = (state) => ({
<<<<<<< HEAD
    creating_game: state.game.creating_game,
    game_created: state.game.game_created,
    user: state.user.user,
    game: state.game.game
})

export default connect(mapStateToProps, { createGame, editGame, joinGame })(CreateGame)
=======
  creating_game: state.game.creating_game,
  game_created: state.game.game_created,
  user: state.user.user,
  game: state.game.game,
});

export default connect(mapStateToProps, { createGame, editGame, joinGame })(
  JoinGame
);
>>>>>>> stylinit
