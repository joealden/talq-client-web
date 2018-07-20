import React from "react";
import Link from "next/link";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import ErrorMessage from "./AccountError";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      email
    }
  }
`;

export interface SignInState {
  email: string;
  password: string;
  /* 
   * Used so that fields stay disabled when a successful
   * login happens, the fields do not flash back to being
   * enabled for a small amount of time before the user is
   * redirect. This means that until the component unmounts,
   * the fields will be disabled.
   */
  disabled: boolean;
}

class SignIn extends React.Component<{}, SignInState> {
  state = {
    email: "",
    password: "",
    disabled: false
  };

  updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  updatePasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { email, password } = this.state;

    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={{
          email,
          password
        }}
      >
        {(signIn, { loading, error }) => {
          return (
            <form
              onSubmit={async event => {
                event.preventDefault();
                await signIn();
                this.setState({ disabled: true });
                Router.push({ pathname: "/chat" });
              }}
            >
              <ErrorMessage error={error} />
              <fieldset
                disabled={loading || this.state.disabled}
                aria-busy={loading || this.state.disabled}
              >
                <input
                  value={this.state.email}
                  onChange={this.updateEmailState}
                  type="email"
                  placeholder="Email address"
                  autoComplete="off"
                />
                <input
                  value={this.state.password}
                  onChange={this.updatePasswordState}
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                />
                <button type="submit">Sign In</button>
              </fieldset>
              <span>
                Don't have an account?{" "}
                <Link href="/signup">
                  <a>Sign Up</a>
                </Link>
              </span>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignIn;
