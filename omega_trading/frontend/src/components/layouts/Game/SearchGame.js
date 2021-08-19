/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import './game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchGames, searchNameCode } from '../../../actions/game'
import SearchyFilters from './SearchyFilters'
import SearchyResults from './SearchyResults'



function SearchGame(props) {

    SearchGame.propTypes = {
        searchNameCode: PropTypes.func.isRequired,
        searchGames: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        search: PropTypes.array,
    }

    return (
      <>
        <div className='z-0 absolute top-16 right-0 bottom-3/4 sm:bottom-2/3 left-0 flex items-end sm:items-center justify-center'>
          <h1 className='font-mono font-medium text-white text-center text-5xl sm:text-6xl '>
            New Game
          </h1>
        </div>
        <div className='z-0 absolute top-1/4 sm:top-1/3 right-0 bottom-16 sm:bottom-0 left-0 flex flex-row items-start justify-center max-w-5xl mx-auto'>
           <SearchyFilters />
           <SearchyResults />
        </div>
      </>
    );
    
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames, searchNameCode })(SearchGame)