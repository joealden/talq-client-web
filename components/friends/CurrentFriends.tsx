import React from "react";

import SearchBox from "../SearchBox";
import CurrentFriendsList from "./CurrentFriendsList";
import { user, CenterDiv, ListWrapper } from "./utils";

interface CurrentFriendsProps {
  friends: Array<user>;
}

interface CurrentFriendsState {
  searchTerm: string;
}

class CurrentFriends extends React.Component<
  CurrentFriendsProps,
  CurrentFriendsState
> {
  state = {
    searchTerm: ""
  };

  updateSearchTermState = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value.trim() });
  };

  componentDidUpdate() {
    /* Reset the search input if friends list becomes empty */
    if (this.props.friends.length === 0 && this.state.searchTerm !== "") {
      this.setState({ searchTerm: "" });
    }
  }

  render() {
    const { friends } = this.props;

    if (friends.length === 0) {
      return (
        <CenterDiv>
          <p>You don't have any friends.</p>
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
          <CurrentFriendsList
            friends={friends}
            searchTerm={this.state.searchTerm}
          />
        </ListWrapper>
      </div>
    );
  }
}

export default CurrentFriends;
