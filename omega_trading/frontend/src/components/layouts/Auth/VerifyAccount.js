/* eslint-disable react/prop-types */
import React from 'react'


// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { verifyEmail } from '../../../actions/auth'

function VerifyAccount(props) {

    VerifyAccount.propTypes = {
        verifyEmail: PropTypes.func.isRequired
    }

    return (
        <div className='pageContainer'>
            <div className='title'>Please check your email for account verification</div>
            <button onClick={() => props.verifyEmail()} className='editButton'>OK</button>
        </div>
    )
}


const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {verifyEmail})(VerifyAccount)