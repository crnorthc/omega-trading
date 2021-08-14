/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import './game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchGames, searchNameCode } from '../../../actions/game'
import SearchFilters from './SearchFilters'
import SearchResults from './SearchResults'



function SearchGame(props) {

    SearchGame.propTypes = {
        searchNameCode: PropTypes.func.isRequired,
        searchGames: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        search: PropTypes.array,
    }

    return (       
        <div className='search-cont fr jc-c'>
            <div className='search-games b fr'>
                <SearchFilters />
                <SearchResults />
            </div>
        </div>        
    )
    
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames, searchNameCode })(SearchGame)