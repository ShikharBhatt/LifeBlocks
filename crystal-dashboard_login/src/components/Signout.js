import React, { Component } from "react";
import { persistor } from "../config/configureStore";
import App from "../App";
import Main from "../pages/Main";
import { connect } from "react-redux";
import LoginForm from "./Login";
import SignedOut from "./SignedOut";

class Signout extends Component {
  render() {
    this.props.attach();

    //persistor.purge();

    //  setTimeout(() => {
    // alert("logging out");
    //  }, 1000);
    //window.history.push("/");
    return (window.location.href = "/login");
  }
  /* */
}

const mapDispatchToProps = dispatch => {
  return {
    attach: () => {
      dispatch({
        type: "LOGOUT"
      });
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Signout);
