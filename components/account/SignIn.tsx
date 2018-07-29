import React from "react";
import Link from "next/link";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import ShowApolloError from "../ApolloError";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($username: String!, $password: String!) {
    signin(username: $username, password: $password) {
      username
    }
  }
`;

export interface SignInState {
  username: string;
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
    username: "",
    password: "",
    disabled: false
  };

  updateUsernameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  updatePasswordState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  render() {
    const { username, password } = this.state;

    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={{
          username,
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
                localStorage.setItem("loggedIn", "true");
                Router.push({ pathname: "/chat" });
              }}
            >
              <ShowApolloError error={error} />
              <fieldset
                disabled={loading || this.state.disabled}
                aria-busy={loading || this.state.disabled}
              >
                <input
                  value={this.state.username}
                  onChange={this.updateUsernameState}
                  type="text"
                  placeholder="Username"
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
