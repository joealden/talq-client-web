import React from "react";

import SearchBox from "../SearchBox";
import AllUsersList from "./AllUsersList";

import { user, CenterDiv, ListWrapper } from "./utils";

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

    /* Users length will be 1 as the current user is included */
    if (users.length === 1) {
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
