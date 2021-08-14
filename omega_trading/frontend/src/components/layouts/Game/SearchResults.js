/* eslint-disable react/jsx-key */
import React from 'react'
import { Link } from 'react-router-dom'
import './game.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { populateSearch } from '../../../actions/game'
import Loader from '../Tools/Loader'



function SearchResults(props) {

    SearchResults.propTypes = {
        populateSearch: PropTypes.func.isRequired,
        search_made: PropTypes.bool,
        search: PropTypes.array,
    }

    const formatDate = (date) => {
        var month = date.month.toString()
        if (month.length == 1) {
            month = '0' + date.month
        }

        var day = date.day.toString()
        if (day.length == 1) {
            day = '0' + date.day
        }

        var min = date.minute
        if (min == 0) {
            min = '00'
        }

        return date.hour + ':' + min + ' ' + date.type + ' ' + month + '/' + day + '/' + date.year
    
    }

    const formatDuration = (duration) => {
        var day = ' days '
        if (duration.days == 1) {
            day = ' day '
        }

        var hour = ' hours '
        if (duration.hours == 1) {
            hour = ' hour '
        }

        return duration.days + day + duration.hours + hour + duration.mins + ' mins' 
    }

    const getGames = () => {
        var games = []

        for (const game in props.search) {
            var status = 'Pregame'
            if (props.search[game].status) {
                status = 'Trading'
            }

            games.push(
                <Link to={'/game?room_code=' + props.search[game].room_code} className='toGame'>
                    <div className='fr mmx mmy ai-c jc-s'>
                        <div className='fr'>
                            <div className='fc jc-c mmr'>
                                {status}
                            </div>
                            <div className='fc'>
                                <div className='fr ai-b'>
                                    <div className='f22 bld'>{props.search[game].name}:</div>
                                    <div className='f18 sml'>{props.search[game].room_code}</div>
                                </div>
                                <div className='fr ai-b'>
                                    <div className='f18 bld'>Host:</div>
                                    <div className='f16 sml'>{props.search[game].host}</div>
                                </div>
                            </div>
                        </div>                                        
                        <div className='fc ai-e'>
                            {props.search[game].end == undefined ? 
                                <div className='fr jc-e ai-b'>
                                    <div className='f22 bld'>Ends:</div>
                                    <div className='f18 sml'>{formatDuration(props.search[game].duration)}</div>
                                </div>
                                :
                                <div className='fr jc-e ai-b'>
                                    <div className='f22 bld'>Ends:</div>
                                    <div className='f18 sml'>{formatDate(props.search[game].end)}</div>
                                </div>
                            }                            
                            <div className='fr jc-e ai-b'>
                                <div className='f18 bld'>Members:</div>
                                <div className='f18 sml'>{props.search[game].size}</div>
                            </div>                        
                        </div>
                    </div>
                </Link>
            )
        }
        return games
    }


    if (props.search == null) {
        props.populateSearch()
        return <Loader page={false} />
    }
    else {
        return (       
            <div className='results'>
                {props.search != 'empty' ? getGames() :
                    (
                        <div className='no-history'>No Games Found</div>
                    )}
            </div>       
        )
    }
}


const mapStateToProps = (state) => ({
    search: state.game.search,
    search_made: state.game.search_made
})

export default connect(mapStateToProps, { populateSearch })(SearchResults)