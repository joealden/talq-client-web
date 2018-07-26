import React from "react";
import Link from "next/link";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import ShowApolloError from "../ApolloError";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $username: String!
    $firstName: String!
    $lastName: String!
    $password: String!
  ) {
    signup(
      email: $email
      username: $username
      firstName: $firstName
      lastName: $lastName
      password: $password
    ) {
      username
    }
  }
`;

export interface SignUpState {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

class SignUp extends React.Component<{}, SignUpState> {
  state = {
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: ""
  };

  /* TODO: De-dup in a type safe way */
  updateEmailState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  updateUsernameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  updateFirstNameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: event.target.value });
  };

  updateLastNameState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: event.target.value });
  };

  updatePassword1State = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signUp, { loading, error }) => {
          return (
            <form
              onSubmit={async event => {
                event.preventDefault();
                await signUp();
                Router.push({ pathname: "/chat" });
              }}
            >
              <ShowApolloError error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <input
                  value={this.state.username}
                  onChange={this.updateUsernameState}
                  type="text"
                  placeholder="Username"
                  autoComplete="off"
                />
                <input
                  value={this.state.email}
                  onChange={this.updateEmailState}
                  type="email"
                  placeholder="Email address"
                  autoComplete="off"
                />
                <input
                  value={this.state.firstName}
                  onChange={this.updateFirstNameState}
                  type="text"
                  placeholder="First name"
                  autoComplete="off"
                />
                <input
                  value={this.state.lastName}
                  onChange={this.updateLastNameState}
                  type="text"
                  placeholder="Last name"
                  autoComplete="off"
                />
                <input
                  value={this.state.password}
                  onChange={this.updatePassword1State}
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                />
                <button type="submit">Sign Up</button>
              </fieldset>
              <span>
                Already have an account?{" "}
                <Link href="/signin">
                  <a>Sign In</a>
                </Link>
              </span>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignUp;
