import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";


export default function AuthPage(props) {

    return (
        <div className="Auth">
            <h1 align="center" >Omega Trading</h1>
            <ButtonGroup className="AuthButtons" aria-label="First Group">
                <Button className="Login">Login</Button>
                <Button className="SignUp">SignUp</Button>
            </ButtonGroup>
        </div>
    )
}