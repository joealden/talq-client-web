import React from "react";

import loggedIn from "../utils/loggedIn";
import AlreadyLoggedIn from "../components/account/AlreadyLoggedIn";
import { AccountPageWrapper } from "../components/account/account";
import SignIn from "../components/account/SignIn";

const SigninPage = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && loggedIn()) {
    return <AlreadyLoggedIn />;
  }

  return (
    <AccountPageWrapper>
      <SignIn />
    </AccountPageWrapper>
  );
};

export default SigninPage;
