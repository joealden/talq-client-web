import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import ShowApolloError from "../ApolloError";
import SearchBox from "../SearchBox";
import FriendsList from "./FriendsList";

const USER_FRIENDS_QUERY = gql`
  query USER_FRIENDS_QUERY {
    user {
      friends {
        username
      }
    }
  }
`;

interface user {
  username: string;
}

interface FriendsProps {
  members: Array<user>;
  removeMember: (usernameOfUserToRemove: string) => void;
  addMember: (usernameOfUserToAdd: string) => void;
}

interface FriendsState {
  searchTerm: string;
}

class Members extends React.Component<FriendsProps, FriendsState> {
  state = {
    searchTerm: ""
  };

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() });
  };

  render() {
    const { members, removeMember, addMember } = this.props;

    return (
      <Query query={USER_FRIENDS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;

          if (data && data.user) {
            if (data.user.friends.length === 0) {
              return (
                <CenterDiv>
                  <p>You don't have any friends.</p>
                </CenterDiv>
              );
            }

            return (
              <div>
                <ShowApolloError error={error} />
                <SearchBox
                  boxMargin={10}
                  type="search"
                  title="Search friends"
                  placeholder="Search for friends..."
                  spellCheck={false}
                  autoComplete="off"
                  onChange={this.updateSearchTermState}
                  value={this.state.searchTerm}
                />
                <ListWrapper>
                  <FriendsList
                    friends={data.user.friends}
                    members={members}
                    searchTerm={this.state.searchTerm}
                    removeMember={removeMember}
                    addMember={addMember}
                  />
                </ListWrapper>
              </div>
            );
          }

          return null;
        }}
      </Query>
    );
  }
}

export default Members;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    margin: 15px;
  }
`;

const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;
