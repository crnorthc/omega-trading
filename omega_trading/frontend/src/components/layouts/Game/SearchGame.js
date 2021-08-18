/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
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
      <div className='fixed z-0 top-16 right-0 bottom-3/4 sm:bottom-2/3 left-0flex flex-col justify-center align-items-center'>
        <SearchyFilters />
        <SearchyResults />
      </div>
    );
    
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames, searchNameCode })(SearchGame)