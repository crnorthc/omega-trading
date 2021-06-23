import React, { useState, CSSProperties } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, Redirect } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import { searchSymbols } from '../../actions/securities';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Chart(props) {
    const [symbol, setSymbol] = useState()

    Chart.propTypes = {
        searchSymbols: PropTypes.func.isRequired
    }

    const onSubmit = (e) => {
        props.searchSymbols(symbol);
    }

    return (
        <div>
            <MyNavbar />
            <div className="container">
                <h1 className="mt-5 mb-4 text-center display-4 text-light">Login</h1>
                <div className="m-auto text-center" style={{ maxWidth: '400px' }}>
                    <Form  >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control name="email" type="text" placeholder="Symbol" className="bg-light mt-3" value={symbol} onChange={e => setSymbol(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" onClick={onSubmit} className="mt-3 w-100" >
                            Search
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = () => ({

});

export default connect(mapStateToProps, { searchSymbols })(Chart);