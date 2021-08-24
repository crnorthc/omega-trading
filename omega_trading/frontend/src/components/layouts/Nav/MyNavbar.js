/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
// import './nav.scss'

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchSymbols } from "../../../actions/securities.js";
import { logout } from "../../../actions/auth.js";

function MyNavbar(props) {
 const [symbol, setSymbol] = useState();
 const [show, setShow] = useState(false);

 MyNavbar.propTypes = {
  searchSymbols: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  noSearch: PropTypes.bool,
  results: PropTypes.object,
  listLoading: PropTypes.bool,
 };

 const onKeyUp = () => {
  props.searchSymbols(symbol);
 };

 const dropDown = () => {
  return (
   <div className='dropdown-nav'>
    {props.results.map((symbol) => (
     <Link to={"/chart?symbol=" + symbol.displaySymbol} className='symbol-link'>
      <div className='company-symbol'>{symbol.displaySymbol}</div>
      <div className='company'>{symbol.description}</div>
     </Link>
    ))}
   </div>
  );
 };

 const noSearch = <div></div>;

 const loading = <div>Loading...</div>;

 return (
  <div className='header'>
   <div className='navbar'>
    <div className='fr jc-s ai-c'>
     <Link className='this-company' to='/'>
      Omega Trading
     </Link>
     <form className='symbolSearch b'>
      <div className='search-nav'>
       <img className='searchIcon' src='../../../static/search.png' />
       <input
        type='text'
        placeholder='Search'
        className='searchInput'
        value={symbol}
        onFocus={() => setShow(true)}
        onChange={(e) => setSymbol(e.target.value)}
        onKeyUp={onKeyUp}
       />
      </div>
      <div className='results-nav'>
       {props.noSearch || !show
        ? noSearch
        : [props.listLoading ? loading : dropDown()]}
      </div>
     </form>
    </div>
    <div>
     {props.user !== null ? (
      <div className='accountButtons fr ai-c'>
       <Link to='/games' className='accountLink'>
        Games
       </Link>
       <Link to='/join' className='accountLink'>
        Join
       </Link>
       <Link to='/account' className='accountLink'>
        Account
       </Link>
       <button onClick={() => props.logout()} className='logout'>
        Logout
       </button>
      </div>
     ) : (
      <div className='navLoginSignup fr ai-c jc-c'>
       <Link to='/login' className='navLogin'>
        Login
       </Link>
       <Link to='/sign-up' className='navSignup'>
        Signup
       </Link>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}

const mapStateToProps = (state) => ({
 results: state.securities.results,
 noSearch: state.securities.noSearch,
 listLoading: state.securities.listLoading,
 user: state.user.user,
});

export default connect(mapStateToProps, { searchSymbols, logout })(MyNavbar);
