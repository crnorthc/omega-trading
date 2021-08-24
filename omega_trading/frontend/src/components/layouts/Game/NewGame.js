/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
import React from "react";
import { Link } from "react-router-dom";


function NewGame(props) {

    return (
        <>
            <div className="z-0 absolute top-16 right-0 bottom-3/4 sm:bottom-2/3 left-0 flex items-end sm:items-center justify-center">
                <h1 className="font-mono font-medium text-white text-center text-5xl sm:text-6xl ">New Game</h1>
            </div>
            <div className="z-0 absolute top-1/4 sm:top-16 right-0 bottom-16 sm:bottom-0 left-0 flex flex-col sm:flex-row items-center justify-evenly max-w-5xl mx-auto">
                <Link to="/games/create">
                    <button className="text-center m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105">
                        Create Game
                    </button>
                </Link>{" "}
                <Link to="/games/join">
                    <button className="m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105">
                        Join Game
                    </button>
                </Link>
                <Link to="/games/search">
                    <button className="m-2 w-40 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-60 lg:h-60 bg-gray-800 rounded-lg shadow-2xl font-medium text-2xl text-yellow-500 transition duration-150 ease-in-out transform hover:scale-105">
                        Search Game
                    </button>
                </Link>
            </div>
        </>
    );
}

export default (NewGame);
