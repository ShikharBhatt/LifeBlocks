import React, { Component } from "react";
import { HashRouter, Route, Switch, BrowserRouter } from "react-router-dom";
// import { renderRoutes } from 'react-router-config';
import Loadable from "react-loadable";
import "./App.scss";
import { Cards } from "./views";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = Loadable({
  loader: () => import("./containers/DefaultLayout"),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import("./views/Pages/Login"),
  loading
});

const Register = Loadable({
  loader: () => import("./views/Pages/Register"),
  loading
});

const Page404 = Loadable({
  loader: () => import("./views/Pages/Page404"),
  loading
});

const Page500 = Loadable({
  loader: () => import("./views/Pages/Page500"),
  loading
});

class App extends Component {
  //not  null redirect to dashboard

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/dashboard" name="Dashboard" component={DefaultLayout} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
