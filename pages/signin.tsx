import React from "react";

import {
  AccountPageHeader,
  AccountPageWrapper
} from "../components/account/account";
import SignIn from "../components/account/SignIn";

const SigninPage = () => (
  <AccountPageWrapper>
    <AccountPageHeader />
    <SignIn />
  </AccountPageWrapper>
);

export default SigninPage;
