import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonLoader from '../Tools/ButtonLoader'
import VerifyAccount from './VerifyAccount'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createUser } from '../../../actions/auth'


function SignUp(props) {

    const [first_name, setfirstName] = useState('')
    const [last_name, setlastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    SignUp.propTypes = {
        createUser: PropTypes.func.isRequired,
        emailSent: PropTypes.bool,
        error: PropTypes.bool,
        creating_user: PropTypes.bool,
        error_message: PropTypes.string
    }

    const handleKeyPress = target => {
        if (target.charCode == 13) {
            props.createUser(first_name, last_name, email, password, username)
        }
    }

    const handleSubmit = () => {
        if (!props.creating_user) {
            props.createUser(first_name, last_name, email, password, username)
        }
    }

    if (props.emailSent) {
        return <VerifyAccount />       
    }
    else {
        return (
            <div className="container fc ai-c">
                <h1 className="title">Sign Up</h1>
                <div className="signup fc jc-b ai-c">
                    <div className='fr'>
                        <input onKeyPress={handleKeyPress} name="first_name" type="text" placeholder="First Name" className="names-signup" value={first_name} onChange={e => setfirstName(e.target.value)} />
                        <input onKeyPress={handleKeyPress} name="last_name" type="text" placeholder="Last Name" className="names-signup mml" value={last_name} onChange={e => setlastName(e.target.value)} />
                    </div>      
                    <input onKeyPress={handleKeyPress} name="username" type="text" placeholder="Username" className="other-info" value={username} onChange={e => setUsername(e.target.value)} />
                    <input onKeyPress={handleKeyPress} name="email" type="email" placeholder="Email" className="other-info" value={email} onChange={e => setEmail(e.target.value)} />   
                    <input onKeyPress={handleKeyPress} type="password" name="password" placeholder="Password" className="other-info" value={password} onChange={e => setPassword(e.target.value)} /> 
                    {props.error ? props.error_message : null}
                    <button onClick={() => handleSubmit()} className="editButton" >
                        {props.creating_user && !props.error ? <ButtonLoader /> : 'Sign Up'}
                    </button>
                    <Link className="f16 lt" to="/login">Already have an account?</Link>                                
                </div>
            </div>
        )
    }  
}

const mapStateToProps = state => ({
    error: state.auth.error,
    emailSent: state.auth.emailSent,
    creating_user: state.auth.creating_user,
    error_message: state.auth.error_message
})

export default connect(mapStateToProps, { createUser })(SignUp)