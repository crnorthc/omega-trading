/* eslint-disable no-undef */
import React from 'react'
import Loader from './Tools/Loader'
import { Redirect } from 'react-router'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { currentGames } from '../../actions/game'


function NewHome(props) {

    NewHome.propTypes = {
        currentGames: PropTypes.func.isRequired,
        logged_in: PropTypes.bool,
        games: PropTypes.object
    }


    if (props.logged_in) {
        if (props.games == null) {
            props.currentGames()
        }
        if (props.games) {
            return <Loader poage={true} />
        } else {
            if (props.games == false) {
                return <Redirect to='/games' />
            }
            else {
                return <Redirect to='/join' />
            }
        }
    }
    else {
        return (
            <div className='title'>
            This is the fucking home page
            </div>
        )   
    }
}

const mapStateToProps = state => ({
    logged_in: state.auth.logged_in,
    games: state.game.games
})

export default connect(mapStateToProps, { currentGames })(NewHome)