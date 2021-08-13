import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { resetForgot, checkReset } from '../../../actions/auth'

function ResetPassword(props) {

    const [username, setUsername] = useState('')
    const [firstPassword, setfirstPassword] = useState('')
    const [secondPassword, setsecondPassword] = useState('')

    ResetPassword.propTypes = {
        resetForgot: PropTypes.func.isRequired,
        codeChecked: PropTypes.bool,
        passwordReset: PropTypes.bool
    }

    const values = queryString.parse(props.location.search)
    if (!props.error) {
        const keys = Object.keys(values)
        if (keys.length != 0) {
            if (!props.codeChecked) {
                props.checkReset(values.verification_code)
            }

        }
    }

    if (props.passwordReset) {
        return <Redirect to="/login" />
    }

    const notMatching = (<div></div>)

    const onSubmit = () => {
        if (firstPassword != secondPassword) {
            notMatching = (
                <p>Password do not Match!</p>
            )
        }
        props.resetForgot(username, firstPassword)
    }


    const checked = (
        <div>
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Reset Password</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>
                    <Form  >
                        <Form.Group controlId="username">
                            <Form.Control name="username" type="text" placeholder="Username" className="bg-light mt-3" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="firstPassword">
                            <Form.Control name="firstPassword" type="password" placeholder="Enter Password" className="bg-light mt-3" value={firstPassword} onChange={e => setfirstPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="secondPassword">
                            <Form.Control name="secondPassword" type="password" placeholder="Re-enter Password" className="bg-light mt-3" value={secondPassword} onChange={e => setsecondPassword(e.target.value)} />
                        </Form.Group>
                        {notMatching}
                        <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                            Reset Password
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )

    const notChecked = (
        <div className="loaderContainer">
            <div className="loader"></div>
        </div>
    )


    if (props.codeChecked) {
        return checked
    }
    else {
        return notChecked
    }

}



const mapStateToProps = (state) => ({
    codeChecked: state.auth.codeChecked,
    passwordReset: state.auth.passwordReset
})

export default connect(mapStateToProps, { resetForgot, checkReset })(ResetPassword)