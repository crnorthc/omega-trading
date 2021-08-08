/* eslint-disable react/prop-types */
import React, {useState} from 'react'
import queryString from 'query-string'
import Loader from '../Tools/Loader'


// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { verifyEmail, closeVerified } from '../../../actions/auth'
import { Redirect } from 'react-router-dom'

function VerifyAccount(props) {
    const [redirect, setRedirect] = useState(false)

    VerifyAccount.propTypes = {
        verifyEmail: PropTypes.func.isRequired,
        closeVerified: PropTypes.func.isRequired,
        error_message: PropTypes.string,
        emailVerified: PropTypes.bool,
        error: PropTypes.bool
    }

    const values = queryString.parse(props.location.search)
    const keys = Object.keys(values)

    const handleClick = () => {
        if (props.error) {
            setRedirect(true)
        }
        else {
            props.closeVerified()
        }
    }

    if (props.emailVerified) {
        return <Redirect to='/login' />
    }

    if (keys.length != 0 && !props.error) {
        if (keys[0] != 'code') {
            props.verifyEmail(values.verification_code)
        }
        return <Loader page={true} />
    }
    else {
        if (props.error && redirect) {
            return <Redirect to='/sign-up' />
        }
        return (
            <div className='pageContainer'>
                <div className='title'>{props.error ? props.error_message : 'Please check your email for account verification'}</div>
                <button onClick={() => handleClick()} className='editButton'>OK</button>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    error_message: state.auth.error_message,
    error: state.auth.error,
    emailVerified: state.auth.emailVerified
})

export default connect(mapStateToProps, {verifyEmail, closeVerified})(VerifyAccount)