import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ButtonLoader from "../Tools/ButtonLoader";
import VerifyAccount from "./VerifyAccount";
// import './Auth.scss'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../../actions/auth.js";

function Login(props) {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");

 Login.propTypes = {
  login: PropTypes.func.isRequired,
  logged_in: PropTypes.bool,
  logging_in: PropTypes.bool,
  error_message: PropTypes.string,
  emailSent: PropTypes.bool,
 };

 if (props.logged_in) {
  return <Redirect to='/' />;
 } else {
  if (props.emailSent) {
   return <VerifyAccount />;
  }
  return (
   <div>
    <div className='container'>
     <h1 className='mt-5 mb-4 text-center display-4 text-light'>Login</h1>
     <div className='m-auto text-center' style={{ maxWidth: "400px" }}>
      <div className='fc jc-c ai-c'>
       <input
        name='email'
        type='text'
        placeholder='Username'
        className='login-input'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
       />
       <input
        type='password'
        name='password'
        placeholder='Password'
        className='login-input mmt'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
       />
       <button
        onClick={() => props.login(username, password)}
        className='editButton mmt'
       >
        {props.logging_in ? <ButtonLoader /> : "Login"}
       </button>
       <div className='mmy f16 bld'>or</div>
       <div
        className='bg-light'
        style={{ height: "1px", marginTop: "-27px" }}
       />
       <p className='mt-2'>
        <Link className='text-muted text-decoration-none' to='/forgot-password'>
         Forgot Password or Username?
        </Link>
       </p>
      </div>
     </div>
    </div>
   </div>
  );
 }
}

const mapStateToProps = (state) => ({
 logged_in: state.auth.logged_in,
 logging_in: state.auth.logging_in,
 error_message: state.auth.error_message,
 emailSent: state.auth.emailSent,
});

export default connect(mapStateToProps, { login })(Login);
