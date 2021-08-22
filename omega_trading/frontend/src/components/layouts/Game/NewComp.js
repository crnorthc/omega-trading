/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'


function NewComp(props) {
    return (
        <>
            <div className='z-0 absolute top-5 sm:top-16 right-0 bottom-2/3 left-0 flex items-center justify-center'>
                <h1 className='font-mono font-medium text-white text-center text-5xl sm:text-6xl '>
                    Competition Type
                </h1>
            </div>
            <div className='z-0 absolute top-16 right-0 bottom-0 left-0 flex flex-col sm:flex-row items-center justify-center sm:justify-evenly'>
                <Link to='/games/new/create'>
                    <button className='text-center m-3 w-40 h-40 sm:w-64 sm:h-64 bg-red-200 rounded-lg shadow-2xl font-medium text-2xl text-red-900 transition duration-150 ease-in-out transform hover:scale-105'>
                        Normal
                    </button>
                </Link>{' '}
                <Link to='tournament'>
                    <button className='m-3 w-40 h-40 sm:w-64 sm:h-64 bg-green-200 rounded-lg shadow-2xl font-medium text-2xl text-green-900 transition duration-150 ease-in-out transform hover:scale-105'>
                        Tournament
                    </button>
                </Link>
            </div>
        </>
    )
}

export default (NewComp)