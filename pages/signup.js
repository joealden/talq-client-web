import React from "react";
import Link from "next/link";

import { AccountPageHeader, AccountPageWrapper } from "../components/account";

const SignupPage = () => (
  <AccountPageWrapper>
    <AccountPageHeader />
    <form>
      <input type="email" placeholder="Email address" autoComplete="off" />
      <input type="text" placeholder="First name" autoComplete="off" />
      <input type="text" placeholder="Last name" autoComplete="off" />
      <input type="password" placeholder="Password" autoComplete="off" />
      <input
        type="password"
        placeholder="Confirm password"
        autoComplete="off"
      />
      <button>Sign Up</button>
      <span>
        Already have an account?{" "}
        <Link href="/signin">
          <a>Sign In</a>
        </Link>
      </span>
    </form>
  </AccountPageWrapper>
);

export default SignupPage;
