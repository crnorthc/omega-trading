/* eslint-disable indent */

import React, { useEffect, useState } from 'react'
import { ArrowSmRightIcon } from '@heroicons/react/solid'

function GameItem({ game, index }) {
  let [isPublic, setIsPublic] = useState(true)
  let [isLong, setIsLong] = useState(true)
  let [isTournament, setIsTournament] = useState(true)
  let [startAmount, setStartAmount] = useState('$100,000')
  let [options, setOptions] = useState('OFF')
  let [currentPlayers, setCurrentPlayers] = useState('75')
  let [totalPlayers, setTotalPlayers] = useState('100')
  let [commsion, setCommsion] = useState('$0.99')
  let [cryptoType, setCryptoType] = useState('WBNB')
  let [cryptoSplit, setCryptoSplit] = useState('Winner Takes All')
  // let [startDate, setStartDate] = useState("03/27/2021");
  let [startDate, setStartDate] = useState(false)
  let [endDate, setEndDate] = useState('08/27/2021')
  let [duration, setDuration] = useState('4 hours')

  return (
    <div className='bg-gray-800 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 text-white text-center'>
      <div className='flex items-center justify-between'>
        <span
          className={`${
            isPublic ? 'bg-green-500' : 'bg-blue-500'
          } px-2 py-1 rounded-full text-sm`}
        >
          {isPublic ? 'Public' : 'Private'}
        </span>

        <span
          className={`${
            isTournament
              ? 'bg-yellow-500'
              : isLong
              ? 'bg-green-500'
              : 'bg-blue-500'
          } px-2 py-1 rounded-full text-sm`}
        >
          {isTournament ? 'Tournament' : isLong ? 'Long' : 'Short'}
        </span>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-3xl'>Medhurst</h2>
        <h3 className='text-lg text-gray-500'>69420185</h3>
      </div>

      <div className='flex items-center justify-center '>
        <div className='flex-1 px-2 flex flex-col items-center justify-center'>
          <p className='text-lg'>Start Amount</p>
          <p className='text-md w-full bg-gray-700 rounded-md'>{startAmount}</p>
        </div>

        <div className=' flex-1 px-2 flex flex-col items-center justify-center text-md'>
          <p className="className='text-lg'">Players</p>
          <p className='text-md w-full bg-gray-700 rounded-md'>
            {currentPlayers}/{totalPlayers}
          </p>
        </div>
      </div>
      {isLong && (
        <div className='flex items-center justify-center'>
          <div className='flex-1 px-2 flex flex-col items-center justify-center text-md'>
            <p className='text-lg'>Commission</p>
            <p className='text-md w-full bg-gray-700 rounded-md'>{commsion}</p>
          </div>

          <div className='flex-1 px-2 flex flex-col items-center justify-center text-md'>
            <p className='text-lg'>Options</p>
            <p className='text-md w-full bg-gray-700 rounded-md'>{options}</p>
          </div>
        </div>
      )}

      {cryptoType && (
        <div className='flex flex-col items-center justify-center px-2 '>
          <p className='text-lg'>Cryptobet</p>
          <div className='w-full flex items-center justify-evenly text-center bg-gray-700 rounded-md'>
            <p className='text-md flex-1'>$20</p>
            <ArrowSmRightIcon
              className='w-5 h-5 text-yellow-500'
              aria-hidden='true'
            />
            <p className='text-md flex-1'>0.02 ETH</p>
          </div>
        </div>
      )}

      {startDate && (
        <div className='flex flex-col items-center justify-center px-2 '>
          {' '}
          <p className='text-lg'>Date</p>
          <div className='w-full flex items-center justify-evenly bg-gray-700 rounded-md'>
            <span className='flex flex-col items-center justify-evenly text-center'>
              <p className='text-md'>9:00AM</p>
              <p className='text-md'>{startDate}</p>
            </span>
            <ArrowSmRightIcon
              className='w-5 h-5 text-yellow-500'
              aria-hidden='true'
            />
            <span className='flex flex-col items-center justify-evenly text-center'>
              <p className='text-md'>9:00AM</p>
              <p className='text-md'>{endDate}</p>
            </span>
          </div>
        </div>
      )}

      {duration && (
        <div className='flex flex-col items-center justify-center px-2 '>
          {' '}
          <p className='text-lg'>Duration</p>
          <div className='w-full flex items-center justify-evenly bg-gray-700 rounded-md'>
            <p className='text-md'>{duration}</p>
          </div>
        </div>
      )}

      <div className='flex flex-col items-center justify-center px-2 '>
        {' '}
        <button className='w-full py-2 sm:py-4 bg-blue-400 rounded-md'>
          Join Game
        </button>
      </div>
      {/* <tr key={game.roomCode}>
        <td className='px-2 py-4 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{game.name}</div>
          <div className='text-sm text-gray-500'>{game.roomCode}</div>
        </td>

        <td className='px-2 py-4 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{game.players} / infinity</div>
        </td>
        <td className='px-2 py-4 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{game.date}</div>
        </td>
      </tr> */}
    </div>
  )
}

export default GameItem
