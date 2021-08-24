/* eslint-disable indent */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, Fragment } from "react";
import { create, editGame, joinGame } from "../../../actions/game";
import Loader from "../Tools/Loader";
import { Tab, Switch, Listbox, Transition } from "@headlessui/react";
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

const commissionAmounts = [
 { insert: "Disabled", value: 0 },
 { insert: "$0.99", value: 0.99 },
 { insert: "$1.99", value: 1.99 },
 { insert: "$2.99", value: 2.99 },
 { insert: "$3.99", value: 3.99 },
 { insert: "$4.99", value: 4.99 },
 { insert: "$5.99", value: 5.99 },
 { insert: "$6.99", value: 6.99 },
 { insert: "$7.99", value: 7.99 },
 { insert: "$8.99", value: 8.99 },
 { insert: "$9.99", value: 9.99 },
 { insert: "$10.99", value: 10.99 },
 { insert: "$11.99", value: 11.99 },
 { insert: "$12.99", value: 12.99 },
 { insert: "$13.99", value: 13.99 },
 { insert: "$14.99", value: 14.99 },
 { insert: "$15.99", value: 15.99 },
 { insert: "$16.99", value: 16.99 },
 { insert: "$17.99", value: 17.99 },
 { insert: "$18.99", value: 18.99 },
 { insert: "$19.99", value: 19.99 },
];

const payout = [
 { insert: "Winner Takes All", value: 1 }, // Always an option
 { insert: "Top 3", value: 2 }, // Games with min of 10
 { insert: "10% Split", value: 3 }, // Games with min of 50
 { insert: "10% Ranked", value: 4 }, // Games with min of 50
];

const min_players = [
 { insert: "2", value: 2 }, // Only for private
 { insert: "10", value: 10 },
 { insert: "25", value: 25 },
 { insert: "50", value: 50 },
 { insert: "100", value: 100 },
 { insert: "250", value: 250 },
 { insert: "500", value: 500 },
 { insert: "1000", value: 1000 },
];

