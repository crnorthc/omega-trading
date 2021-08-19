/* eslint-disable react/jsx-key */
import React from 'react'
import { Link } from 'react-router-dom'
// import './game.scss'

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

                {game: props.search[game],
                 roomCode: props.search[game].room_code,
                 name: props.search[game].name,
                 duration: props.search[game].duration,
                 date: props.search[game].end,
                 host: props.search[game].host,
                 members: props.search[game].members
                }
            )
        }

       
        return (
          <div className='flex-1 text-white h-full'>
            <div className='flex flex-col'>
              <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                  <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            Name
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            Players
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            Ends On
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {games.map((game) => (
                          <tr key={game.roomCode}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-900'>
                                {game.name}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {game.roomCode}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className='px-2 inline-flex text-xs leading-5 font-semibold  '>
                                {game.members}
                              </span>
                            </td>
                           
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        );
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