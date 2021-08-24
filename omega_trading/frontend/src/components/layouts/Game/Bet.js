/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { getQuote } from "../../../actions/securities";
// import './Rules.scss'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "../Tools/Loader";

function Bet(props) {
 const [quantity, setQuantity] = useState(0);
 const [crypto, setCrypto] = useState("eth");

 Bet.propTypes = {
  getQuote: PropTypes.func.isRequired,
  crypto: PropTypes.object,
 };

 const selected = {
  "background-color": "rgb(175, 175, 175)",
 };

 const setQuan = (e) => {
  setQuantity(Number(e));
 };

 const getETH = () => {
  return (quantity / props.crypto.ETH).toFixed(4);
 };

 if (props.crypto == null) {
  props.getQuote("BTC,ETH");
 }

 if (props.crypto == null) {
  return (
   <div className='bet-box'>
    <div className='bet-page'>
     <Loader page={false} />
    </div>
   </div>
  );
 } else {
  return (
   <div className='bet-box'>
    <div className='bet-page'>
     <div className='fr bb'>
      <button
       style={crypto == "eth" ? selected : null}
       onClick={() => setCrypto("eth")}
       className='crypto-choice st br ai-c'
      >
       ETH
      </button>
      <button
       style={crypto == "btc" ? selected : null}
       onClick={() => setCrypto("btc")}
       className='crypto-choice st ai-c'
      >
       BTC
      </button>
     </div>
     <div className='input-bet-box fc jc-c'>
      <div className='rules-row'>
       <div className='paremeter'>
        <div className='f22 rule-name-left'>Bet</div>
        <div className='fr ai-c jc-s'>
         <div className='f jc-st'>
          <span className='currency'>$</span>
         </div>
         <input
          className='bet-input'
          onChange={(e) => setQuan(e.target.value)}
          placeholder={quantity.toFixed(2)}
          type='number'
         />
        </div>
       </div>
       <div className='paremeter'>
        <div className='f22 rule-name-right' />
        <div className='fc ai-e'>
         <div className='fr ai-e'>
          <div className='f22'>{getETH()}</div>
          <div className='f22 bld tml'>ETH</div>
         </div>
         <div className='fr'>
          <div className='tt lt tml'>
           $
           {props.crypto.ETH.toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className='tt lt tml'>as of {props.crypto.time}</div>
         </div>
        </div>
       </div>
      </div>
      <div className='fr lmy ai-c jc-c'>
       <button onClick={() => props.show()} className='editButton'>
        Confirm
       </button>
      </div>
     </div>
    </div>
   </div>
  );
 }
}

const mapStateToProps = (state) => ({
 crypto: state.securities.crypto,
});

export default connect(mapStateToProps, { getQuote })(Bet);
