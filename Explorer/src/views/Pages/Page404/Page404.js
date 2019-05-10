import React, { Component } from "react";
import $ from "jquery";
//import "./App.css";
const Web3 = require("web3");
//const web3 = new Web3("http://104.211.188.201:7545");
const web3 = new Web3("http://127.0.0.1:7545");

console.log(web3);

class Page404 extends Component {
  state = {
    blockNumber: 0
  };
  convertTimestamp = time => {
    var d = new Date(time * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;
    if (hh > 12) {
      h = hh - 12;
      ampm = "PM";
    } else if (hh === 12) {
      h = 12;
      ampm = "PM";
    } else if (hh === 0) {
      h = 12;
    }
    // ie: 2014-03-24, 3:00 PM
    var time1 = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
    return time1;
  };

  componentDidMount() {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ blockNumber: 0 });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.blockNumber);
  }

  timer = () => {
    web3.eth.getBlockNumber().then(latestBlock => {
      console.log(latestBlock);
      if (this.state.blockNumber !== latestBlock) {
        // List blocks in table
        for (var i = this.state.blockNumber + 1; i <= latestBlock; i++) {
          web3.eth.getBlock(i).then(block => {
            var number = block.number;
            var hash = block.transactions[0];
            var time = block.timestamp;
            var gas = block.gasUsed;
            var time = this.convertTimestamp(block.timestamp);
            console.log("time=", time);
            web3.eth.getTransaction(hash).then(sender => {
              console.log(sender.from);
              $("tbody").append(
                "<tr><td>" +
                sender.from +
                "<br>" +
                sender.to +
                "</td><td>" +
                number +
                "</td><td>" +
                time +
                "</td><td>" +
                hash +
                "</tr>"
              );
            });
          });
        }
        this.setState({ blockNumber: latestBlock });
      }
    });
  };

  render() {
    //setInterval();

    return (
      <div className="Page404">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h1>Blockchain Explorer</h1>
              <h3> Latest 5 blocks </h3>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">From/To Addresses</th>
                    <th scope="col">Block</th>
                    <th scope="col">Timestamp</th>
                    <th scope="col">TxHash</th>
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page404;