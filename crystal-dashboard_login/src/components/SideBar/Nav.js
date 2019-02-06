import React, { Component } from "react";
import { a, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";

class Nav extends Component {
  state = {};

  render() {
    console.log("Nav", this.props);
    let { location } = this.props;
    console.log("NNNN", location);
    return (
      <ul className="nav">
        <li className={this.isPathActive("/mypage") ? "active" : null}>
          <a href="/mypage">
            {/* {for url} */}
            <i className="pe-7s-users" />
            <p>Mypage</p>
          </a>
        </li>
        <li className={this.isPathActive("/dashboard") ? "active" : null}>
          <a href="/dashboard">
            <i className="pe-7s-graph" />
            <p>Dashboard</p>
          </a>
        </li>
        <li
          className={
            this.isPathActive("/components") || this.state.componentMenuOpen
              ? "active"
              : null
          }
        >
          <a
            onClick={() =>
              this.setState({
                componentMenuOpen: !this.state.componentMenuOpen
              })
            }
            data-toggle="collapse"
          >
            <i className="pe-7s-plugin" />
            <p>
              Components
              <b className="caret" />
            </p>
          </a>
          <Collapse in={this.state.componentMenuOpen}>
            <div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/components/buttons") ? "active" : null
                  }
                >
                  <a href="/components/buttons">Buttons</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/grid") ? "active" : null
                  }
                >
                  <a href="/components/grid">Grid System</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/icons") ? "active" : null
                  }
                >
                  <a href="/components/icons">Icons</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/notifications")
                      ? "active"
                      : null
                  }
                >
                  <a href="/components/notifications">Notifications</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/panels") ? "active" : null
                  }
                >
                  <a href="/components/panels">Panels</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/sweetalert")
                      ? "active"
                      : null
                  }
                >
                  <a href="/components/sweetalert">Sweet Alert</a>
                </li>
                <li
                  className={
                    this.isPathActive("/components/typography")
                      ? "active"
                      : null
                  }
                >
                  <a href="/components/typography">Typography</a>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>
        <li
          className={
            this.isPathActive("/forms") || this.state.formMenuOpen
              ? "active"
              : null
          }
        >
          <a
            onClick={() =>
              this.setState({ formMenuOpen: !this.state.formMenuOpen })
            }
            data-toggle="collapse"
          >
            <i className="pe-7s-note2" />
            <p>
              Forms <b className="caret" />
            </p>
          </a>
          <Collapse in={this.state.formMenuOpen}>
            <div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/forms/regular-forms") ? "active" : null
                  }
                >
                  <a href="/forms/regular-forms">Regular Forms</a>
                </li>
                <li
                  className={
                    this.isPathActive("/forms/extended-forms") ? "active" : null
                  }
                >
                  <a href="/forms/extended-forms">Extended Forms</a>
                </li>
                <li
                  className={
                    this.isPathActive("/forms/validation-forms")
                      ? "active"
                      : null
                  }
                >
                  <a href="/forms/validation-forms">Validation Forms</a>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>
        <li
          className={
            this.isPathActive("/tables") || this.state.tableMenuOpen
              ? "active"
              : null
          }
        >
          <a
            onClick={() =>
              this.setState({ tableMenuOpen: !this.state.tableMenuOpen })
            }
            data-toggle="collapse"
          >
            <i className="pe-7s-news-paper" />
            <p>
              Tables <b className="caret" />
            </p>
          </a>
          <Collapse in={this.state.tableMenuOpen}>
            <div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/tables/regular-tables")
                      ? "active"
                      : null
                  }
                >
                  <a href="/tables/regular-tables">Regular Table</a>
                </li>
                <li
                  className={
                    this.isPathActive("/tables/extended-tables")
                      ? "active"
                      : null
                  }
                >
                  <a href="/tables/extended-tables">Extended Tables</a>
                </li>
                <li
                  className={
                    this.isPathActive("/tables/fixed-data-table")
                      ? "active"
                      : null
                  }
                >
                  <a href="/tables/react-bootstrap-table">
                    React Bootstrap Table
                  </a>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>
        <li
          className={
            this.isPathActive("/maps") || this.state.mapMenuOpen
              ? "active"
              : null
          }
        >
          <a
            onClick={() =>
              this.setState({ mapMenuOpen: !this.state.mapMenuOpen })
            }
            data-toggle="collapse"
          >
            <i className="pe-7s-map-marker" />
            <p>
              Map <b className="caret" />
            </p>
          </a>
          <Collapse in={this.state.mapMenuOpen}>
            <div>
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/maps/google-map") ? "active" : null
                  }
                >
                  <a href="/maps/google-map">Google Map</a>
                </li>
                <li
                  className={
                    this.isPathActive("/maps/vector-map") ? "active" : null
                  }
                >
                  <a href="/maps/vector-map">Vector Map</a>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>
        <li className={this.isPathActive("/charts") ? "active" : null}>
          <a href="/charts">
            <i className="pe-7s-graph" />
            <p>Charts</p>
          </a>
        </li>
        <li className={this.isPathActive("/calendar") ? "active" : null}>
          <a href="/calendar">
            <i className="pe-7s-date" />
            <p>Calendar</p>
          </a>
        </li>
      </ul>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Nav);
