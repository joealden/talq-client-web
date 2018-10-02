import React from "react";
import Router from "next/router";

import loggedIn from "../utils/loggedIn";

class HomePage extends React.Component {
  componentDidMount() {
    if (loggedIn()) {
      Router.push({ pathname: "/chat" });
    } else {
      Router.push({ pathname: "/signin" });
    }
  }

  render() {
    return null;
  }
}

export default HomePage;
