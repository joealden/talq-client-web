import React from "react";

import loggedIn from "../utils/loggedIn";
import AlreadyLoggedIn from "../components/account/AlreadyLoggedIn";
import { AccountPageWrapper } from "../components/account/account";
import SignUp from "../components/account/SignUp";

const SignupPage = () => {
  /* Makes sure client side routing checks for auth */
  if (typeof window !== "undefined" && loggedIn()) {
    return <AlreadyLoggedIn />;
  }

  return (
    <AccountPageWrapper>
      <SignUp />
    </AccountPageWrapper>
  );
};

export default SignupPage;
