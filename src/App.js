/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Import other components
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import LogIn from "./components/Login";
import Credits from "./components/Credits";
import Debits from "./components/Debits";
import axios from "axios";

class App extends Component {
  constructor() {
    // Create and initialize state
    super();
    this.state = {
      accountBalance: 0.0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: "A278+π",
        memberSince: "4/14/23",
      },
    };
  }
  async componentDidMount() {
    let debit_api_endpoint = "https://johnnylaicode.github.io/api/debits.json";
    let credit_api_endpoint =
      "https://johnnylaicode.github.io/api/credits.json";
    try {
      let debit_list = await axios.get(debit_api_endpoint);
      let credit_list = await axios.get(credit_api_endpoint);
      debit_list = debit_list.data;
      credit_list = credit_list.data;
      //Account Balance = Total Credit - Total Debit
      let totalDebit = 0;
      let totalCredit = 0;
      debit_list.forEach((debt) => {
        totalDebit += debt.amount;
      });

      let account_balance = totalCredit - totalDebit;
      account_balance = Math.round(account_balance * 100) / 100;
      this.setState({ debitList: debit_list, accountBalance: account_balance });
      this.setState({ creditList: credit_list });
    } catch (error) {
      // Print out errors at console when there is an error response
      if (error.response) {
        // The request was made, and the server responded with error message and status code.
        console.log(error.response.data); // Print out error message (e.g., Not Found)
        console.log(error.response.status); // Print out error status code (e.g., 404)
      }
    }
  }
  addCredits = (info) => {
    let credits = [...this.state.creditList];
    let newCreditSubmission = {
      amount: info.amount,
      description: info.description,
      date: info.date,
    };
    credits.push(newCreditSubmission);
    let newBalance = Number(this.state.accountBalance) + Number(info.amount);
    this.setState({ creditList: credits, accountBalance: newBalance });
    console.log(credits);
  };
  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {
    const newUser = { ...this.state.currentUser };
    newUser.userName = logInInfo.userName;
    this.setState({ currentUser: newUser });
  };

  render() {
    // Create Routes and React elements to be rendered using React components
    // Create React elements and pass input props to components
    const HomeComponent = () => (
      <Home accountBalance={this.state.accountBalance} />
    );
    const UserProfileComponent = () => (
      <UserProfile
        userName={this.state.currentUser.userName}
        memberSince={this.state.currentUser.memberSince}
      />
    );
    const LogInComponent = () => (
      <LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />
    );
    const CreditsComponent = () => (
      <Credits credits={this.state.creditList} addCredits={this.addCredits} />
    );
    const DebitsComponent = () => <Debits debits={this.state.debitList} />;

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-example-code-gh-pages">
        <div>
          <Route exact path="/" render={HomeComponent} />
          <Route exact path="/userProfile" render={UserProfileComponent} />
          <Route exact path="/login" render={LogInComponent} />
          <Route exact path="/credits" render={CreditsComponent} />
          <Route exact path="/debits" render={DebitsComponent} />
        </div>
      </Router>
    );
  }
}
export default App;
