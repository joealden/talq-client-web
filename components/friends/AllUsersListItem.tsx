import React from "react";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";

/* TODO: Move documentNodes into utils file */
import {
  ADD_FRIEND_MUTATION,
  AddFriendMutation,
  REMOVE_FRIEND_MUTATION,
  RemoveFriendMutation,
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

const AllUsersListItem: React.SFC<AllUsersListItemProps> = ({
  user,
  friends
}) => (
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
          <RemoveFriendMutation mutation={REMOVE_FRIEND_MUTATION}>
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
                        //@ts-ignore
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
          </RemoveFriendMutation>
        );
      }

      return (
        <AddFriendMutation mutation={ADD_FRIEND_MUTATION}>
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
                      //@ts-ignore
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
        </AddFriendMutation>
      );
    }}
  </UserDetailsContext.Consumer>
);

export default AllUsersListItem;
