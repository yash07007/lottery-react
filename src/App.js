import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

window.ethereum.enable();

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transation success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been enterred!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div className="container">
        <div className="row text-center App">
          <div className="offset-2 col-8">
            <div className="App-ticket">
              <h1>Feeling Lucky?</h1>
              <h3>Try your luck by entering into our lottery.</h3>
              <hr />
              <p>
                Creator of this Lottery Ticket:{" "}
                <strong> {this.state.manager}. </strong>
              </p>
              <p>
                Number of People in the Lottery:{" "}
                <strong>{this.state.players.length}</strong>
              </p>
              <p>
                Winning Sum:{" "}
                <strong>
                  {web3.utils.fromWei(this.state.balance, "ether")}
                </strong>{" "}
                ether!
              </p>
              <hr />
              <form onSubmit={this.onSubmit}>
                <h4>Remember! Greater Risks = Greater Rewards.</h4>
                <div className="row">
                  <div className="offset-4 col-4">
                    <input
                      className="form-control text-center"
                      placeHolder="Enter Amount in Ether"
                      value={this.state.value}
                      onChange={event =>
                        this.setState({ value: event.target.value })
                      }
                    />
                    <button className="btn btn-dark mt-2 btn-block">
                      Enter
                    </button>
                  </div>
                </div>
              </form>
              <hr />
              <h4>Ready to pick a winner?</h4>
              <button className="btn btn-dark" onClick={this.onClick}>
                Pick Winner!
              </button>
              <hr />
              <h1>{this.state.message}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
