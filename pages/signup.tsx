import React from "react";

import {
  AccountPageHeader,
  AccountPageWrapper
} from "../components/account/account";
import SignUp from "../components/account/SignUp";

const SignupPage = () => (
  <AccountPageWrapper>
    <AccountPageHeader />
    <SignUp />
  </AccountPageWrapper>
);

export default SignupPage;
