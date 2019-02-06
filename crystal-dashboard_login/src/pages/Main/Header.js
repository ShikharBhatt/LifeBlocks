import React from "react";
import { connect } from "react-redux";
import { Link, Redirect, location, NavLink } from "react-router-dom";
//import Signout from "../../components/Signout"
import { browserHistory } from "react-router";

import { toggleMobileNavVisibility } from "../../reducers/Layout";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormGroup,
  FormControl
} from "react-bootstrap";
//import Signout from "../../components/Signout";

this.Signout = () => {
  window.location.href = "/signout";
  // browserHistory.push("/login");
  console.log("hello");
  //browserHistory.push("/")
};

const Header = ({ showMobileMenu, toggleMobileNavVisibility }) => (
  <Navbar fluid={true}>
    <Navbar.Header>
      <button
        type="button"
        className="navbar-toggle"
        data-toggle="collapse"
        onClick={toggleMobileNavVisibility}
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
    </Navbar.Header>

    <Navbar.Collapse>
      <Nav>
        <NavItem>
          <i className="fa fa-dashboard" />
        </NavItem>
        <NavDropdown
          title={<i className="fa fa-globe" />}
          id="basic-nav-dropdown"
        >
          <MenuItem>Action</MenuItem>
          <MenuItem>Another action</MenuItem>
          <MenuItem>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <div className="separator" />
      <Navbar.Form pullLeft>
        <FormGroup>
          <span className="input-group-addon">
            <i className="fa fa-search" />
          </span>
          <FormControl type="text" placeholder="Type to search" />
        </FormGroup>
      </Navbar.Form>
      <Nav pullRight>
        <NavItem>Account</NavItem>
        <NavDropdown title="Dropdown" id="right-nav-bar">
          <MenuItem>Action</MenuItem>
          <MenuItem>Another action</MenuItem>
          <MenuItem>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem>Separated link</MenuItem>
        </NavDropdown>
        <NavItem>
          <button onClick={() => this.Signout()}>LOG OUT</button>
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const mapDispatchToProp = dispatch => ({
  toggleMobileNavVisibility: () => dispatch(toggleMobileNavVisibility())
});

export default connect(
  null,
  mapDispatchToProp
)(Header);
