import React from "react";
import gql from "graphql-tag";
import { Mutation, FetchResult } from "react-apollo";

import { UserDetailsContext } from "../layout";
import ShowApolloError from "../ApolloError";
import { DataProxy } from "apollo-cache";

import {
  USER_FRIENDS_AND_ALL_USERS_QUERY,
  UsersQueryResultType
} from "../../pages/friends";

export const REMOVE_FRIEND_MUTATION = gql`
  mutation REMOVE_FRIEND_MUTATION($username: String!) {
    removeFriend(username: $username) {
      username
    }
  }
`;

interface CurrentFriendsListItemProps {
  friend: {
    username: string;
  };
}

const CurrentFriendsListItem = ({ friend }: CurrentFriendsListItemProps) => (
  <UserDetailsContext.Consumer>
    {({ username }) => (
      <Mutation mutation={REMOVE_FRIEND_MUTATION}>
        {(removeFriend, { loading, error }) => (
          <li>
            <ShowApolloError error={error} />
            <div>{friend.username}</div>
            <button
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
            </button>
          </li>
        )}
      </Mutation>
    )}
  </UserDetailsContext.Consumer>
);

export default CurrentFriendsListItem;

export interface IUpdateCacheForFriendRemoval {
  cache: DataProxy;
  result: FetchResult<any, Record<string, any>>;
  friendsUsernameToDelete: string;
}

export const updateCacheForFriendRemoval = ({
  cache,
  result,
  friendsUsernameToDelete
}: IUpdateCacheForFriendRemoval) => {
  /* Errors are already handled in component */
  if (!result.errors) {
    let data: UsersQueryResultType = cache.readQuery({
      query: USER_FRIENDS_AND_ALL_USERS_QUERY
    });

    data.user.friends = data.user.friends.filter(
      friend => friend.username !== friendsUsernameToDelete
    );

    cache.writeQuery({ query: USER_FRIENDS_AND_ALL_USERS_QUERY, data });
  }
};
