/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-key */
import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchSymbols } from "../../actions/securities.js";
import { logout } from "../../actions/auth.js";
import { currentGames, loadGame, noGame } from "../../actions/game.js";

// Styling stuff
import { Dialog, Listbox, Transition } from "@headlessui/react";
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

function MyNavbar(props) {
 const [symbol, setSymbol] = useState();
 const [show, setShow] = useState(false);
 const [selected, setSelected] = useState(null);
 let [isOpen, setIsOpen] = useState(false);

 function closeModal() {
  setIsOpen(false);
 }

 function openModal() {
  setIsOpen(true);
 }

 MyNavbar.propTypes = {
  loadGame: PropTypes.func.isRequired,
  noGame: PropTypes.func.isRequired,
  currentGames: PropTypes.func.isRequired,
  searchSymbols: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  noSearch: PropTypes.bool,
  results: PropTypes.object,
  listLoading: PropTypes.bool,
  games: PropTypes.array,
  game: PropTypes.object,
 };

 const onKeyUp = () => {
  props.searchSymbols(symbol);
 };

 if (props.games == null) {
  props.currentGames();
 }

 /*
    if (selected !== null) {
        if (props.game == null) {
            return <Redirect to={'/game?room_code=' + props.games[selected].room_code} />
        }
        else {
            if (props.games[selected].room_code !== props.game.room_code) {
                return <Redirect to={'/game?room_code=' + props.games[selected].room_code} />
            }
        }
    }
    else {
        if (props.game !== null) {
            props.noGame()
        }
    }*/

 const dropDown = () => {
  return (
   <div className='bg-white divide-y-2 divide-gray-200 divide-dashed py-2'>
    {props.results.map((symbol) => (
     <div>
      <Link onClick={closeModal} to={"/chart?symbol=" + symbol.displaySymbol}>
       <div className='hover:bg-green-100 hover:text-green-900 px-4 py-3'>
        <div>{symbol.displaySymbol}</div>
        <div>{symbol.description}</div>
       </div>
      </Link>
     </div>
    ))}
   </div>
  );
 };

 const no_game = (
  <Listbox.Option
   key={"bitch"}
   className={({ active }) =>
    `${
     active ? "text-gray-800 bg-gray-200" : "text-gray-900"
    } cursor-pointer select-none relative py-2 pl-10 pr-4`
   }
   value={null}
  >
   {({ selected, active }) => (
    <>
     <span
      className={`${selected ? "font-medium" : "font-normal"} block truncate`}
     >
      No Game
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
 );

 const games_list = () => {
  if (props.games == null || props.games == false) {
   return no_game;
  } else {
   var game_list = [no_game];
   for (const game in props.games) {
    if (props.games[game].active) {
     game_list.push(
      <Listbox.Option
       key={game}
       className={({ active }) =>
        `${
         active ? "text-yellow-900 bg-yellow-200" : "text-gray-900"
        } cursor-pointer select-none relative py-2 pl-10 pr-4`
       }
       value={game}
      >
       {({ selected, active }) => (
        <>
         <span
          className={`${
           selected ? "font-medium" : "font-normal"
          } block truncate`}
         >
          {props.games[game].name}
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
     );
    }
   }
   return game_list;
  }
 };

 const noSearch = <div></div>;

 const loading = <div className='bg-white py-2 px-4'>Loading...</div>;

 return (
  <div className=''>
   <div className='bg-gray-800 h-16 fixed w-full z-20'>
    {props.user !== null ? (
     <div className='flex items-center h-full justify-center sm:justify-between shadow-sm'>
      <div className='flex items-center justify-center px-7 sm:px-5'>
       <Link
        to={"new-game"}
        className='text-yellow-500 font-bold hover:text-yellow-600'
       >
        Starbet
       </Link>
       <div className='w-40 sm:w-52 ml-5'>
        <Listbox value={selected} onChange={setSelected}>
         <div className={"relative "}>
          <div className='flex'>
           <div
            className={`${
             selected === null || selected == undefined
              ? "bg-gray-900 cursor-none border-r-2 border-white"
              : "bg-yellow-200 hover:bg-yellow-300 cursor-pointer border-transparent"
            } flex-1 flex items-center py-2 pl-3 pr-10 text-left rounded-l-lg   focus:outline-none  sm:text-sm`}
           >
            <Link
             to={
              selected == null
               ? null
               : "/game?room_code=" + props.games[selected].room_code
             }
             className={`${
              selected === null || selected == undefined
               ? "text-gray-50 hover:text-gray-50 cursor-default"
               : "text-yellow-800 hover:text-yellow-900 cursor-pointer"
             }`}
            >
             {selected == null ? "No Game" : props.games[selected].name}
            </Link>
           </div>
           <Listbox.Button className='relative'>
            <span className='flex h-full items-center pl-2 pr-2 cursor-pointer bg-gray-900 rounded-r-lg'>
             <SelectorIcon
              className='w-5 h-5 text-gray-50 hover:text-gray-300'
              aria-hidden='true'
             />
            </span>
           </Listbox.Button>
          </div>
          <Transition
           as={Fragment}
           leave='transition ease-in duration-150'
           leaveFrom='opacity-100'
           leaveTo='opacity-0'
          >
           <Listbox.Options className='absolute top-10 right-0 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm '>
            {games_list()}
           </Listbox.Options>
          </Transition>
         </div>
        </Listbox>
       </div>
      </div>
      <div className=' space-x-7 hidden sm:flex sm:mr-7 items-center'>
       <Link
        to='/my-games'
        className='text-sm text-gray-50 hover:text-gray-300'
       >
        My Games
       </Link>
       <Link to='new-game' className='text-sm text-gray-50 hover:text-gray-300'>
        New Game
       </Link>
       <div className='relative  flex items-center justify-center'>
        <button
         type='button'
         onClick={
          props.games !== null && props.games !== false ? openModal : null
         }
         className='transition duration-500 ease-in-out transform hover:scale-110 pl-2 pr-3 py-1 text-sm  text-gray-500 bg-white border rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        >
         <SearchIcon
          className='relative h-5 w-5 pr-1 inline-block text-gray-500'
          aria-hidden='true'
         />
         Search
        </button>
       </div>
       <Link to='/account' className=' text-gray-50 hover:text-gray-200'>
        <UserCircleIcon className='h-6 w-6 ' aria-hidden='true' />
       </Link>
      </div>
     </div>
    ) : (
     <div className='flex items-center h-full justify-center sm:justify-between'>
      <div className='flex items-center justify-center px-5'>
       <Link
        to={"/join"}
        className='text-gray-500 font-bold hover:text-gray-600'
       >
        Omega Trading
       </Link>
      </div>
      <div className=' space-x-7 hidden sm:flex sm:mr-7 items-center'>
       <Link to='/login' className=' text-sm text-gray-500 hover:text-gray-600'>
        Login
       </Link>
       <Link
        to='/sign-up'
        className='text-sm text-gray-500 hover:text-gray-600'
       >
        Sign Up
       </Link>
      </div>
     </div>
    )}
   </div>
   <div className='shadow-xl'>
    <div className='z-20 fixed w-full bg-gray-800 h-16 bottom-0 block sm:hidden'>
     <div className='flex w-full items-center h-full justify-between px-10'>
      <button className='text-yellow-500 hover:text-yellow-600'>
       <StarIcon className='h-6 w-6 ' aria-hidden='true' />
      </button>
      <button className='text-gray-500 hover:text-yellow-500'>
       <SearchIcon className='h-6 w-6' aria-hidden='true' />
      </button>
      <button className='text-gray-500 hover:text-yellow-500'>
       <ViewListIcon className='h-6 w-6' aria-hidden='true' />
      </button>
      <button className='text-gray-500 hover:text-yellow-500'>
       <SparklesIcon className='h-6 w-6' aria-hidden='true' />
      </button>
      <button className='text-gray-500 hover:text-yellow-500'>
       <UserCircleIcon className='h-6 w-6' aria-hidden='true' />
      </button>
     </div>
    </div>
   </div>

   <Transition appear show={isOpen} as={Fragment}>
    <Dialog
     as='div'
     className='fixed z-30 top-11 mt-3 right-0 w-1/3 z-10'
     onClose={closeModal}
    >
     <div className='min-h-screen text-center'>
      <Transition.Child
       as={Fragment}
       enter='ease-out duration-300'
       enterFrom='opacity-0'
       enterTo='opacity-100'
       leave='ease-in duration-200'
       leaveFrom='opacity-100'
       leaveTo='opacity-0'
      >
       <Dialog.Overlay className='fixed inset-0' />
      </Transition.Child>

      {/* This element is to trick the browser into centering the modal contents. */}
      {/* <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span> */}
      <Transition.Child
       as={Fragment}
       enter='ease-out duration-300'
       enterFrom='opacity-0 scale-95'
       enterTo='opacity-100 scale-100'
       leave='ease-in duration-200'
       leaveFrom='opacity-100 scale-100'
       leaveTo='opacity-0 scale-95'
      >
       <div className='inline-block w-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg'>
        <form>
         <div className='relative'>
          <input
           type='text'
           name='search-stonks'
           id='search-stonks'
           className=' pl-10 py-2 outline-none text-sm border-gray-300 border-none w-full'
           placeholder='Search Stonks'
           value={symbol}
           onFocus={() => setShow(true)}
           onChange={(e) => setSymbol(e.target.value)}
           onKeyUp={onKeyUp}
          />
          <SearchIcon
           className='absolute bottom-2 left-4 h-5 w-5 inline-block text-gray-600'
           aria-hidden='true'
          />
         </div>
        </form>

        <div className='relative'>
         {props.noSearch || !show
          ? noSearch
          : [props.listLoading ? loading : dropDown()]}
        </div>
       </div>
      </Transition.Child>
     </div>
    </Dialog>
   </Transition>
  </div>
 );
}

const mapStateToProps = (state) => ({
 results: state.securities.results,
 noSearch: state.securities.noSearch,
 listLoading: state.securities.listLoading,
 user: state.user.user,
 game: state.game.game,
 games: state.game.games,
});

export default connect(mapStateToProps, {
 searchSymbols,
 logout,
 currentGames,
 loadGame,
 noGame,
})(MyNavbar);
