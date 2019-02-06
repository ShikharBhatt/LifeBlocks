import React, { Component } from "react";
import LoginForm from "./components/Login";
import { connect } from "react-redux";
import renderApp from "./index";
import Main from "./pages/Main";
import { bindActionCreators } from "redux";
import { loadState, saveState } from "./localStorage";
import { isNullOrUndefined } from "util";
import { withRouter, Switch } from "react-router-dom";

//import { browserHistory } from "react-router";
//const persistedState = loadState();
import { HashRouter, Redirect, BrowserRouter } from "react-router-dom";
import Dashboard from "pages/Dashboard";
import Components from "pages/Components";
import UserProfile from "pages/UserProfile";
import MapsPage from "pages/MapsPage";
import Forms from "pages/Forms";
import Charts from "pages/Charts";
import Calendar from "pages/Calendar";
import Tables from "pages/Tables";
import Mypage from "pages/Mypage";
import UserInfo from "pages/UserProfile/UserInfo";
import { Router, Route, browserHistory } from "react-router";
class App extends Component {
  // state = { user: null };

  render() {
    //this.props.attach(persistedState.name);

    <Switch>
      <Route path="/" component={LoginForm} />
      <Route path="/mypage" component={Mypage} default />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/components" component={Components} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/forms" component={Forms} />
      <Route path="/tables" component={Tables} />
      <Route path="/maps" component={MapsPage} />
      <Route path="/charts" component={Charts} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/userInfo" component={UserInfo} />
    </Switch>;

    console.log("appSign", this.props.user);
    alert("checking for undefined in APP JS!");
    if (this.props.user.name === undefined) {
      return (
        <div>
          <LoginForm />
        </div>

        //this.props.history.push("/login");
      );
    } else {
      alert("you have that!");
      return <Main />;
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    attach: toname => {
      dispatch({
        type: "EXAMPLE_TWO",
        payload: toname
      });
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
