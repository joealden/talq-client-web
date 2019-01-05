import React from "react";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";
import {
  REMOVE_FRIEND_MUTATION,
  RemoveFriendMutation,
  updateCacheForFriendRemoval,
  user,
  RemoveButton
} from "./utils";

interface CurrentFriendsListItemProps {
  friend: user;
}

const CurrentFriendsListItem: React.SFC<CurrentFriendsListItemProps> = ({
  friend
}) => (
  <UserDetailsContext.Consumer>
    {({ username }) => (
      <RemoveFriendMutation mutation={REMOVE_FRIEND_MUTATION}>
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
                      //@ts-ignore
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
      </RemoveFriendMutation>
    )}
  </UserDetailsContext.Consumer>
);

export default CurrentFriendsListItem;
