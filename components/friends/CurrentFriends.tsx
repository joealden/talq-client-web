import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import ShowApolloError from "../ApolloError";
import CurrentFriendsList from "./CurrentFriendsList";

export const USER_FRIENDS_QUERY = gql`
  query USER_FRIENDS_QUERY {
    user {
      friends {
        username
      }
    }
  }
`;

/* TODO: Generate automatically with apollo codegen */
export interface IUserFriendsQuery {
  user: {
    friends: Array<{
      username: string;
    }>;
  };
}

const CurrentFriends = () => (
  <Query query={USER_FRIENDS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;

      if (data && data.user) {
        if (data.user.friends && data.user.friends.length === 0) {
          return (
            <EmptyListWrapper>
              <p>You don't have any friends.</p>
            </EmptyListWrapper>
          );
        }

        return (
          <div>
            <ShowApolloError error={error} />
            <ListWrapper>
              <CurrentFriendsList friends={data.user.friends} />
            </ListWrapper>
          </div>
        );
      }

      return null;
    }}
  </Query>
);

export default CurrentFriends;

const EmptyListWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;
