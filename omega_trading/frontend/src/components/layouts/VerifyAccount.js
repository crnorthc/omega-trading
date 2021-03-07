import React, { useState, Component } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, Redirect } from 'react-router-dom';
import MyNavbar from './MyNavbar'
import queryString from 'query-string';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { verifyEmail } from "../../actions/auth";

function VerifyAccount(props) {

    const [code, setCode] = useState('');

    VerifyAccount.propTypes = {
        verifyEmail: PropTypes.func.isRequired,
        emailVerified: PropTypes.bool,
        error: PropTypes.bool,
        error_message: PropTypes.string
    }

    const onSubmit = () => {
        props.verifyEmail(code);
    }


    if (props.emailVerified) {
        return <Redirect to="/login" />
    }

    const values = queryString.parse(props.location.search);

    if (!props.error) {
        const keys = Object.keys(values);
        if (keys.length != 0) {
            if (keys[0] != "code") {
                props.verifyEmail(values.verification_code);
            }
        }
    }

    return (

        <div>
            <MyNavbar />
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Verify Account</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>

                    <Form >
                        <Form.Group controlId="code">
                            <Form.Control name="code" type="text" placeholder="Enter code" className="bg-light mt-3" value={code} onChange={e => setCode(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                            Verify Account
                        </Button>

                        <p className="mt-2"><Link className="text-muted text-decoration-none" to="/ForgotPassword">Resend Code</Link></p>

                    </Form>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    emailVerified: state.auth.emailVerified,
    error: state.auth.error,
    error_message: state.auth.error_message
});

export default connect(mapStateToProps, { verifyEmail })(VerifyAccount);