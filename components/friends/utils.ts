import gql from "graphql-tag";
import styled from "styled-components";

import { DataProxy } from "apollo-cache";
import { FetchResult } from "react-apollo";

import constants from "../../utils/constants";

/* ------------------------------ TYPES ------------------------------ */

/**
 * __typename is needed to get rid
 * of Apollo warnings of missing field
 */

export interface user {
  __typename?: string;
  username: string;
}

export interface UsersQueryResultType {
  users: Array<user>;
  user: {
    friends: Array<user>;
  };
}

/* ---------------------- USERS + FRIENDS QUERY ---------------------- */

export const USER_FRIENDS_AND_ALL_USERS_QUERY = gql`
  query USER_FRIENDS_AND_ALL_USERS_QUERY {
    users {
      username
    }
    user {
      friends {
        username
      }
    }
  }
`;

/* ----------------------- ADD FRIEND MUTATION ----------------------- */

export const ADD_FRIEND_MUTATION = gql`
  mutation ADD_FRIEND_MUTATION($username: String!) {
    addFriend(username: $username) {
      username
    }
  }
`;

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

/* ---------------------- REMOVE FRIEND MUTATION ---------------------- */

export const REMOVE_FRIEND_MUTATION = gql`
  mutation REMOVE_FRIEND_MUTATION($username: String!) {
    removeFriend(username: $username) {
      username
    }
  }
`;

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

/* ----------------------------- STYLES ----------------------------- */

export const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;

export const StyledList = styled.ul`
  li {
    padding: 5px 10px;

    &:hover {
      background-color: #f5f6f7;
    }

    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      align-items: center;
      font-size: 15px;
    }

    button {
      background-color: ${constants.color};
      border: none;
      border-radius: 4px;
      padding: 5px 8px;
      font-weight: normal;
      font-size: 15px;
      color: white;
      cursor: pointer;

      /* So that both add and remove buttons are same width */
      min-width: 70px;

      &:disabled {
        background-color: grey;
        cursor: not-allowed;
      }
    }
  }
`;

export const NoMatches = styled.div`
  text-align: center;
  font-size: 15px;
  margin-top: 12px;
`;

export const AddButton = styled.button`
  &:hover {
    background-color: #66cd00;
  }
`;

export const RemoveButton = styled.button`
  &:hover {
    background-color: #ea3232;
  }
`;
