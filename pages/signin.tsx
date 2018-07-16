import React from "react";
import Link from "next/link";

import { AccountPageHeader, AccountPageWrapper } from "../components/account";

const SigninPage = () => (
  <AccountPageWrapper>
    <AccountPageHeader />
    <form>
      <input type="email" placeholder="Email address" autoComplete="off" />
      <input type="password" placeholder="Password" autoComplete="off" />
      <button>Sign In</button>
      <span>
        Don't have an account?{" "}
        <Link href="/signup">
          <a>Sign Up</a>
        </Link>
      </span>
    </form>
  </AccountPageWrapper>
);

export default SigninPage;
