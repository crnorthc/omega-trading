/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import React from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { populateSearch } from '../../../actions/game'
import Loader from '../Tools/Loader'
import GameItem from './GameItem'

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

  return (
   date.hour +
   ':' +
   min +
   ' ' +
   date.type +
   ' ' +
   month +
   '/' +
   day +
   '/' +
   date.year
  )
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

   games.push({
    game: props.search[game],
    roomCode: props.search[game],
   })
  }

  return (
   <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 px-4'>
    {games.map((game, index) => (
     <GameItem game={game} key={game.roomCode} index={index} />
    ))}
   </div>
  )
 }

 if (props.search == null) {
  props.populateSearch()
  return <Loader page={false} />
 } else {
  return (
   <div className='results'>
    {props.search != 'empty' ? (
     getGames()
    ) : (
     <div className='no-history'>No Games Found</div>
    )}
   </div>
  )
 }
}

const mapStateToProps = (state) => ({
 search: state.game.search,
 search_made: state.game.search_made,
})

export default connect(mapStateToProps, { populateSearch })(SearchResults)
