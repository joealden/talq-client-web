import React from "react";
import { Mutation } from "react-apollo";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";
import {
  REMOVE_FRIEND_MUTATION,
  updateCacheForFriendRemoval,
  user,
  RemoveButton
} from "./utils";

interface CurrentFriendsListItemProps {
  friend: user;
}

const CurrentFriendsListItem = ({ friend }: CurrentFriendsListItemProps) => (
  <UserDetailsContext.Consumer>
    {({ username }) => (
      <Mutation mutation={REMOVE_FRIEND_MUTATION}>
        {(removeFriend, { loading, error }) => (
          <li>
            <ShowApolloError error={error} />
            <div>{friend.username}</div>
            <RemoveButton
              disabled={loading}
              onClick={() =>
                removeFriend({
                  variables: { username: friend.username },
                  update: (cache, result) => {
                    updateCacheForFriendRemoval({
                      cache,
                      result,
                      friendsUsernameToDelete: friend.username
                    });
                  },
                  optimisticResponse: {
                    __typename: "Mutation",
                    removeFriend: {
                      __typename: "User",
                      username
                    }
                  }
                })
              }
            >
              Remove
            </RemoveButton>
          </li>
        )}
      </Mutation>
    )}
  </UserDetailsContext.Consumer>
);

export default CurrentFriendsListItem;
