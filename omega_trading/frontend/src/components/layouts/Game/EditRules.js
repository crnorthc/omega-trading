/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Loader from "../Tools/Loader";
// import './Rules.scss'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editGame } from "../../../actions/game";
import ButtonLoader from "../Tools/ButtonLoader";

function EditRules(props) {
 const [amount, setAmount] = useState("$50,000");
 const [commission, setCommission] = useState(null);
 const [date, setDate] = useState(null);
 const [minDate, setMinDate] = useState(null);
 const [current, setCurrent] = useState(null);
 const [end, setEnd] = useState(null);
 const [hour, setHour] = useState(null);
 const [min, setMin] = useState("00");
 const [options, setOptions] = useState(null);
 const [type, setType] = useState("AM");
 const [max, setMax] = useState(null);
 const [zone, setZone] = useState(null);
 const [error, setError] = useState("");

 var start_amounts = [
  "$50,000",
  "$100,000",
  "$250,000",
  "$500,000",
  "$1,000,000",
 ];

 EditRules.propTypes = {
  editGame: PropTypes.func.isRequired,
  making_edit: PropTypes.bool,
  game: PropTypes.object,
 };

 const selected = {
  "background-color": "rgb(175, 175, 175)",
 };

 const not = {
  "background-color": "rgba(220, 220, 220)",
 };

 if (minDate == null) {
  const current = new Date();
  const year = current.getFullYear();

  var month = current.getMonth() + 1;
  if (month.toString().length == 1) {
   month = "0" + month;
  }

  var day = current.getDate();
  if (day.toString().length == 1) {
   day = "0" + day;
  }

  setMinDate(year + "-" + month + "-" + day);
 }

 if (date == null) {
  if (props.game.commission == null) {
   setCommission("Disabled");
  } else {
   setCommission("$" + props.game.commission);
  }

  var month = props.game.time.month.toString();
  if (month.length == 1) {
   month = "0" + month;
  }

  var day = props.game.time.day.toString();
  if (day.length == 1) {
   day = "0" + day;
  }

  var minute = props.game.time.minute.toString();
  if (minute.length == 1) {
   minute = "0" + minute;
  }

  var timezone = new Date()
   .toLocaleTimeString(undefined, { timeZoneName: "short" })
   .split(" ")[2];

  setMin(minute);
  setZone(timezone);
  setHour(props.game.time.hour);
  setType(props.game.time.type);
  setOptions(props.game.options);
  setCurrent((Date.now() / 1000).toFixed(0));
  setDate(props.game.time.year + "-" + month + "-" + day);
  setMax(props.game.time.year + 1 + "-" + month + "-" + day);
  setAmount(
   "$" +
    props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  setEnd({
   year: props.game.time.year,
   month: props.game.time.month,
   day: props.game.time.day,
  });
  setDate(props.game.time.year + "-" + month + "-" + day);
 }

 const commissions = () => {
  var values = ["Disabled"];
  for (let i = 0.99; i < 20; i++) {
   values.push("$" + i.toFixed(2));
  }
  return values;
 };

 const choices = (values) => {
  var choices = [];

  for (const value in values) {
   choices.push(<option value={values[value]}>{values[value]}</option>);
  }
  return choices;
 };

 const handleDate = (date) => {
  var month = Number(date.substring(5, 7));
  var day = Number(date.substring(8));
  var year = Number(date.substring(0, 4));

  setEnd({
   year: year,
   month: month,
   day: day,
  });
  setDate(date);
 };

 const checkDate = () => {
  var end_hour = Number(hour);
  if (type == "PM") {
   end_hour += 12;
  }

  var end_time = (
   new Date(end.year, end.month - 1, end.day, end_hour, Number(min)).getTime() /
   1000
  ).toFixed(0);

  if (end_time - current <= 43200) {
   return false;
  } else {
   return true;
  }
 };

 const editRules = () => {
  if (checkDate()) {
   setError("");
   var comish = commission;
   if (commission == "Disabled") {
    comish = null;
   }

   const end_time = {
    hour: Number(hour),
    min: Number(min),
    type: type,
   };
   props.editGame(amount, end, end_time, comish, options, props.game.room_code);
   props.edit(false);
  } else {
   setError("The game cannot end within 12 hours of the current time");
  }
 };

 if (date !== null) {
  return (
   <div className='game_rules fc jc-s'>
    <div className='rules-row'>
     <div className='parameter'>
      <div className='rule-name-left'>Start Amount</div>
      <select
       className='start-input'
       placeholder='0'
       value={amount}
       onChange={(e) => setAmount(e.target.value)}
      >
       {choices(start_amounts)}
      </select>
     </div>
     <div className='parameter'>
      <div className='rule-name-right'>End Date: {zone}</div>
      <div className='fr'>
       <input
        onChange={(e) => handleDate(e.target.value)}
        type='date'
        className='date-input'
        value={date}
        min={minDate}
        max={max}
       />
       <div className='time-choice'>
        <select
         className='time-input'
         value={hour}
         onChange={(e) => setHour(e.target.value)}
        >
         {choices([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
        </select>
        <select
         className='time-input'
         value={min}
         onChange={(e) => setMin(e.target.value)}
        >
         {choices(["00", "15", "30", "45"])}
        </select>
        <select
         className='time-input'
         value={type}
         onChange={(e) => setType(e.target.value)}
        >
         {choices(["AM", "PM"])}
        </select>
       </div>
      </div>
     </div>
    </div>
    <div className='rules-row'>
     <div className='parameter'>
      <div className='rule-name-left'>Commision</div>
      <select
       className='start-input'
       placeholder='0'
       value={commission}
       onChange={(e) => setCommission(e.target.value)}
      >
       {choices(commissions())}
      </select>
     </div>
     <div className='parameter'>
      <div className='rule-name-right'>Options</div>
      <div className='yesnoCont fr jc-s'>
       <button
        style={options ? selected : not}
        onClick={() => setOptions(true)}
        className='yes'
       >
        Yes
       </button>
       <button
        style={!options ? selected : not}
        onClick={() => setOptions(false)}
        className='no'
       >
        No
       </button>
      </div>
     </div>
    </div>
    <div className='fr jc-s mmy lmx'>
     <button onClick={() => props.edit(false)} className='editButton'>
      Cancel
     </button>
     <button onClick={() => editRules()} className='editButton'>
      {props.making_edit ? <ButtonLoader /> : "Confirm"}
     </button>
    </div>
    <div className='fr jc-c f16' style={{ color: "red" }}>
     {error}
    </div>
   </div>
  );
 } else {
  return <Loader page={false} />;
 }
}

const mapStateToProps = (state) => ({
 game: state.game.game,
 making_edit: state.game.making_change,
});

export default connect(mapStateToProps, { editGame })(EditRules);
