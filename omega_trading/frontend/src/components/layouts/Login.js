import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, Redirect } from 'react-router-dom'


// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from '../../actions/auth.js'
import { loadUser } from '../../actions/user.js'

function Login(props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    Login.propTypes = {
        login: PropTypes.func.isRequired,
        loadUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        loggingIn: PropTypes.bool,
        userLoaded: PropTypes.bool,
        last_path: PropTypes.string
    }

    if (props.isAuthenticated) {
        props.loadUser()
    }

    if (props.userLoaded) {
        if (props.last_path !== null && props.last_path !== '/login') {
            return <Redirect to={props.last_path} />
        }
        return <Redirect to="/" />
    }

    const onSubmit = () => {
        props.login(username, password)
    }

    const loader = (
        <div className="loaderContainer f ai-c jc-c">
            <div className="loader"></div>
        </div>
    )

    if (props.logging_in) {
        return loader
    }
    else {
        if (props.isAuthenticated) {
            props.loadUser()
            if (props.userLoaded) {
                return <Redirect to="/" />
            }
            else {
                return loader
            }
        }
        else {
            return (
                <div>
                    <div className="container">
                        <h1 className="mt-5 mb-4 text-center display-4 text-light">Login</h1>
                        <div className="m-auto text-center" style={{ maxWidth: '400px' }}>
                            <Form  >
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control name="email" type="text" placeholder="Username" className="bg-light mt-3" value={username} onChange={e => setUsername(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control type="password" name="password" placeholder="Password" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                                    Login
                                </Button>
                                <p className="mt-2 px-3 text-light bg-dark d-inline-block">or</p>
                                <div className="bg-light" style={{ height: '1px', marginTop: '-27px' }} />
                                <Button variant="secondary" className="mt-3 w-50" >
                                    <Link className="text-dark text-decoration-none" to="/sign-up">Sign Up</Link>
                                </Button>
                                <p className="mt-2"><Link className="text-muted text-decoration-none" to="/forgot-password">Forgot Password?</Link></p>
                            </Form>
                        </div>
                    </div>
                </div>

            )
        }
    }
}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    logging_in: state.auth.logging_in,
    userLoaded: state.user.userLoaded,
    last_path: state.auth.last_path
})

export default connect(mapStateToProps, { login, loadUser })(Login)