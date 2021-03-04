import AuthPage from "./Auth/Auth.js";
import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import {
    Route,
    Switch,
    Redirect,
    BrowserRouter as Router
} from "react-router-dom";
import "../../static/css/Auth.scss";


export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Fragment>
                    <div className="container">
                        <Switch>
                            <Route exact path='/auth' component={AuthPage} />
                        </Switch>
                    </div>
                </Fragment>
            </Router>
        )
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);