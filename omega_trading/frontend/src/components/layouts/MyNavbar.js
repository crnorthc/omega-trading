/* eslint-disable react/jsx-key */
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchSymbols } from '../../actions/securities.js'
import { logout } from '../../actions/auth.js'

// Styling stuff 
import { Listbox, Transition } from "@headlessui/react";
import {
  SelectorIcon,
  CheckIcon,
  UserCircleIcon,
  SearchIcon,
  SparklesIcon,
  ViewListIcon,
  StarIcon,
} from "@heroicons/react/outline";

// --------------------------------

const people = [
  { name: "No Game" },
  { name: "Fuck Matt Medhurst" },
  { name: "Matt Medhurst Sucks" },
  { name: "Matt Medhurst Wack" },
  { name: "Worst Matt Medhurst" },
  { name: "Matt Medhurst" },
];

 function MyNavbar(props) {

    const [symbol, setSymbol] = useState()
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState(people[0]);


    MyNavbar.propTypes = {
        searchSymbols: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
        noSearch: PropTypes.bool,
        results: PropTypes.object,
        listLoading: PropTypes.bool
    }

    const onKeyUp = () => {
        props.searchSymbols(symbol)
    }

    const dropDown = () => {
        return (
            <div className="bg-white divide-y-2 divide-gray-200 divide-dashed shadow-xl rounded-lg py-2 ">
                {
                    props.results.map(symbol => (
                        <div>
                        <Link to={'/chart?symbol=' + symbol.displaySymbol}>
                            <div className="hover:bg-green-100 hover:text-green-900 px-4">
                            <div>{symbol.displaySymbol}</div>
                            <div>{symbol.description}</div>
                            </div>
                        </Link>
                       </div>
                    ))
                }
            </div>
        )
    }

    const noSearch = (
        <div></div>
    )

    const loading = (
        <div className="bg-white shadow-xl rounded-lg py-2 px-4">Loading...</div>
    )




  return (
    <div className=''>
      <div className='bg-gray-200 h-16 '>
        <div className='flex items-center h-full justify-center sm:justify-between'>
          <div className='flex items-center justify-center px-5'>
            <a href='/' className='text-gray-500 font-bold'>
              Omega Trading
            </a>
            <div className='w-40 sm:w-52 ml-5'>
              <Listbox value={selected} onChange={setSelected}>
                <div className='rounded-lg shadow-md'>
                  <div
                    className={`
                    ${selected === people[0] ? "bg-white" : "bg-green-100"} 
                      relative flex items-center w-full py-2 pl-3 pr-10 text-left  rounded-lg  cursor-pointer focus:outline-none  sm:text-sm
                  `}
                  >
                    <span
                      className={`
                    ${
                      selected === people[0]
                        ? "text-gray-800"
                        : "text-green-900"
                    } 
                      inline-block truncate
                  `}
                    >
                      <a href='#fuck'>{selected.name}</a>
                    </span>
                    <Listbox.Button className=''>
                      <span className='absolute inset-y-0 right-0 flex items-center pl-2 pr-2 cursor-pointer border-l-2 border-gray-400 bg-white rounded-r-lg'>
                        <SelectorIcon
                          className='w-5 h-5 text-gray-400'
                          aria-hidden='true'
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave='transition ease-in duration-150'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='absolute top-10 right-0 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm '>
                        {people.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `${
                                active && personIdx !== 0
                                  ? "text-green-900 bg-green-100"
                                  : active && personIdx === 0
                                  ? "text-gray-800 bg-gray-200"
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
                </div>
              </Listbox>
            </div>
          </div>
          <div className=' space-x-7 hidden sm:flex sm:mr-7'>
            <button className='text-sm text-gray-500 hover:text-gray-600'>
              My Games
            </button>
            <button className='text-sm text-gray-500 hover:text-gray-600'>
              New Game
            </button>
            
              <form >
             <div className='relative w-40'>
              <input
                type='text'
                name='search-stonks'
                id='search-stonks'
                className='w-40 pl-10 py-2 outline-none rounded-3xl text-sm border-gray-300 border-none'
                placeholder='Search Stonks'
                 value={symbol}
                 onFocus={() => setShow(true)}
                 onChange={e => setSymbol(e.target.value)}
                 onKeyUp={onKeyUp} 
              />
              <SearchIcon
                className='absolute bottom-2 left-4 h-5 w-5 inline-block text-gray-600'
                aria-hidden='true'
              />
                    
                     </div>
                </form>
              
              
           

            <button className=' text-gray-500 hover:text-gray-600'>
              <UserCircleIcon className='h-6 w-6 ' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
      <div className='absolute w-full bg-gray-200 h-16 bottom-0 block sm:hidden'>
        <div className='flex w-full items-center h-full justify-between px-10'>
          <button class='text-gray-500 hover:text-green-500'>
            <StarIcon className='h-6 w-6 ' aria-hidden='true' />
          </button>
          <button className='text-gray-500 hover:text-green-500'>
            <SearchIcon className='h-6 w-6' aria-hidden='true' />
          </button>
          <button className='text-gray-500 hover:text-green-500'>
            <ViewListIcon className='h-6 w-6' aria-hidden='true' />
          </button>
          <button className='text-gray-500 hover:text-green-500'>
            <SparklesIcon className='h-6 w-6' aria-hidden='true' />
          </button>
          <button className='text-gray-500 hover:text-green-500'>
            <UserCircleIcon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
      </div>

      <div className="absolute w-1/3 top-11 right-0 mt-3  ">
                        {props.noSearch || !show ? noSearch : [(props.listLoading ? loading : dropDown())]}
                    </div>
    </div>
  );
}





    

/*
    return (
        <div bg="light" variant="dark" className="NavBar">
            <div className='fr jc-s ai-c'>
                <div className="nav-brand"><Link id="home-link" className="text-decoration-none text-dark " to="/">Omega Trading</Link></div>
                <form className="symbolSearch b">
                    <div className="search-nav">
                        <img className="searchIcon" src='../../../static/search.png' />
                        <input type="text"
                            placeholder="Search"
                            className="searchInput"
                            value={symbol}
                            onFocus={() => setShow(true)}
                            onChange={e => setSymbol(e.target.value)}
                            onKeyUp={onKeyUp} />
                    </div>
                    <div className="results-nav">
                        {props.noSearch || !show ? noSearch : [(props.listLoading ? loading : dropDown())]}
                    </div>
                </form>
            </div>
            <div>
                {props.user !== null ?
                    <div className="accountButtons fr ai-c">
                        <Link to='/games' className="accountLink">Games</Link>
                        <Link to='/join' className="accountLink">Join</Link>
                        <Link to='/account' className="accountLink">Account</Link>
                        <button onClick={() => props.logout()} className="logout b">Logout</button>
                    </div>
                    :
                    <div className="navLoginSignup fr ai-c jc-c">
                        <Link to="/login" className="navLogin">Login</Link>
                        <Link to="/sign-up" className="navSignup">Signup</Link>
                    </div>
                }
            </div>            
        </div>
    )
}
*/



// --------------------------------



const mapStateToProps = (state) => ({
    results: state.securities.results,
    noSearch: state.securities.noSearch,
    listLoading: state.securities.listLoading,
    user: state.user.user
})

export default connect(mapStateToProps, { searchSymbols, logout })(MyNavbar)
