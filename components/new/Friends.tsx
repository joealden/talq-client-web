import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { removeMember, addMember, CenterDiv, ListWrapper } from "./utils";
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

interface UserFriendsQueryData {
  user: {
    friends: Array<{
      username: string;
    }>;
  };
}

class UserFriendsQuery extends Query<UserFriendsQueryData> {}

interface FriendsProps {
  members: Array<{ username: string }>;
  removeMember: removeMember;
  addMember: addMember;
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
      <UserFriendsQuery query={USER_FRIENDS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;

          if (data && data.user) {
            if (data.user.friends.length === 0) {
              return (
                <CenterDiv>
                  <ShowApolloError error={error} />
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
      </UserFriendsQuery>
    );
  }
}

export default Members;
