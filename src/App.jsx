import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import './App.css';
import { useUser } from "./contexts/user";
import Landing from "./Pages/Landing";
import LoginPage from "./Pages/LoginPage";
import PMDashboard from "./Pages/PMDashboard"

function App() {
  const [state, dispatch] = useUser();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const type = localStorage.getItem("type");
    if (user && type) {
      dispatch({
        type: "SET_USER",
        user: JSON.parse(user),
        userType: type,
      });
    }
  }, [dispatch])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/PMDashboard">

            {state.user ? (
              state.userType === 'manager' ? (<PMDashboard />) :
                (<Redirect to="/Login" />)
            ) : <Redirect to="/Login" />}
          </Route>
          <Route path="/EMPDashboard">
            {state.user ? (
              state.userType === 'employee' ? (<div>EMPDashboard</div>) :
                (<Redirect to="/Login" />)
            ) : <Redirect to="/Login" />}
          </Route>
          <Route path="/Login">
            {
              state.user === null ? (<LoginPage />) : (
                state.userType === 'manager' ? (<Redirect to="/PMDashboard" />) : (<Redirect to="/EMPDashboard" />)
              )
            }
          </Route>
          <Route exact path="/">
            <Landing />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
