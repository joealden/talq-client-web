import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Layout from "../components/layout";

const userFriendQuery = gql`
  query {
    userFriends(userId: "test") {
      id
      email
    }
  }
`;

const NewChatPage = () => (
  <Layout mainTitle="New Chat">
    <ChatWrapper>
      <Query query={userFriendQuery}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return <p>{data.userFriends[0].email}</p>;
        }}
      </Query>
    </ChatWrapper>
  </Layout>
);

export default NewChatPage;

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
