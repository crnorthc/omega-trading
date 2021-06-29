import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import MyNavbar from './MyNavbar';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendReset } from "../../actions/auth";

function ForgotPassword(props) {
    const [email, setEmail] = useState('');
    ForgotPassword.propTypes = {
        sendReset: PropTypes.func.isRequired,
        emailSent: PropTypes.bool
    };
    const onSubmit = () => {
        props.sendReset(email);
    };
    const notSent = (
        <div>
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Forgot Password</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>
                    <Form  >
                        <Form.Group controlId="email">
                            <Form.Control name="email" type="email" placeholder="Enter Email" className="bg-light mt-3" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                            Send Email
                        </Button>
                        <p className="mt-2"><Link className="text-muted text-decoration-none" to="/forgot-password">Resend Email</Link></p>
                    </Form>
                </div>
            </div>
        </div>
    )

    const sent = (
        <h1 className="mt-5 mb-4 text-center display-4 text-light">Check Email for Reset Password Link</h1>
    )


    if (props.emailSent) {
        return sent;
    }
    else {
        return notSent;
    }
}

const mapStateToProps = (state) => ({
    emailSent: state.auth.emailSent
});

export default connect(mapStateToProps, { sendReset })(ForgotPassword);