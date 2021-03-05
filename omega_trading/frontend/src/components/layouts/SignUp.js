import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Link} from 'react-router-dom';
import MyNavbar from './MyNavbar';



class SignUp extends Component {

    state = {
        firstName:'',
        lastName:'',
        email:'',
        password : ''
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
  

<h1 className="mt-5 mb-4 text-center display-4 text-light">Sign Up</h1>


  <div className="m-auto text-center"style={{maxWidth:'400px'}}>
  

            <Form  >

                <div className="row">
                    <div className="col-6">
                    <Form.Group controlId="firstName">
                    <Form.Control name="firstName" type="text" placeholder="First Name" className="bg-light mt-3" value={this.state.firstName} onChange={this.onChange}/>
                </Form.Group>
                    </div>
                    <div className="col-6">
                    <Form.Group controlId="lastName">
                    <Form.Control name="lastName" type="text" placeholder="Last Name" className="bg-light mt-3" value={this.state.lastName} onChange={this.onChange}/>
                </Form.Group>
                    </div>
                </div>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control name="email" type="email" placeholder="Email" className="bg-light mt-3" value={this.state.email} onChange={this.onChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" name="password" placeholder="Password"  className="mt-3" value={this.state.password} onChange={this.onChange}/>
                </Form.Group>
               
                <Button variant="primary" type="submit" className="mt-3 w-100" >
                    Sign Up
                </Button>
                
                <p className="mt-2"><Link className="text-muted text-decoration-none" to="/login">Already have an account?</Link></p>

            </Form>
        </div>  
     </div>
     </div>
    )
  }   
}

export default SignUp;