import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Friends from './Friends';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import profilePic from '../../static/profilePic.png'
import { loadUser, saveHistory } from '../../actions/user.js';


function Account(props) {

    const [username, setUsername] = useState(null);

    if (!props.isAuthenticated) {
        return <Redirect to='/login'></Redirect>
    }

    Account.propTypes = {
        loadUser: PropTypes.func.isRequired,
        saveHistory: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        user: PropTypes.object,
    }

    useEffect(() => {
        props.saveHistory()
    }, [])

    if (props.user !== null) {
        return (
            <div className="pageContainer">
                <div className="accountHeader">
                    <div className="account-left">
                        <div className="profilePic-cont">
                            <img className="profilePic" src={profilePic} width={70} />
                            <button>
                                <svg className="addPhoto" height="24" role="img" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#000" fill-rule="evenodd" />
                                    <path d="M11 13V17H13V13H17V11H13V7H11V11H7V13H11Z" fill="#000" />
                                </svg>
                            </button>
                        </div>
                        <div className="names">
                            <div className="fullName">{props.user.first_name} {props.user.last_name}</div>
                            <div className="userName">@{props.user.username}</div>
                        </div>
                    </div>
                    <div className="editProfile">
                        <button className="editButton">Edit Profile</button>
                    </div>
                </div>
                <div className='friends'>
                    <Friends friendsOnly={false} />
                </div>
            </div>
        )
    }
    else {
        return <div>User Loading</div>
    }



}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.user.user
});

export default connect(mapStateToProps, { saveHistory, loadUser })(Account);