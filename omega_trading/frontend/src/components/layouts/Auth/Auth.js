/* eslint-disable react/prop-types */
import React from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadUser } from '../../../actions/user'
import { Redirect } from 'react-router-dom'



function Auth(props) {

    Auth.propTypes = {
        loadUser: PropTypes.func.isRequired,
        user: PropTypes.object,
        user_loaded: PropTypes.bool,
        logged_out: PropTypes.bool,
    }


    if (!props.user_loaded && props.user == null) {
        props.loadUser()
        return <Redirect to='/' />
    }
    
    return (
        <div className='pageContainer'>
            {props.children}
        </div>
    )   
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    user_loaded: state.user.user_loaded,
    logged_out: state.auth.logged_out
})

export default connect(mapStateToProps, { loadUser })(Auth)