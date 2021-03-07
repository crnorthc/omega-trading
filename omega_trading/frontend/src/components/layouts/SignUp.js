import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import MyNavbar from './MyNavbar';


// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function SignUp(props) {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Username, setUsername] = useState('');


    const onSubmit = (e) => {
        e.preventDefault();

    }


    return (
        <div>
            <MyNavbar />
            <div className="container">


                <h1 className="mt-5 mb-4 text-center display-4 text-light">Sign Up</h1>


                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>


                    <Form  >

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="firstName">
                                    <Form.Control name="firstName" type="text" placeholder="First Name" className="bg-light mt-3" value={firstName} onChange={e => setfirstName(e.target.value)} />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="lastName">
                                    <Form.Control name="lastName" type="text" placeholder="Last Name" className="bg-light mt-3" value={lastName} onChange={e => setlastName(e.target.value)} />
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="username">
                                    <Form.Control name="username" type="text" placeholder="Username" className="bg-light mt-3" value={username} onChange={e => setUsername(e.target.value)} />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control name="email" type="email" placeholder="Email" className="bg-light mt-3" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" name="password" placeholder="Password" className="mt-3" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3 w-100" >
                            Sign Up
            </Button>

                        <p className="mt-2"><Link className="text-muted text-decoration-none" to="/login">Already have an account?</Link></p>

                    </Form>
                </div>
            </div>
        </div>
    )
}





const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(SignUp);