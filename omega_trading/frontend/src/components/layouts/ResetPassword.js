import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Link} from 'react-router-dom';
import MyNavbar from './MyNavbar';



class ForgotPassword extends Component {

    state = {
        firstPassword:'',
        secondPassword:'',
    }

    onChange = e => {
    this.setState({ [e.target.name]: e.target.value})
    console.log(this.state.[e.target.name]);
    }

    onSubmit = (e) => {
        e.preventDefault();
        
    }


    render(){

    return (
    <div>
<MyNavbar/>
          
<div className="container">
  

<h1 className="mt-5 mb-4 text-center display-4 text-light">Reset Password</h1>


  <div className="m-auto text-center"style={{maxWidth:'400px'}}>
  

            <Form  >
                <Form.Group controlId="firstPassword">
                    <Form.Control name="firstPassword" type="password" placeholder="Enter Password" className="bg-light mt-3" value={this.state.firstPassword} onChange={this.onChange}/>
                </Form.Group>
                <Form.Group controlId="secondPassword">
                    <Form.Control name="secondPassword" type="password" placeholder="Re-enter Password" className="bg-light mt-3" value={this.state.secondPassword} onChange={this.onChange}/>
                </Form.Group>


                <Button variant="primary" type="submit" className="mt-3 w-100" >
                <Link className="text-dark text-decoration-none"  to="/login">Login</Link>
                </Button>
            </Form>
        </div>  
     </div>
     </div>
    )
  }   
}

export default ForgotPassword;