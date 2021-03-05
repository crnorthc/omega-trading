import React, {Fragment} from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';




const MyNavbar = () => {

 
    return (
        <Fragment>
        <Navbar bg="primary" variant="dark" className="px-3">
        <Navbar.Brand><Link className="text-decoration-none text-light" to="/login">Robinhood</Link></Navbar.Brand>
        <Nav className="mr-auto">
         
        </Nav>
       
      </Navbar>
      </Fragment>
    )
   }


export default MyNavbar;
