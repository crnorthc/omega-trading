import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { loadLeaderboard } from '../../actions/user';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";



function Leaderboard(props) {

    const [type, setType] = useState('overall')

    Leaderboard.propTypes = {
        loadLeaderboard: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        loading: PropTypes.bool,
        leaderboard: PropTypes.object
    }

    if (!props.isAuthenticated) {
        return <Redirect to='/login' />
    }

    useEffect(() => {
        if (props.leaderboard == null) {
            props.loadLeaderboard()
        }
    })

    const getRankings = () => {
        var rankings
        if (type == 'overall') {
            rankings = props.leaderboard['overall']
        }
        else {
            rankings = props.leaderboard['friends']
        }

        var rank_list = []

        for (const rank in rankings) {
            rank_list.push(
                <div className='rank fr ai-c jc-s'>
                    <div className='rank-username'>{(Number(rank) + 1) + '. ' + rankings[rank].username}</div>
                    <div className='rank-amount'>${rankings[rank].worth.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                </div>
            )
        }

        return rank_list
    }

    const style = {
        "background-color": "rgb(202, 202, 202)"
    }

    if (props.loading || props.leaderboard == null) {
        return (
            <div className="pageContainer">
                <div className='loaderContainer'>
                    <div className='loader' />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="pageContainer">
                <div className='leaderboard-title'>Leaderboard</div>
                <div className='Leaderboard'>
                    <div className='leaderboard-buttons'>
                        <button style={type == 'overall' ? style : null} onClick={(e) => setType('overall')} className='leaderboard-button'>Overall</button>
                        <button style={type == 'friends' ? style : null} onClick={(e) => setType('friends')} className='leaderboard-button'>Friends</button>
                    </div>
                    <div className='rankings'>
                        {getRankings()}
                    </div>
                </div>
            </div>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.user.loading,
    leaderboard: state.user.leaderboard
});

export default connect(mapStateToProps, { loadLeaderboard })(Leaderboard);