import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Link} from 'react-router-dom';
import MyNavbar from './MyNavbar';



class ForgotPassword extends Component {

    state = {
        email:'',
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

<div className ="container">
  

<h1 className="mt-5 mb-4 text-center display-4 text-light">Forgot Password</h1>


  <div className="m-auto text-center"style={{maxWidth:'400px'}}>
  

            <Form  >
                <Form.Group controlId="email">
                    <Form.Control name="email" type="email" placeholder="Enter Email" className="bg-light mt-3" value={this.state.email} onChange={this.onChange}/>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100" >
                    Send Email
                </Button>
               
                <p className="mt-2"><Link className="text-muted text-decoration-none" to="/forgot-password">Resend Email</Link></p>

            </Form>
        </div>  
     </div>
     </div>
    )
  }   
}

export default ForgotPassword;