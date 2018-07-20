import React from "react";
import styled from "styled-components";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import Layout from "../components/layout";
import Error from "../components/account/AccountError";
import constants from "../utils/constants";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const SettingsPage = () => (
  <Layout mainTitle="Settings">
    <Mutation mutation={SIGNOUT_MUTATION}>
      {(signOut, { loading, error }) => {
        return (
          <SettingsWrapper>
            <Error error={error} />
            <button
              disabled={loading}
              onClick={async event => {
                event.preventDefault();
                await signOut();
                Router.push({ pathname: "/signin" });
              }}
            >
              Sign Out
            </button>
          </SettingsWrapper>
        );
      }}
    </Mutation>
  </Layout>
);

export default SettingsPage;

const SettingsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    border: 1px solid #0084ff;
    background-color: ${constants.color};
    color: white;
    border-radius: 4px;
    font-size: 17px;
    width: 286px;
    height: 42px;
    font-weight: normal;
    cursor: pointer;

    &:focus {
      box-shadow: 0 0 1px 2px rgba(88, 144, 255, 0.75),
        0 1px 1px rgba(0, 0, 0, 0.15);
    }

    &:active,
    &:disabled {
      opacity: 0.6;
    }
  }
`;
