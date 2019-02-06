import React from "react";
import Welcome from "../Welcome";
import { stat } from "fs";
import Route from "react-router-dom";
import Main from "../pages/Main/";
import renderApp from "../index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import App from "../App";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.signIn = this.signIn.bind(this);
  }
  signIn = (username, password) => {
    alert(username + " === " + this.props.user.name);

    if (this.props.user.name === username) {
      //renderApp(Main);
      alert("Login Component Success");
      window.location.href = "/mypage";
    } else {
      //renderApp(App);
      alert("Login Component unsuccess");
      window.location.href = "/login";
    }

    // console.log("Uaddwezyyyser", this.props.user);
  };

  handleSignIn(e) {
    e.preventDefault();
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    //renderApp(Main);
    //console.log("bhai bhai", this.props);
    this.props.attach(username);

    this.signIn(username, password);
  }

  render() {
    // console.log("Login", this.props);
    return (
      <form onSubmit={this.handleSignIn.bind(this)}>
        <h3>Sign in</h3>
        <input type="text" ref="username" placeholder="enter you username" />
        <input type="password" ref="password" placeholder="enter password" />
        <input type="submit" value="Login" />
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth
  };
};
/*
  const mapDispatchToProps = dispatch => {
  return {
    destroyTodo : () => dispatch({
      type : 'DESTROY_TODO'
    })
  }*/
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
)(LoginForm);
