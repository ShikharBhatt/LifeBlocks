import React, { Component } from "react";
import { persistor } from "../config/configureStore";
import App from "../App";
import Main from "../pages/Main";
import { connect } from "react-redux";
import LoginForm from "./Login";

class SignedOut extends Component {
  render() {
    setTimeout(() => {
      alert("Safely logged out");
    }, 1000);

    return (
      <div>
        <App />
      </div>
    );
  }
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
)(SignedOut);
