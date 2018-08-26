import React from "react";

import loggedIn from "../utils/loggedIn";
import NotLoggedIn from "../components/account/NotLoggedIn";
import NewChat from "../components/new/NewChat";

const NewChatPage: React.SFC = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && !loggedIn()) {
    return <NotLoggedIn />;
  }

  return <NewChat />;
};

export default NewChatPage;
