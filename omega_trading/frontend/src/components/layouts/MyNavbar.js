import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchSymbols } from '../../actions/securities';

function MyNavbar(props) {

  const [symbol, setSymbol] = useState()

  MyNavbar.propTypes = {
    searchSymbols: PropTypes.func.isRequired,
    noSearch: PropTypes.bool,
    results: PropTypes.object,
    listLoading: PropTypes.bool
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
        <div className="nav-brand"><Link id="home-link" className="text-decoration-none text-dark" to="/login">Omega Trading</Link></div>
        <form className="symbolSearch">
          <div className="search-nav">
            <img className="searchIcon" src='../../../static/search.png' />
            <input type="text"
              placeholder="Search"
              className="searchInput"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              onKeyUp={onKeyUp} />
          </div>
          <div className="results-nav">
            {props.noSearch ? noSearch : [(props.listLoading ? loading : dropDown())]}
          </div>
        </form>
        <div className="navLoginSignup">
          <Link to="/login" className="navLogin">Login</Link>
          <Link to="/sign-up" className="navSignup">Signup</Link>
        </div>
      </div>
    </Fragment>
  )
}


const mapStateToProps = (state) => ({
  results: state.securities.results,
  noSearch: state.securities.noSearch,
  listLoading: state.securities.listLoading
});

export default connect(mapStateToProps, { searchSymbols })(MyNavbar);
