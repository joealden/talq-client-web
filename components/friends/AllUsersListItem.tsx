import React from "react";
import { Mutation } from "react-apollo";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";

import {
  ADD_FRIEND_MUTATION,
  REMOVE_FRIEND_MUTATION,
  updateCacheForFriendAddition,
  updateCacheForFriendRemoval,
  user,
  RemoveButton,
  AddButton
} from "./utils";

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