const cryptoCurrencies = ["ETH"];
function Long(props) {
 const [name, setName] = useState("");
 const [Public, setPublic] = useState(true);
 const [options, setOptions] = useState(true);
 const [commission, setCommission] = useState(commissionAmounts[0]);
 const [startAmount, setStartAmount] = useState(startAmounts[0]);
 const [isBet, setIsBet] = useState(true);
 const [bet, setBet] = useState(null);
 const [cryptoCurrency, setCryptoCurrency] = useState(cryptoCurrencies[0]);
 const [startDate, setStartDate] = useState(null);
 const [startTime, setStartTime] = useState(null);
 const [endDate, setEndDate] = useState(null);
 const [endTime, setEndTime] = useState(null);
 const [min, setMin] = useState(null);
 const [minPlayers, setMinPlayers] = useState(min_players[0]);
 const [max, setMax] = useState(null);

 Long.propTypes = {
  create: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
  editGame: PropTypes.func.isRequired,
  creating_game: PropTypes.bool,
  game_created: PropTypes.bool,
  user: PropTypes.object,
  game: PropTypes.object,
 };

 if (startDate == null) {
  const current = new Date();
  const year = current.getFullYear();

  var month = current.getMonth() + 1;
  if (month.toString().length == 1) {
   month = "0" + month;
  }

  var day = current.getDate() + 1;
  var hour = current.getHours();
  if (hour == 23) {
   hour = "00";
   day += 1;
  } else {
   hour += 1;
   if (hour.toString().length == 1) {
    hour = "0" + hour;
   }
  }
  if (day.toString().length == 1) {
   day = "0" + day;
  }

  setStartTime(hour + ":" + "00");
  setMax(year + 1 + "-" + month + "-" + day);
  setMin(year + "-" + month + "-" + day);
  setStartDate(year + "-" + month + "-" + day);
 }

 const checkDates = () => {
  var endMonth = Number(endDate.substring(5, 7));
  var endDay = Number(endDate.substring(8));
  var endYear = Number(endDate.substring(0, 4));
  var endHour = Number(endTime.substring(0, 2));
  var endMin = Number(endTime.substring(3));
  var startMonth = Number(startDate.substring(5, 7));
  var startDay = Number(startDate.substring(8));
  var startYear = Number(startDate.substring(0, 4));
  var startHour = Number(startTime.substring(0, 2));
  var startMin = Number(startTime.substring(3));

  const current_time = (Date.now() / 1000).toFixed(0);
  const start_time = (
   new Date(
    startYear,
    startMonth - 1,
    startDay,
    startHour,
    startMin
   ).getTime() / 1000
  ).toFixed(0);

  const end_time = (
   new Date(endYear, endMonth - 1, endDay, endHour, endMin).getTime() / 1000
  ).toFixed(0);

  if (end_time - start_time > 31536000) {
   console.log("Games cannot be longer than one year"); // ADD SOMETHING TO DISPLAY ERROR MSG
   return false;
  }

  if (start_time - current_time < 86400) {
   console.log("Games cannot start sooner than one day"); // ADD SOMETHING TO DISPLAY ERROR MSG
   return false;
  }

  return { start: start_time, end: end_time };
 };

 const create = () => {
  if (name != "") {
   var gameBet = null;
   if (isBet) {
    if (bet == null || bet == "") {
     console.log("Incorrect bet value"); // ADD SOMETHING TO DISPLAY ERROR MSG
    } else {
     gameBet = {
      bet: bet,
      currency: cryptoCurrency,
     };
    }
   }

    const create = () => {
        if (name != '') {
            var gameBet = null
            if (isBet) {
                if (bet == null || bet == '') {
                    console.log('Incorrect bet value') // ADD SOMETHING TO DISPLAY ERROR MSG
                } else {
                    gameBet = {
                        bet: bet,
                        coin: cryptoCurrency,
                        type: 1
                    }
                }
            }

   if (dates !== false) {
    const rules = {
     name: name,
     public: Public,
     options: options,
     start_amount: startAmount.value,
     commission: commission.value,
     min_players: minPlayers.value,
     dates: dates,
     bet: gameBet,
    };

    props.create("long", rules);
   }
  }
 };

 if (startDate !== null) {
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
           className={`${Public ? "bg-green-500" : "bg-red-500"} shadow-md
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
           className={`${options ? "bg-green-500" : "bg-red-500"} shadow-md
relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
           <span className='sr-only'>Use setting</span>
           <span
            aria-hidden='true'
            className={`${options ? "translate-x-10" : "translate-x-0"}
pointer-events-none inline-block h-9 w-9 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
           />
          </Switch>
         </Switch.Group>
        </div>
        <div className='col-span-12 sm:col-span-4'>
         <label className='block font-medium' htmlFor=''>
          Start Amount
         </label>
         <Listbox value={startAmount} onChange={setStartAmount}>
          <div className='relative mt-1'>
           <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none  sm:text-sm'>
            <span className='block truncate'>{startAmount.insert}</span>
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
                 active ? "text-green-900 bg-green-100" : "text-gray-900"
                } cursor-pointer select-none relative py-2 pl-10 pr-4`
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
                    active ? "text-amber-600" : "text-amber-600"
                   } absolute inset-y-0 left-0 flex items-center pl-3`}
                  >
                   <CheckIcon className='w-5 h-5' aria-hidden='true' />
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
        <div className='col-span-12 sm:col-span-4'>
         <label className='block font-medium' htmlFor=''>
          Commision
         </label>
         <Listbox value={commission} onChange={setCommission}>
          <div className='relative mt-1'>
           <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none  sm:text-sm'>
            <span className='block truncate'>{commission.insert}</span>
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
             {commissionAmounts.map((commissionAmount, commissionAmountIdx) => (
              <Listbox.Option
               key={commissionAmountIdx}
               className={({ active }) =>
                `${active ? "text-green-900 bg-green-100" : "text-gray-900"}
cursor-pointer select-none relative py-2 pl-10 pr-4`
               }
               value={commissionAmount}
              >
               {({ selected, active }) => (
                <>
                 <span
                  className={`${
                   selected ? "font-medium" : "font-normal"
                  } block truncate`}
                 >
                  {commissionAmount.insert}
                 </span>
                 {selected ? (
                  <span
                   className={`${active ? "text-amber-600" : "text-amber-600"}
absolute inset-y-0 left-0 flex items-center pl-3`}
                  >
                   <CheckIcon className='w-5 h-5' aria-hidden='true' />
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
        <div className='col-span-12 sm:col-span-4'>
         <label className='block font-medium' htmlFor=''>
          Min Players
         </label>
         <Listbox value={minPlayers} onChange={setMinPlayers}>
          <div className='relative mt-1'>
           <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none  sm:text-sm'>
            <span className='block truncate'>{minPlayers.insert}</span>
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
             {min_players.map((minPlayer, minPlayerIdx) => (
              <Listbox.Option
               key={minPlayerIdx}
               className={({ active }) =>
                `${active ? "text-green-900 bg-green-100" : "text-gray-900"}
cursor-pointer select-none relative py-2 pl-10 pr-4`
               }
               value={minPlayer}
              >
               {({ selected, active }) => (
                <>
                 <span
                  className={`${
                   selected ? "font-medium" : "font-normal"
                  } block truncate`}
                 >
                  {minPlayer.insert}
                 </span>
                 {selected ? (
                  <span
                   className={`${active ? "text-amber-600" : "text-amber-600"}
absolute inset-y-0 left-0 flex items-center pl-3`}
                  >
                   <CheckIcon className='w-5 h-5' aria-hidden='true' />
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
         <Tab.Group>
          <label className='block font-medium pb-2' htmlFor=''>
           Duration
          </label>
          <Tab.List className='flex items-start justify-start pb-2'>
           <span className='flex shadow-md rounded-md'>
            <Tab
             className={({ selected }) =>
              `${selected ? "bg-white text-gray-900" : " text-red-900"}
p-2 rounded-l-lg`
             }
            >
             Start
            </Tab>
            <Tab
             className={({ selected }) =>
              `${selected ? "bg-white text-gray-900" : " text-red-900"}
p-2 rounded-r-lg`
             }
            >
             End
            </Tab>
           </span>
          </Tab.List>

          <Tab.Panels>
           <Tab.Panel>
            <div className='flex flex-row items-center justify-start space-x-2'>
             <input
              className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
              type='date'
              min={min}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
             ></input>
             <input
              className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
             ></input>
            </div>
           </Tab.Panel>
           <Tab.Panel>
            <div className='flex flex-row items-center justify-start space-x-2'>
             <input
              className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
              type='date'
              value={endDate}
              max={max}
              onChange={(e) => setEndDate(e.target.value)}
             ></input>
             <input
              className='flex-1 h-10 text-sm block px-2 shadow-md border-transparent focus:outline-none focus:ring focus:ring-red-300'
              type='time'
              onChange={(e) => setEndTime(e.target.value)}
             ></input>
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
               selected ? "bg-white text-gray-900" : " text-red-900"
              } p-2 rounded-l-lg`
             }
             onClick={() => setIsBet(true)}
            >
             Active
            </Tab>
            <Tab
             className={({ selected }) =>
              `${
               selected ? "bg-white text-gray-900" : " text-red-900"
              } p-2 rounded-r-lg`
             }
             onClick={() => setIsBet(false)}
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
               onChange={(e) => setBet(e.target.value)}
              />
              <div className='absolute inset-y-0 right-0 flex items-center'>
               <label htmlFor='currency' className='sr-only'>
                Currency
               </label>
               <Listbox value={cryptoCurrency} onChange={setCryptoCurrency}>
                <div className='relative'>
                 <Listbox.Button className='relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm'>
                  <span className='block truncate'>{cryptoCurrency}</span>
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
                   {cryptoCurrencies.map((crypto, cryptoIndex) => (
                    <Listbox.Option
                     key={cryptoIndex}
                     className={({ active }) =>
                      `${
                       active ? "text-green-900 bg-green-100" : "text-gray-900"
                      }
cursor-pointer select-none relative py-2 pl-10 pr-4`
                     }
                     value={crypto}
                    >
                     {({ selected, active }) => (
                      <>
                       <span
                        className={`${
                         selected ? "font-medium" : "font-normal"
                        } block truncate`}
                       >
                        {crypto}
                       </span>
                       {selected ? (
                        <span
                         className={`${
                          active ? "text-amber-600" : "text-amber-600"
                         }
absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                         <CheckIcon className='w-5 h-5' aria-hidden='true' />
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
       <button
        onClick={() => create()}
        className='block bg-red-700 text-white text-xl sm:text-2xl py-4 px-7 mt-10 mb-32 rounded-lg shadow-md'
       >
        Create Game
       </button>
      </div>
     </div>
    </div>
   </>
  );
 } else {
  return <Loader page={true} />;
 }
}

const mapStateToProps = (state) => ({
 creating_game: state.game.creating_game,
 game_created: state.game.game_created,
 user: state.user.user,
 game: state.game.game,
});

export default connect(mapStateToProps, { create, editGame, joinGame })(Long);
