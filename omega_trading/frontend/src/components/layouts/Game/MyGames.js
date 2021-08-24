/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable indent */
import React from "react";
import { currentGames } from "../../../actions/game";
import Loader from "../Tools/Loader";
import { Link } from "react-router-dom";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import "../../../variables.scss";
// import "../../../custom.scss";

function MyGames(props) {
 MyGames.propTypes = {
  // eslint-disable-next-line indent
  currentGames: PropTypes.func.isRequired,
  selecting_game: PropTypes.bool,
  games: PropTypes.object,
 };

 if (props.games == null) {
  props.currentGames();
 }

 const formatDate = (date) => {
  var month = date.month.toString();
  if (month.length == 1) {
   month = "0" + date.month;
  }

  var day = date.day.toString();
  if (day.length == 1) {
   day = "0" + date.day;
  }

  var min = date.minute;
  if (min == 0) {
   min = "00";
  }

  return (
   date.hour +
   ":" +
   min +
   " " +
   date.type +
   " " +
   month +
   "/" +
   day +
   "/" +
   date.year
  );
 };

 const formatDuration = (duration) => {
  var day = " days ";
  if (duration.days == 1) {
   day = " day ";
  }

  var hour = " hours ";
  if (duration.hours == 1) {
   hour = " hour ";
  }

  return duration.days + day + duration.hours + hour + duration.mins + " mins";
 };

 const getGames = () => {
  var games = [];

  for (const game in props.games) {
   var status = "Pregame";
   if (props.games[game].status) {
    status = "Trading";
   }

   games.push(
    <Link
     to={"/game?room_code=" + props.games[game].room_code}
     className='toGame'
    >
     <div className='fr text-gray-50 mmx mmy ai-c jc-s'>
      <div className='fr'>
       <div className='fc jc-c mmr'>{status}</div>
       <div className='fc'>
        <div className='fr ai-b'>
         <div className='f22 bld'>{props.games[game].name}:</div>
         <div className='f18 sml'>{props.games[game].room_code}</div>
        </div>
        <div className='fr ai-b'>
         <div className='f18 bld'>Host:</div>
         <div className='f16 sml'>{props.games[game].host}</div>
        </div>
       </div>
      </div>
      <div className='fc ai-e'>
       {props.games[game].end == undefined ? (
        <div className='fr jc-e ai-b'>
         <div className='f22 bld'>Ends:</div>
         <div className='f18 sml'>
          {formatDuration(props.games[game].duration)}
         </div>
        </div>
       ) : (
        <div className='fr jc-e ai-b'>
         <div className='f22 bld'>Ends:</div>
         <div className='f18 sml'>{formatDate(props.games[game].end)}</div>
        </div>
       )}
       <div className='fr jc-e ai-b'>
        <div className='f18 bld'>Members:</div>
        <div className='f18 sml'>{props.games[game].size}</div>
       </div>
      </div>
     </div>
    </Link>
   );
  }
  return games;
 };

 if (props.games == null) {
  return <Loader page={false} />;
 } else {
  return (
   <div className='b bg-main-dark smx'>
    <div className='h63 fr text-main-text ai-c jc-c st'>Current Games</div>
    {props.games != false ? (
     getGames()
    ) : (
     <div className='no-history'>You do not have any active games.</div>
    )}
   </div>
  );
 }
}

const mapStateToProps = (state) => ({
 selecting_game: state.game.selecting_game,
 games: state.game.games,
});

export default connect(mapStateToProps, { currentGames })(MyGames);
