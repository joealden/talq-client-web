import React from "react";
import styled from "styled-components";

import SearchBox from "../SearchBox";
import AllUsersList from "./AllUsersList";

interface user {
  username: string;
}

interface AllUsersProps {
  users: Array<user>;
  friends: Array<user>;
}

interface AllUsersState {
  searchTerm: string;
}

class AllUsers extends React.Component<AllUsersProps, AllUsersState> {
  state = {
    searchTerm: ""
  };

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() });
  };

  render() {
    const { users, friends } = this.props;

    if (users.length === 0) {
      return (
        <CenterDiv>
          <p>You are the sole member of talq :(</p>
        </CenterDiv>
      );
    }

    return (
      <div>
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
        <ListWrapper>
          <AllUsersList
            users={users}
            friends={friends}
            searchTerm={this.state.searchTerm}
          />
        </ListWrapper>
      </div>
    );
  }
}

export default AllUsers;

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListWrapper = styled.div`
  ul {
    list-style: none;
  }
`;
