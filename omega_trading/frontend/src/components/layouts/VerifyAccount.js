import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from 'react-router-dom';
import MyNavbar from './MyNavbar'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";


function VerifyAccount(props) {

    const [code, setCode] = useState('');

    VerifyAccount.propTypes = {

    }

    const onSubmit = (e) => {
        e.preventDefault();

    }



    return (

        <div>
            <MyNavbar />
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Verify Account</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>

                    <Form  >
                        <Form.Group controlId="code">
                            <Form.Control name="code" type="text" placeholder="Enter code" className="bg-light mt-3" value={code} onChange={e => setCode(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3 w-100" >
                            Verify Account
            </Button>

                        <p className="mt-2"><Link className="text-muted text-decoration-none" to="/ForgotPassword">Resend Code</Link></p>

                    </Form>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(VerifyAccount);