import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation, FetchResult } from "react-apollo";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";
import { DataProxy } from "apollo-cache";

import {
  REMOVE_FRIEND_MUTATION,
  updateCacheForFriendRemoval
} from "./CurrentFriendsListItem";

import {
  USER_FRIENDS_AND_ALL_USERS_QUERY,
  UsersQueryResultType
} from "../../pages/friends";

const ADD_FRIEND_MUTATION = gql`
  mutation ADD_FRIEND_MUTATION($username: String!) {
    addFriend(username: $username) {
      username
    }
  }
`;

interface user {
  username: string;
}

interface AllUsersListItemProps {
  user: user;
  friends: Array<user>;
}

const AllUsersListItem = ({ user, friends }: AllUsersListItemProps) => (
  <UserDetailsContext.Consumer>
    {({ username }) => {
      /**
       * Do not render a button for the currently
       * logged in user (because a user should not
       * be able to add themselves as a friend).
       */
      if (user.username === username) return null;

      /**
       * NOTE:
       * 'some' method used instead of 'includes'
       * because of how JavaScipt handles
       * referential equality between objects.
       */

      const userIsAlreadyAFriend = friends.some(
        friend => friend.username === user.username
      );

      if (userIsAlreadyAFriend) {
        return (
          <Mutation mutation={REMOVE_FRIEND_MUTATION}>
            {(removeFriend, { loading, error }) => (
              <li>
                <ShowApolloError error={error} />
                <div>{user.username}</div>
                <RemoveButton
                  disabled={loading}
                  onClick={() => {
                    removeFriend({
                      variables: { username: user.username },
                      update: (cache, result) => {
                        updateCacheForFriendRemoval({
                          cache,
                          result,
                          friendsUsernameToDelete: user.username
                        });
                      },
                      optimisticResponse: {
                        __typename: "Mutation",
                        removeFriend: {
                          __typename: "User",
                          username
                        }
                      }
                    });
                  }}
                >
                  Remove
                </RemoveButton>
              </li>
            )}
          </Mutation>
        );
      }

      return (
        <Mutation mutation={ADD_FRIEND_MUTATION}>
          {(addFriend, { loading, error }) => (
            <li>
              <ShowApolloError error={error} />
              <div>{user.username}</div>
              <AddButton
                disabled={loading}
                onClick={() => {
                  addFriend({
                    variables: { username: user.username },
                    update: (cache, result) => {
                      updateCacheForFriendAddition({
                        cache,
                        result,
                        friendsUsernameToAdd: user.username
                      });
                    },
                    optimisticResponse: {
                      __typename: "Mutation",
                      addFriend: {
                        __typename: "User",
                        username
                      }
                    }
                  });
                }}
              >
                Add
              </AddButton>
            </li>
          )}
        </Mutation>
      );
    }}
  </UserDetailsContext.Consumer>
);

export default AllUsersListItem;

interface IUpdateCacheForFriendAddition {
  cache: DataProxy;
  result: FetchResult<any, Record<string, any>>;
  friendsUsernameToAdd: string;
}

export const updateCacheForFriendAddition = ({
  cache,
  result,
  friendsUsernameToAdd
}: IUpdateCacheForFriendAddition) => {
  /* Errors are already handled in component */
  if (!result.errors) {
    let data: UsersQueryResultType = cache.readQuery({
      query: USER_FRIENDS_AND_ALL_USERS_QUERY
    });

    data.user.friends.push({
      __typename: "User",
      username: friendsUsernameToAdd
    });

    cache.writeQuery({ query: USER_FRIENDS_AND_ALL_USERS_QUERY, data });
  }
};

const AddButton = styled.button`
  &:hover {
    background-color: #66cd00;
  }
`;

const RemoveButton = styled.button`
  &:hover {
    background-color: #ea3232;
  }
`;
