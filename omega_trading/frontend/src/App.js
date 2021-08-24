import Login from "./components/layouts/Auth/Login.js";
import SignUp from "./components/layouts/Auth/SignUp.js";
import VerifyAccount from "./components/layouts/Auth/VerifyAccount.js";
import ForgotPassword from "./components/layouts/Auth/ForgotPassword.js";
import ResetPassword from "./components/layouts/Auth/ResetPassword.js";
import MyGames from "./components/layouts/Game/MyGames.js";
import Symbol from "./components/layouts/Securities/Symbol.js";
import MyNavbar from "./components/layouts/MyNavbar.js";
import Account from "./components/layouts/Account.js";
import NewHome from "./components/layouts/NewHome.js";
import Auth from "./components/layouts/Auth/Auth";
import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
//import NewRules from './components/layouts/Game/NewRules.js'
import NewGame from "./components/layouts/Game/NewGame.js";
import GameMode from "./components/layouts/Game/GameMode.js";
import JoinGame from "./components/layouts/Game/JoinGame";
import Game from "./components/layouts/Game/Game.js";
import SearchGame from "./components/layouts/Game/SearchGame.js";
import { searchGames } from "./actions/game.js";
import NormalMode from "./components/layouts/Game/NormalMode";
import GameLength from "./components/layouts/Game/GameLength";
import ShortGame from "./components/layouts/Game/ShortGame";
import LongGame from "./components/layouts/Game/LongGame";
import TournamentMode from "./components/layouts/Game/TournamentMode";
import Tournament from "./components/layouts/Game/Tournament";

function App() {
 return (
  <Router>
   <MyNavbar />
   <Auth>
    <Switch>
     <Route exact path='/chart' component={Symbol} />
     <Route exact path='/search' component={SearchGame} />
     <Route exact path='/reset-password' component={ResetPassword} />
     <Route exact path='/account' component={Account} />
     <Route exact path='/game' component={Game} />
     <Route exact path='/my-games' component={MyGames} />
     <Route exact path='/new-game' component={NewGame} />
     <Route exact path='/game-mode' component={GameMode} />
     <Route exact path='/normal-mode' component={NormalMode} />
     <Route exact path='/game-length' component={GameLength} />
     <Route exact path='/short-game' component={ShortGame} />
     <Route exact path='/long-game' component={LongGame} />
     <Route exact path='/tournament-mode' component={TournamentMode} />
    </Switch>
   </Auth>
   <Switch>
    <Route exact path='/' component={SearchGame} />
    <Route exact path='/forgot-password' component={ForgotPassword} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/sign-up' component={SignUp} />
    <Route exact path='/verify-account' component={VerifyAccount} />
   </Switch>
  </Router>
 );
}
//<Route exact path='/rules' component={NewRules} />

export default App;
