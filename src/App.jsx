import React, { useState} from "react";
import {
  HashRouter as Router,
  // Redirect,
  Route,
  Switch,
} from "react-router-dom";
import './App.css';
import Landing from "./Pages/Landing/Landing";
import LoginPage from "./Pages/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/PMDashboard">
              {/* {state.user ? (
                state.userType === 1 ? (<StudentDashboard />) :
                  (<Redirect to="/Login" />)
              ) : <Redirect to="/Login" />} */}
            </Route>
            <Route path="/EMPDashboard">
              {/* {state.user ? (
                state.userType === 2 ? (<FnA />) :
                  (<Redirect to="/Login" />)
              ) : <Redirect to="/Login" />} */}
            </Route>
            <Route path="/Login">
              <LoginPage/>
              {/* {
                state.user === null ? (<Login />) : (
                  state.userType === 1 && (<Redirect to="/studentDashboard" />) ||
                  state.userType === 2 && (<Redirect to="/FnADashBoard" />) ||
                  state.userType === 3 && (<Redirect to="/HODDashboard" />)
                )
              } */}
            </Route>
            <Route exact path="/">
              <Landing />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
