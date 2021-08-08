/* eslint-disable no-undef */
import React from 'react'
import NewLobby from './Game/NewLobby'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


function NewHome(props) {

    NewHome.propTypes = {
        logged_in: PropTypes.bool
    }

    if (props.logged_in) {
        return <NewLobby />
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
    logged_in: state.auth.logged_in
})

export default connect(mapStateToProps, {})(NewHome)