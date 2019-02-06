import React, { Component } from "react";
import { Collapse } from "react-bootstrap";
import { connect } from "react-redux";
import cx from "classnames";
import { Link } from "react-router-dom";

class UserInfo extends Component {
  state = {
    isShowingUserMenu: false
  };

  render() {
    console.log("userinfo", this.props);
    //console.log("userState", this.state);
    let { user } = this.props;
    let { isShowingUserMenu } = this.state;
    return (
      <div className="user-wrapper">
        <div className="user">
          <img src={user.image} alt={user.name} className="photo" />
          <div className="userinfo">
            <div className="username">{user.name}</div>
            <div className="title">title</div>
          </div>
          <span
            onClick={() =>
              this.setState({
                isShowingUserMenu: !this.state.isShowingUserMenu
              })
            }
            className={cx("pe-7s-angle-down collapse-arrow", {
              active: isShowingUserMenu
            })}
          />
        </div>
        <Collapse in={isShowingUserMenu}>
          <ul className="nav user-nav">
            <li>
              {/* <Link to={"/userInfo"}>My Profile</Link> */}
              <a href="/userInfo">My Profile</a>
            </li>
            <li>
              {/* <Link to={"/profile"}>Edit Profile</Link> */}
              <a href="/profile">Edit Profile</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
          </ul>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth
});

export default connect(mapStateToProps)(UserInfo);
