import React, { useEffect, Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchSymbols } from '../../actions/securities.js';
import { autoLogin, logout } from '../../actions/auth.js';
import { loadUser } from '../../actions/user.js';

function MyNavbar(props) {

  const [symbol, setSymbol] = useState();
  const [show, setShow] = useState(false);

  MyNavbar.propTypes = {
    searchSymbols: PropTypes.func.isRequired,
    autoLogin: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    noSearch: PropTypes.bool,
    results: PropTypes.object,
    listLoading: PropTypes.bool
  }

  useEffect(() => {
    if (!props.isAuthenticated) {
      const value = `; ${document.cookie}`;
      var cookie = ""
      if (value.includes("OmegaToken")) {
        const parts = value.split(`; ${'OmegaToken'}=`);
        if (parts.length === 2) {
          cookie = parts.pop().split(';').shift();
        }
        if (cookie.length !== 0) {
          props.autoLogin(cookie)
        }
      }
    }
  }, [])


  if (props.isAuthenticated && props.user === null) {
    props.loadUser()
  }




  const onKeyUp = (e) => {
    props.searchSymbols(symbol);
  }

  const dropDown = () => {
    return (
      <div className="dropdown-nav">
        {
          props.results.map(symbol => (
            <Link to={"/chart?symbol=" + symbol.displaySymbol} className="symbol-link">
              <div className="company-symbol">{symbol.displaySymbol}</div>
              <div className="company">{symbol.description}</div>
            </Link>
          ))
        }
      </div>
    )
  }
  const noSearch = (
    <div></div>
  )
  const loading = (
    <div>Loading...</div>
  )
  return (
    <Fragment>
      <div bg="light" variant="dark" className="NavBar">
        <div className="nav-brand"><Link id="home-link" className="text-decoration-none text-dark" to="/">Omega Trading</Link></div>
        <form className="symbolSearch">
          <div className="search-nav">
            <img className="searchIcon" src='../../../static/search.png' />
            <input type="text"
              placeholder="Search"
              className="searchInput"
              value={symbol}
              onFocus={(e) => setShow(true)}
              onBlur={(e) => setShow(false)}
              onChange={e => setSymbol(e.target.value)}
              onKeyUp={onKeyUp} />
          </div>
          <div className="results-nav">
            {props.noSearch || !show ? noSearch : [(props.listLoading ? loading : dropDown())]}
          </div>
        </form>
        {props.isAuthenticated ?
          <div className="accountButtons">
            <Link to='/lobby' className="accountLink">Lobby</Link>
            <Link to='/account' className="accountLink">Account</Link>
            <button onClick={(e) => props.logout()} className="logout">Logout</button>
          </div>
          :
          <div className="navLoginSignup">
            <Link to="/login" className="navLogin">Login</Link>
            <Link to="/sign-up" className="navSignup">Signup</Link>
          </div>
        }
      </div>
    </Fragment>
  )
}


const mapStateToProps = (state) => ({
  results: state.securities.results,
  noSearch: state.securities.noSearch,
  listLoading: state.securities.listLoading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user
});

export default connect(mapStateToProps, { searchSymbols, autoLogin, loadUser, logout })(MyNavbar);
