import logo from './logo.svg';
import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Landingpage from './components/views/Landingpage/Landingpage'
import Loginpage from './components/views/Loginpage/Loginpage'
import Registerpage from './components/views/Registerpage/Registerpage'
import Navbar from './components/views/Navbar/Navbar'
import Footer from './components/views/Footer/Footer'

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/" component={Landingpage} />
          <Route exact path="/login" component={Loginpage} />
          <Route exact path="/register" component={Registerpage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
