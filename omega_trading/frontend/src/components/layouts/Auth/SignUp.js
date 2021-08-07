import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, Redirect } from 'react-router-dom'


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
        emailSent: PropTypes.bool
    }

    const handleKeyPress = target => {
        if (target.charCode == 13) {
            props.createUser(first_name, last_name, email, password, username)
        }
    }

    const onSubmit = () => {
        props.createUser(first_name, last_name, email, password, username)
    }

    if (props.emailSent) {
        return <Redirect to="/verify-account" />
    }


    return (
        <div>
            <div className="container">

                <h1 className="mt-5 mb-4 text-center display-4 text-light">Sign Up</h1>

                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>

                    <Form  >

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="first_name">
                                    <Form.Control onKeyPress={handleKeyPress} name="first_name" type="text" placeholder="First Name" className="bg-light mt-3" value={first_name} onChange={e => setfirstName(e.target.value)} />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="last_name">
                                    <Form.Control onKeyPress={handleKeyPress} name="last_name" type="text" placeholder="Last Name" className="bg-light mt-3" value={last_name} onChange={e => setlastName(e.target.value)} />
                                </Form.Group>
                            </div>
                            <div className="col-12">
                                <Form.Group controlId="username">
                                    <Form.Control onKeyPress={handleKeyPress} name="username" type="text" placeholder="Username" className="bg-light mt-3" value={username} onChange={e => setUsername(e.target.value)} />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control onKeyPress={handleKeyPress} name="email" type="email" placeholder="Email" className="bg-light mt-3" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control onKeyPress={handleKeyPress} type="password" name="password" placeholder="Password" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                            Sign Up
                        </Button>

                        <p className="mt-2"><Link className="text-muted text-decoration-none" to="/login">Already have an account?</Link></p>

                    </Form>
                </div>
            </div>
        </div>
    )
}



const mapStateToProps = state => ({
    emailSent: state.auth.emailSent
})

export default connect(mapStateToProps, { createUser })(SignUp)