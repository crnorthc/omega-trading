/* eslint-disable indent */

import React, { useEffect, useState } from "react";
import { ArrowSmRightIcon } from "@heroicons/react/solid";

function GameItem({ game, index }) {
  let [isPublic, setIsPublic] = useState(false);
  let [isLong, setIsLong] = useState(true);
  let [isTournament, setIsTournament] = useState(true);
  let [startAmount, setStartAmount] = useState("$100,000");
  let [options, setOptions] = useState("OFF");
  let [currentPlayers, setCurrentPlayers] = useState("75");
  let [totalPlayers, setTotalPlayers] = useState("100");
  let [commsion, setCommsion] = useState("$0.99");
  let [cryptoType, setCryptoType] = useState("WBNB");
  let [cryptoSplit, setCryptoSplit] = useState("Winner Takes All");
  let [startDate, setStartDate] = useState("03/27/2021");
  let [endDate, setEndDate] = useState("08/27/2021");
  let [duration, setDuration] = useState("4 hours");

  return (
    <div className='bg-gray-800 rounded-lg p-4 space-y-2 text-white'>
      <div className='flex items-center justify-between'>
        <span
          className={`${
            isTournament
              ? "bg-yellow-500"
              : isPublic
              ? "bg-green-500"
              : "bg-blue-500"
          } px-2 py-1 rounded-full text-sm`}
        >
          {isTournament ? "Tournament" : isPublic ? "Public" : "Private"}
        </span>

        <span
          className={`${
            isLong ? "bg-gray-600" : "bg-gray-600"
          } px-2 py-1 rounded-full text-sm`}
        >
          {isLong ? "Long-Term" : "Short-term"}
        </span>
      </div>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-2xl'>Medhurst</h2>
        <h3 className='text-lg text-gray-300'>69420185</h3>
      </div>
      <div className='flex items-center justify-center'>
        <div className='flex-1 flex flex-col items-center justify-center text-md'>
          <p>Start Amount</p>
          <p>{startAmount}</p>
        </div>
        <div className='flex-1 flex flex-col items-center justify-center text-md'>
          <p>Players</p>
          <p>
            {currentPlayers}/{totalPlayers}
          </p>
        </div>
      </div>
      {isLong && (
        <div className='flex items-center justify-center'>
          <div className='flex-1 flex flex-col items-center justify-center text-md'>
            <p>Commission</p>
            <p>{commsion}</p>
          </div>
          <div className='flex-1 flex flex-col items-center justify-center text-md'>
            <p>Options</p>
            <p>{options}</p>
          </div>
        </div>
      )}

      {cryptoType && (
        <div className='flex flex-col items-center justify-center'>
          <p>Cryptobet</p>
          <div className='w-full flex items-center justify-evenly text-center'>
            <p className='flex-1'>$20</p>
            <ArrowSmRightIcon
              className='w-5 h-5 text-yellow-500'
              aria-hidden='true'
            />
            <p className='flex-1'>0.02 ETH</p>
          </div>
        </div>
      )}

      {startDate && (
        <div className='flex flex-col items-center justify-center'>
          <p>Date</p>
          <div className='w-full flex items-center justify-evenly'>
            <span className='flex flex-col items-center justify-evenly text-center'>
              <p className=''>9:00AM</p>
              <p className=''>{startDate}</p>
            </span>
            <ArrowSmRightIcon
              className='w-5 h-5 text-yellow-500'
              aria-hidden='true'
            />
            <span className='flex flex-col items-center justify-evenly text-center'>
              <p className=''>9:00AM</p>
              <p className=''>{endDate}</p>
            </span>
          </div>
        </div>
      )}
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
  );
}

export default GameItem;
