import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";


export default function AuthPage(props) {

    return (
        <div className="Auth">
            <h1 align="center" >Omega Trading</h1>
            <ButtonGroup aria-label="First Group">
                <Button variant="secondary">Login</Button>
                <Button variant="secondary">Register</Button>
            </ButtonGroup>
        </div>

    )
}