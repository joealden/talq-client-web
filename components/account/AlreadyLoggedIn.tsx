import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import Link from "next/link";
import Router from "next/router";

import constants from "../../utils/constants";
import ShowApolloError from "../ApolloError";
import { AccountPageHeader } from "./account";

const USERNAME_QUERY = gql`
  query USERNAME_QUERY {
    user {
      username
    }
  }
`;

/* TODO: Extract signout button into its own component */
const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const AlreadyLoggedIn = () => (
  <Main>
    <Wrapper>
      <AccountPageHeader />
      <InnerWrapper>
        <p>
          You are already logged in as:{" "}
          <Query query={USERNAME_QUERY}>
            {({ loading, data, error }) => {
              if (loading) return <span>...</span>;
              if (error) {
                return (
                  <React.Fragment>
                    <ShowApolloError error={error} />
                    <span>...</span>
                  </React.Fragment>
                );
              }

              return <span>{data.user.username}</span>;
            }}
          </Query>
        </p>
        <p>
          If you want to continue using this account, please click{" "}
          <Link href="/chat">
            <a>here</a>
          </Link>{" "}
          to go the chat page.
        </p>

        <Mutation mutation={SIGNOUT_MUTATION}>
          {(signOut, { loading, error, client }) => {
            return (
              <React.Fragment>
                <ShowApolloError error={error} />
                <p>
                  If you want to switch accounts, please click{" "}
                  <button
                    disabled={loading}
                    onClick={async event => {
                      event.preventDefault();
                      /**
                       * Perform the logout mutation which deletes the token
                       * cookie
                       */

                      await signOut();
                      localStorage.removeItem("loggedIn");

                      /* Redirect the user to the signin page */
                      await Router.push({ pathname: "/signin" });

                      /**
                       * Required so that data is not left in the cache after
                       * the user has logged out. This is so that if the user
                       * was to log in again in the same session into another
                       * account, the data in the cache from the previous
                       * account could be used. This would be a security issue
                       * as it would mean the newly logged in user could
                       * potentially see data such as chats, messages, and
                       * personal user data such as their email address and
                       * their friends.
                       */
                      client.resetStore();
                    }}
                  >
                    here
                  </button>
                  . This will log you out and redirect you to the sign in page.
                </p>
              </React.Fragment>
            );
          }}
        </Mutation>
      </InnerWrapper>
    </Wrapper>
  </Main>
);

export default AlreadyLoggedIn;

const Main = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  text-align: center;

  h1 {
    margin-bottom: 6px;
    font-size: 36px;
  }

  h2 {
    margin-bottom: 32px;
  }
`;

const InnerWrapper = styled.div`
  p {
    margin: 0;

    &:first-child {
      margin-bottom: 32px;
    }

    &:nth-child(2) {
      margin-bottom: 8px;
    }

    span {
      color: ${constants.color};
    }

    a {
      color: ${constants.color};
    }

    button {
      border: none;
      font-weight: normal;
      color: ${constants.color};
      background-color: transparent;
      cursor: pointer;
    }
  }
`;
