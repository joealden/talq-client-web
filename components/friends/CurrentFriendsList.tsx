import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation, FetchResult } from "react-apollo";

import { UserDetailsContext } from "../layout";
import SearchBox from "../SearchBox";
import ShowApolloError from "../ApolloError";
import { DataProxy } from "apollo-cache";
import { USER_FRIENDS_QUERY, IUserFriendsQuery } from "./CurrentFriends";
import constants from "../../utils/constants";

const REMOVE_FRIEND_MUTATION = gql`
  mutation REMOVE_FRIEND_MUTATION($username: String!) {
    removeFriend(username: $username) {
      username
    }
  }
`;

interface IUpdateCacheForFriendRemoval {
  cache: DataProxy;
  result: FetchResult<any, Record<string, any>>;
  friendsUsernameToDelete: string;
}

const updateCacheForFriendRemoval = ({
  cache,
  result,
  friendsUsernameToDelete
}: IUpdateCacheForFriendRemoval) => {
  /* Errors are already handled in component */
  if (!result.errors) {
    let data: IUserFriendsQuery = cache.readQuery({
      query: USER_FRIENDS_QUERY
    });

    data.user.friends = data.user.friends.filter(
      friend => friend.username !== friendsUsernameToDelete
    );

    cache.writeQuery({ query: USER_FRIENDS_QUERY, data });
  }
};

interface CurrentFriendsListProps {
  friends: Array<{ username: string }>;
}

/* TODO: Improve tying */
interface CurrentFriendsListState {
  searchTerm: string;
  filteredFriends: any;
}

class CurrentFriendsList extends React.Component<
  CurrentFriendsListProps,
  CurrentFriendsListState
> {
  state = {
    searchTerm: "",
    filteredFriends: this.props.friends
  };

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() }, () => {
      this.updateFilteredFriendsState(this.state.searchTerm);
    });
  };

  updateFilteredFriendsState = (searchTerm: string) => {
    const filteredFriends = this.props.friends.filter(friend =>
      friend.username.includes(searchTerm)
    );
    this.setState({ filteredFriends });
  };

  render() {
    return (
      <Mutation mutation={REMOVE_FRIEND_MUTATION}>
        {(removeFriend, { loading, error, client }) => (
          <UserDetailsContext.Consumer>
            {({ username }) => (
              <React.Fragment>
                <SearchBox
                  boxMargin={10}
                  type="search"
                  title="Search current friends"
                  placeholder="Search for current friends..."
                  spellCheck={false}
                  autoComplete="off"
                  onChange={this.updateSearchTermState}
                  value={this.state.searchTerm}
                />
                <CurrentFriendsListWrapper>
                  <ShowApolloError error={error} />
                  {this.state.filteredFriends.length !== 0 ? (
                    this.state.filteredFriends.map(user => (
                      <li key={user.username}>
                        <div>{user.username}</div>
                        <button
                          disabled={loading}
                          onClick={() =>
                            removeFriend({
                              variables: { username: user.username },
                              update: (cache, result) => {
                                updateCacheForFriendRemoval({
                                  cache,
                                  result,
                                  friendsUsernameToDelete: user.username
                                });

                                /**
                                 * Force list to refresh
                                 *
                                 * TODO: Below issue has been solved. Figure
                                 * out if there is a cleaner way of fixing it
                                 * without requerying the cache.
                                 * ------------------------------------------
                                 * Fix console warning about calling
                                 * setState on unmount component. This happens
                                 * when the mutation removes the user's only
                                 * friend. This causes the CurrentFriendsList
                                 * component to unmount before this state update
                                 * is called.
                                 */

                                const data: IUserFriendsQuery = cache.readQuery(
                                  {
                                    query: USER_FRIENDS_QUERY
                                  }
                                );

                                if (data.user.friends.length !== 0) {
                                  this.updateFilteredFriendsState(
                                    this.state.searchTerm
                                  );
                                }
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
                    ))
                  ) : (
                    <NoMatches>
                      None of your friend's usernames match this search term.
                    </NoMatches>
                  )}
                </CurrentFriendsListWrapper>
              </React.Fragment>
            )}
          </UserDetailsContext.Consumer>
        )}
      </Mutation>
    );
  }
}

export default CurrentFriendsList;

const CurrentFriendsListWrapper = styled.ul`
  li {
    padding: 5px 10px;

    &:hover {
      background-color: #f5f6f7;
    }

    display: flex;
    justify-content: space-between;

    div {
      font-size: 15px;
      display: flex;
      align-items: center;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background-color: ${constants.color};
      padding: 5px 8px;
      color: white;
      font-weight: normal;
      font-size: 15px;

      &:hover {
        background-color: #ea3232;
      }
    }
  }
`;

const NoMatches = styled.div`
  text-align: center;
  font-size: 15px;
  margin-top: 12px;
`;
