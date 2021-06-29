import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";


function Home(props) {

    Home.propTypes = {
        isAuthenticated: PropTypes.bool
    }

    return (
        <div>
            {props.isAuthenticated ? <div>Home</div> : <Redirect to="/login" />}
        </div>
    )



}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home);