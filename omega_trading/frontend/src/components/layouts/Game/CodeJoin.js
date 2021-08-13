/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchGames, searchNameCode } from '../../../actions/game'



function SearchGame(props) {

    const [code, setCode] = useState('')


    SearchGame.propTypes = {
        searchNameCode: PropTypes.func.isRequired,
        searchGames: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        search: PropTypes.array,
    }

    const basicSearch = () => {
        if (code == '') {
            alert('please enter a name or code')
        }
        else {
            props.searchNameCode(code, '')
        }            
    }

    return (       
        <div className="rules fc lmy ai-c jc-a">
            <input className="codeInput f24" onChange={e => setCode(e.target.value)} placeholder="Enter Code" type="text" />             
            <button onClick={() => basicSearch()} className='editButton lmt'>Search</button>
        </div>
    )
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { searchGames, searchNameCode })(SearchGame)