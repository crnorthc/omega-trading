/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loadGame } from "../../../actions/game";
import Loader from "../Tools/Loader";

function NewGame(props) {
  NewGame.propTypes = {
    loadGame: PropTypes.func.isRequired,
    selecting_game: PropTypes.bool,
    game: PropTypes.string,
  };

  // const values = queryString.parse(props.location.search)
  // const keys = Object.keys(values)
  // if (props.game == null) {
  //     if (keys.length != 0) {
  //         props.loadGame(values.room_code)
  //     }
  // }
  // else {
  //     if (props.game.room_code !== values.room_code) {
  //         props.loadGame(values.room_code)
  //     }
  // }

  // if (props.game == null || props.selecting_game) {
  //     return <Loader page={true} />
  // }
  // else {
  //     if (props.game.active) {
  //         return (
  //             <div className='title'>Need To create this page</div>
  //         )
  //     }
  //     else {
  //         return <NewPre />
  //     }
  // }

  return (
    <>
      <div className='z-0 absolute top-16 right-0 bottom-3/4 sm:bottom-2/3 left-0 flex items-end sm:items-center justify-center'>
        <h1 className='font-mono font-medium text-white text-center text-5xl sm:text-6xl '>
          New Game
        </h1>
      </div>
      <div className='z-0 absolute top-1/4 sm:top-16 right-0 bottom-16 sm:bottom-0 left-0 flex flex-col sm:flex-row items-center justify-evenly max-w-5xl mx-auto'>
        <Link to='create-game'>
          <button className='text-center m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105'>
            Create Game
          </button>
        </Link>{" "}
        <Link to='join-game'>
          <button className='m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105'>
            Join Game
          </button>
        </Link>
        <Link to='join-game'>
          <button className='m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105'>
            Search Game
          </button>
        </Link>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  selecting_game: state.game.selecting_game,
  game: state.game.game,
});

export default connect(mapStateToProps, { loadGame })(NewGame);
