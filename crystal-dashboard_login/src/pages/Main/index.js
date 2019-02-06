import React from "react";
import { Route, Router } from "react-router-dom";
import { connect } from "react-redux";
import cx from "classnames";
import { setMobileNavVisibility } from "../../reducers/Layout";
import { withRouter, Switch } from "react-router-dom";
import { Component } from "react";
//import { Router, Route, browserHistory } from "react-router";
import App from "../../App";
import Header from "./Header";
import Footer from "./Footer";
import SideBar from "../../components/SideBar";
import ThemeOptions from "../../components/ThemeOptions";
import MobileMenu from "../../components/MobileMenu";
/**
 * Pages
 */
import Dashboard from "../Dashboard";
import Components from "../Components";
import UserProfile from "../UserProfile";
import MapsPage from "../MapsPage";
import Forms from "../Forms";
import Charts from "../Charts";
import Calendar from "../Calendar";
import Tables from "../Tables";
import Mypage from "../Mypage";
import UserInfo from "../UserProfile/UserInfo";
//import UserProfile from "../UserProfile";
//import { loadState, saveState } from "../../localStorage";
import renderApp from "../../index";
import Signout from "../../components/Signout";
import LoginForm from "../../components/Login";

//const persistedState = loadState();

const Main = ({ mobileNavVisibility, hideMobileMenu, history }) => {
  history.listen(() => {
    if (mobileNavVisibility === true) {
      hideMobileMenu();
    }
  });

  //console.log("MainPersi", persistedState); //  empty;
  // function refreshPage() {
  //   window.location.reload();
  // }

  return (
    <div
      className={cx({
        "nav-open": mobileNavVisibility === true
      })}
    >
      <div className="wrapper">
        <div className="close-layer" onClick={hideMobileMenu} />
        <SideBar />
        {/* <button type="button" onClick={ refreshPage }> <span>Reload</span> </button> 
refreshPage function: */}

        <div className="main-panel">
          {/* { make all your routes here} */}
          <Header />
          <Switch>
            {/* <Route path="/login" component={App} /> */}
            <Route path="/signout" component={Signout} />
            {/* <Route exact path="/" component={Mypage} /> */}
            <Route path="/mypage" component={Mypage} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/components" component={Components} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/forms" component={Forms} />
            <Route path="/tables" component={Tables} />
            <Route path="/maps" component={MapsPage} />
            <Route path="/charts" component={Charts} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/userInfo" component={UserInfo} />

            {/* <Route render={() => <h3>ERROR 404</h3>} />}
          {/* <Route Redirect to="/" />*/}
          </Switch>

          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProp = state => ({
  mobileNavVisibility: state.Layout.mobileNavVisibility
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideMobileMenu: () => dispatch(setMobileNavVisibility(false))
});

export default withRouter(
  connect(
    mapStateToProp,
    mapDispatchToProps
  )(Main)
);
