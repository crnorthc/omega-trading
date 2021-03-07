import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import MyNavbar from './MyNavbar';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    Login.propTypes = {

    }

    const onSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <div>
            <MyNavbar />
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Login</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>
                    <Form  >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control name="email" type="email" placeholder="Enter email" className="bg-light mt-3" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" name="password" placeholder="Password" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 w-100" >
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


const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(Login);